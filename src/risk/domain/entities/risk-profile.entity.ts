import { InsuranceLine } from 'src/risk/domain/entities/insurance-lines/base-insurance-line.entity';
import { User } from 'src/risk/domain/entities/user.entity';
import { InsurancePlansEnum } from 'src/risk/domain/enums/insurance-plans.enum';

export type RiskProfileProps = {
  user: User;
  riskQuestions: number[];
  insuranceLines: Record<string, new (...args: any) => InsuranceLine>;
};

export class RiskProfile {
  private user: User;
  private riskQuestions: number[];
  private insuranceLines: Record<string, new (...args: any) => InsuranceLine>;
  private processedInsuranceLines: Record<string, InsurancePlansEnum> = {};
  private _riskQuestionsScore: number;

  constructor(props: RiskProfileProps) {
    Object.assign(this, props);

    this.calculateBaseScore();
    this.processInsuranceLines();
  }

  private calculateBaseScore = () => {
    this._riskQuestionsScore = this.riskQuestions?.reduce(
      (acc, cur) => acc + cur,
      0,
    );
  };

  private processInsuranceLines = () => {
    for (const insuranceLine of Object.keys(this.insuranceLines)) {
      this.processedInsuranceLines[insuranceLine] = new this.insuranceLines[
        insuranceLine
      ](this.user, this._riskQuestionsScore).process();
    }
  };

  public getInsuranceLines = () => this.processedInsuranceLines;

  public get riskQuestionsScore() {
    return this._riskQuestionsScore;
  }
}
