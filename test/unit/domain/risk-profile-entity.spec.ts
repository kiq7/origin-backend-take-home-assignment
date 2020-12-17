import { InsuranceLine } from 'src/risk/domain/entities/insurance-lines/base-insurance-line.entity';
import { RiskProfile } from 'src/risk/domain/entities/risk-profile.entity';
import { User } from 'src/risk/domain/entities/user.entity';
import { InsurancePlansEnum } from 'src/risk/domain/enums/insurance-plans.enum';
import { MaritalStatusEnum } from 'src/risk/domain/enums/marital-status.enum';
import { makeFakeUser } from 'test/unit/utils/make-fake-user';

class TestInsuranceLine extends InsuranceLine {
  constructor(user: User, baseScore = 0) {
    super(user, baseScore);
  }

  process(): InsurancePlansEnum {
    return InsurancePlansEnum.RESPONSIBLE;
  }
}

class EconomicInsuranceLine extends InsuranceLine {
  constructor(user: User, baseScore = 0) {
    super(user, baseScore);
  }

  process(): InsurancePlansEnum {
    return InsurancePlansEnum.ECONOMIC;
  }
}

class RegularInsuranceLine extends InsuranceLine {
  constructor(user: User, baseScore = 0) {
    super(user, baseScore);
  }

  process(): InsurancePlansEnum {
    return InsurancePlansEnum.REGULAR;
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
        test: InsurancePlansEnum.RESPONSIBLE,
      });
    });

    describe('set ineligible plan based on processed insurance lines', () => {
      describe('when exists processed insurance lines for provided plan', () => {
        it('shouldnt set insurance line as ineligible', () => {
          const riskProfile = new RiskProfile({
            insuranceLines: {
              test1: TestInsuranceLine,
              test2: EconomicInsuranceLine,
              test3: RegularInsuranceLine,
            },
            user: makeFakeUser(),
            riskQuestions: [1, 0, 1],
          });

          riskProfile.setIneligibleBasedOnExistingInsurancePlan(
            'test3',
            InsurancePlansEnum.ECONOMIC,
          );

          expect(riskProfile.getInsuranceLines()).toMatchObject({
            test1: 'responsible',
            test2: 'economic',
            test3: 'regular',
          });
        });
      });

      describe('when doesnt exists processed insurance lines for provided plan', () => {
        it('should set insurance line as ineligible', () => {
          const riskProfile = new RiskProfile({
            insuranceLines: {
              test1: TestInsuranceLine,
              test2: TestInsuranceLine,
              test3: RegularInsuranceLine,
            },
            user: makeFakeUser(),
            riskQuestions: [1, 0, 1],
          });

          riskProfile.setIneligibleBasedOnExistingInsurancePlan(
            'test3',
            InsurancePlansEnum.ECONOMIC,
          );

          expect(riskProfile.getInsuranceLines()).toMatchObject({
            test1: 'responsible',
            test2: 'responsible',
            test3: 'ineligible',
          });
        });
      });
    });
  });
});
