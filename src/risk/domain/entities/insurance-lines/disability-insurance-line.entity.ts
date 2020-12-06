import { InsuranceLine } from 'src/risk/domain/entities/insurance-lines/base-insurance-line.entity';
import { User } from 'src/risk/domain/entities/user.entity';
import { InsurancePlansEnum } from 'src/risk/domain/enums/insurance-plans.enum';

export class DisabilityInsuranceLine extends InsuranceLine {
  constructor(user: User, baseScore = 0) {
    super(user, baseScore);
  }

  process(): InsurancePlansEnum {
    if (!this.user.hasIncome() || this.user.isOlderThan(60)) {
      return InsurancePlansEnum.INELIGIBLE;
    }

    return this.decreaseByAge()
      .decreaseIfIncomeIsAboveThan(200000)
      .decreaseIfIsMarried()
      .increaseIfHouseIsMortgaged()
      .increaseIfHasDependents()
      .getPlan();
  }
}