import { User } from 'src/risk/domain/entities/user.entity';
import { InsurancePlansEnum } from 'src/risk/domain/enums/insurance-plans.enum';

export abstract class InsuranceLine {
  private _score = 0;
  private _user: User;

  constructor(user: User, baseScore: number) {
    this._user = user;
    this._score += baseScore;
  }

  public get user() {
    return this._user;
  }

  abstract process(): InsurancePlansEnum;

  protected decreaseByAge() {
    if (this.user.isYoungerThan(30)) {
      this._score -= 2;
    } else if (this.user.isOlderThan(30) && this.user.isYoungerThan(40)) {
      this._score--;
    }

    return this;
  }

  protected decreaseIfIncomeIsAboveThan(amount: number) {
    if (this.user.isIncomeAboveThan(amount)) {
      this._score--;
    }

    return this;
  }

  protected increaseIfHouseIsMortgaged() {
    if (this.user.house?.isMortgaged()) {
      this._score++;
    }

    return this;
  }

  protected increaseIfHasDependents() {
    if (this.user.hasDependents()) {
      this._score++;
    }

    return this;
  }

  protected increaseIfIsMarried() {
    if (this.user.isMarried()) {
      this._score++;
    }

    return this;
  }

  protected decreaseIfIsMarried() {
    if (this.user.isMarried()) {
      this._score--;
    }

    return this;
  }

  protected increaseByVehicleYear() {
    if (this.user.vehicle.wasProducedInTheLastFiveYears()) {
      this._score++;
    }

    return this;
  }

  protected getPlan(): InsurancePlansEnum {
    if (this._score < 1) return InsurancePlansEnum.ECONOMIC;
    if (this._score < 3) return InsurancePlansEnum.REGULAR;

    return InsurancePlansEnum.RESPONSIBLE;
  }

  protected get score() {
    return this._score;
  }
}
