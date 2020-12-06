import { Injectable } from '@nestjs/common';
import { AutoInsuranceLine } from 'src/risk/domain/entities/insurance-lines/auto-insurance-line.entity';
import { DisabilityInsuranceLine } from 'src/risk/domain/entities/insurance-lines/disability-insurance-line.entity';
import { HomeInsuranceLine } from 'src/risk/domain/entities/insurance-lines/home-insurance-line.entity';
import { LifeInsuranceLine } from 'src/risk/domain/entities/insurance-lines/life-insurance-line.entity';
import { InsurancePlansEnum } from 'src/risk/domain/enums/insurance-plans.enum';
import { CalculateRiskInput } from 'src/risk/usecases/calculate-risk-profile/calculate-risk-profile.input';
import { HouseFactory } from 'src/risk/domain/entities/factories/house.factory';
import { RiskProfileFactory } from 'src/risk/domain/entities/factories/risk-profile.factory';
import { UserFactory } from 'src/risk/domain/entities/factories/user.factory';
import { VehicleFactory } from 'src/risk/domain/entities/factories/vehicle.factory';

@Injectable()
export class CalculateRiskProfileUseCase {
  constructor(
    private readonly userFactory: UserFactory,
    private readonly houseFactory: HouseFactory,
    private readonly vehicleFactory: VehicleFactory,
    private readonly riskProfileFactory: RiskProfileFactory,
  ) {}

  public execute(
    payload: CalculateRiskInput,
  ): Record<string, InsurancePlansEnum> {
    const user = this.userFactory.create({
      age: payload.age,
      dependents: payload.dependents,
      income: payload.income,
      maritalStatus: payload.maritalStatus,
    });

    const { house, vehicle, riskQuestions } = payload;

    if (house) user.setHouse = this.houseFactory.create(house.ownershipStatus);
    if (vehicle) user.setVehicle = this.vehicleFactory.create(vehicle.year);

    const insuranceLines = {
      auto: AutoInsuranceLine,
      disability: DisabilityInsuranceLine,
      home: HomeInsuranceLine,
      life: LifeInsuranceLine,
    };

    const riskProfile = this.riskProfileFactory.create({
      user,
      riskQuestions,
      insuranceLines,
    });

    return riskProfile.getInsuranceLines();
  }
}
