import { Module } from '@nestjs/common';
import { HouseFactory } from 'src/risk/domain/entities/factories/house.factory';
import { RiskProfileFactory } from 'src/risk/domain/entities/factories/risk-profile.factory';
import { UserFactory } from 'src/risk/domain/entities/factories/user.factory';
import { VehicleFactory } from 'src/risk/domain/entities/factories/vehicle.factory';
import { UserRiskController } from 'src/risk/presentation/http/controllers/user-risk.controller';
import { CalculateRiskProfileUseCase } from 'src/risk/usecases/calculate-risk-profile/calculate-risk-profile.usecase';

@Module({
  imports: [],
  controllers: [UserRiskController],
  providers: [
    CalculateRiskProfileUseCase,
    HouseFactory,
    RiskProfileFactory,
    VehicleFactory,
    UserFactory,
  ],
})
export class RiskModule {}
