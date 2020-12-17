import { InsuranceLine } from 'src/risk/domain/entities/insurance-lines/base-insurance-line.entity';
import { User } from 'src/risk/domain/entities/user.entity';
import { InsurancePlansEnum } from 'src/risk/domain/enums/insurance-plans.enum';

export class UmbrellaInsuranceLine extends InsuranceLine {
  constructor(user: User, baseScore: number) {
    super(user, baseScore);
  }

  process(): InsurancePlansEnum {
    return this.decreaseByAge().decreaseIfIncomeIsAboveThan(200000).getPlan();
  }
}
