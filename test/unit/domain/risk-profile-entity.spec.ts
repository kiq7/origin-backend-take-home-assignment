import { InsuranceLine } from 'src/risk/domain/entities/insurance-lines/base-insurance-line.entity';
import { RiskProfile } from 'src/risk/domain/entities/risk-profile.entity';
import { User } from 'src/risk/domain/entities/user.entity';
import { InsurancePlansEnum } from 'src/risk/domain/enums/insurance-plans.enum';
import { MaritalStatusEnum } from 'src/risk/domain/enums/marital-status.enum';

class TestInsuranceLine extends InsuranceLine {
  constructor(user: User, baseScore = 0) {
    super(user, baseScore);
  }

  process(): InsurancePlansEnum {
    return InsurancePlansEnum.INELIGIBLE;
  }
}

describe('risk :: domain :: risk profile', () => {
  const user = new User({
    age: 0,
    dependents: 0,
    income: 0,
    maritalStatus: MaritalStatusEnum.MARRIED,
  });

  describe('base score calculation', () => {
    it('should sum risk questions', () => {
      const riskQuestions = [1, 0, 1];
      const expectedRiskQuestionsScore = 2;

      const riskProfile = new RiskProfile({
        user,
        riskQuestions,
        insuranceLines: {},
      });

      expect(riskProfile.riskQuestionsScore).toBe(expectedRiskQuestionsScore);
    });
  });

  describe('base score calculation', () => {
    it('should sum risk questions', () => {
      const riskQuestions = [1, 0, 1];
      const expectedRiskQuestionsScore = 2;

      const riskProfile = new RiskProfile({
        user,
        riskQuestions,
        insuranceLines: {},
      });

      expect(riskProfile.riskQuestionsScore).toBe(expectedRiskQuestionsScore);
    });
  });

  describe('insurance lines', () => {
    it('should process insurance lines', () => {
      const riskProfile = new RiskProfile({
        user,
        riskQuestions: [1, 1, 1],
        insuranceLines: {
          test: TestInsuranceLine,
        },
      });

      const insuranceLines = riskProfile.getInsuranceLines();

      expect(insuranceLines).toMatchObject({
        test: InsurancePlansEnum.INELIGIBLE,
      });
    });
  });
});
