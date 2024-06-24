import { Injectable } from '@nestjs/common';
import { Address, createPublicClient, http } from 'viem';
import { sepolia } from 'viem/chains';
import * as tokenJson from './assets/MyToken.json';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
	constructor(private configService: ConfigService) {}
	
	getHello(): string {
		return 'Hello World!';
	}

	getContractAddress(): Address {
		return this.configService.get<string>('TOKEN_ADDRESS') as Address;
	}

	async getTokenName(): Promise<any> {
		
		const publicClient = createPublicClient({
		  chain: sepolia,
		  transport: http(this.configService.get<string>('RPC_ENDPOINT_URL')),
		});

		const name = await publicClient.readContract({
		  address: this.getContractAddress(),
		  abi: tokenJson.abi,
		  functionName: "name"
		});

		return name;
	  }
}
