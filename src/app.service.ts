import { Injectable } from '@nestjs/common';
import { Address, createPublicClient, http, formatUnits, createWalletClient } from 'viem';
import { sepolia } from 'viem/chains';
import * as tokenJson from './assets/MyToken.json';
import { ConfigService } from '@nestjs/config';
import { privateKeyToAccount } from 'viem/accounts';

@Injectable()
export class AppService {
	publicClient;
	walletClient;

	constructor(private configService: ConfigService) {
		this.publicClient = createPublicClient({
			chain: sepolia,
			transport: http(this.configService.get<string>('RPC_ENDPOINT_URL')),
		});

		const account = privateKeyToAccount(`0x${this.configService.get<string>('PRIVATE_KEY')}`);
		this.walletClient = createWalletClient({
			account,
			chain: sepolia,
			transport: http(this.configService.get<string>('RPC_ENDPOINT_URL')),
		})
	}
	
	getHello(): string {
		return 'Hello World!';
	}

	getContractAddress(): Address {
		return this.configService.get<string>('TOKEN_ADDRESS') as Address;
	}

	async getTokenName(): Promise<any> {
		const name = await this.publicClient.readContract({
		  address: this.getContractAddress(),
		  abi: tokenJson.abi,
		  functionName: "name"
		});

		return name;
	}

	async getTotalSupply() {
		const totalSupply = await this.publicClient.readContract({
			address: this.getContractAddress(),
			abi: tokenJson.abi,
			functionName: "totalSupply"
		});

		const symbol = await this.publicClient.readContract({
			address: this.getContractAddress(),
			abi: tokenJson.abi,
			functionName: "symbol"
		});

		const decimals = await this.publicClient.readContract({
			address: this.getContractAddress(),
			abi: tokenJson.abi,
			functionName: "decimals"
		});

		const balanceString = `${formatUnits(totalSupply, decimals)} ${symbol}`;
		return balanceString;
	}

	async getTokenBalance(address: string) {
		const balance = await this.publicClient.readContract({
			address: this.getContractAddress(),
			abi: tokenJson.abi,
			functionName: "balanceOf",
			args: [address]
		});

		const symbol = await this.publicClient.readContract({
			address: this.getContractAddress(),
			abi: tokenJson.abi,
			functionName: "symbol"
		});

		const decimals = await this.publicClient.readContract({
			address: this.getContractAddress(),
			abi: tokenJson.abi,
			functionName: "decimals"
		});

		const balanceString = `${formatUnits(balance, decimals)} ${symbol}`;
		return balanceString;
		
	}

	async getTransactionReceipt(hash: string) {
		return await this.publicClient.getTransactionReceipt(hash);
	}

	getServerWalletAddress() {
		return this.walletClient.account.address;
	}

	async checkMinterRole(address: string) {
		const MINTER_ROLE = await this.publicClient.readContract({
			address: this.getContractAddress(),
			abi: tokenJson.abi,
			functionName: "MINTER_ROLE"
		});

		const hasRole = await this.publicClient.readContract({
			address: this.getContractAddress(),
			abi: tokenJson.abi,
			functionName: "hasRole",
			args: [MINTER_ROLE, address]
		});

		return hasRole ? `Address ${address} has Minter Role` : `Address ${address} does not have Minter Role`
	}
}
