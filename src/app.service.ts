import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
	getHello(): string {
		return 'Hello World!';
	}

	getContractAddress(): string {
		return "0x2282A77eC5577365333fc71adE0b4154e25Bb2fa";
	}
}
