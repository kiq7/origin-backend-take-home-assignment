import { Injectable } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { RootModule } from 'src/root.module';

@Injectable()
export class ServerApplication {
  private readonly port: number = 3000; // TODO: use env vars;

  public async run(): Promise<void> {
    const app = await NestFactory.create(RootModule);

    await app.listen(this.port);
  }
}
