import { Module } from '@nestjs/common';
import { RiskModule } from 'src/risk/risk.module';

@Module({
  imports: [RiskModule],
  controllers: [],
  providers: [],
})
export class RootModule {}
