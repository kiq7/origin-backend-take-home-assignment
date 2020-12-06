import { InsuranceLine } from 'src/risk/domain/entities/insurance-lines/base-insurance-line.entity';
import { User } from 'src/risk/domain/entities/user.entity';
import { InsurancePlansEnum } from 'src/risk/domain/enums/insurance-plans.enum';

export class TestInsuranceLine extends InsuranceLine {
  constructor(user: User, baseScore = 0) {
    super(user, baseScore);
  }

  process(): InsurancePlansEnum {
    throw new Error('Method not implemented.');
  }

  public decreaseByAge = () => super.decreaseByAge();
  public decreaseIfIncomeIsAboveThan = (amount: number) =>
    super.decreaseIfIncomeIsAboveThan(amount);
  public increaseIfHouseIsMortgaged = () => super.increaseIfHouseIsMortgaged();
  public increaseIfHasDependents = () => super.increaseIfHasDependents();
  public increaseIfIsMarried = () => super.increaseIfIsMarried();
  public decreaseIfIsMarried = () => super.decreaseIfIsMarried();
  public increaseByVehicleYear = () => super.increaseByVehicleYear();
  public getPlan = () => super.getPlan();
  public get score() {
    return super.score;
  }
}
