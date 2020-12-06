import { INestApplication, Injectable } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { InvalidUsecaseInputFilter } from 'src/risk/presentation/http/exception-filters/invalid-use-case-input.filter';
import { RootModule } from 'src/root.module';

@Injectable()
export class ServerApplication {
  private readonly port: number = 3000; // TODO: use env vars;

  public async run(): Promise<void> {
    const app = await NestFactory.create(RootModule);

    this.setupExceptionFilters(app);
    await app.listen(this.port);
  }

  private setupExceptionFilters(app: INestApplication): void {
    app.useGlobalFilters(new InvalidUsecaseInputFilter());
  }
}
