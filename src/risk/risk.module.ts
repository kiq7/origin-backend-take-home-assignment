import { Module } from '@nestjs/common';
import { UserRiskController } from 'src/risk/presentation/http/controllers/user-risk.controller';

@Module({
  imports: [],
  controllers: [UserRiskController],
  providers: [],
})
export class RiskModule {}
