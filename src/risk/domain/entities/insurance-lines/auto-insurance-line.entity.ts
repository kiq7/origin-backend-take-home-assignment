import { InsuranceLine } from 'src/risk/domain/entities/insurance-lines/base-insurance-line.entity';
import { User } from 'src/risk/domain/entities/user.entity';
import { InsurancePlansEnum } from 'src/risk/domain/enums/insurance-plans.enum';

export class AutoInsuranceLine extends InsuranceLine {
  constructor(user: User, baseScore: number) {
    super(user, baseScore);
  }

  public process(): InsurancePlansEnum {
    if (!this.user.hasVehicle()) {
      return InsurancePlansEnum.INELIGIBLE;
    }

    return this.decreaseByAge()
      .decreaseIfIncomeIsAboveThan(200000)
      .increaseByVehicleYear()
      .getPlan();
  }
}
