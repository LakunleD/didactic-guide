import { Injectable } from '@nestjs/common';
import { Address, createPublicClient, http, formatUnits } from 'viem';
import { sepolia } from 'viem/chains';
import * as tokenJson from './assets/MyToken.json';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
	publicClient;
	constructor(private configService: ConfigService) {
		this.publicClient = createPublicClient({
			chain: sepolia,
			transport: http(this.configService.get<string>('RPC_ENDPOINT_URL')),
		});
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
		const balance = await this.publicClient.readContract({
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

		const balanceString = `${formatUnits(balance, decimals)} ${symbol}`;
		return balanceString;
	}

	getTokenBalance(hash: string) {
		return this.publicClient.getTransactionReceipt(hash);
	}

	getTransactionReceipt(address: string) {
		return this.publicClient.readContract({
			address: this.getContractAddress(),
			abi: tokenJson.abi,
			functionName: "balanceOf",
			args: [address]
		});
	}
}
