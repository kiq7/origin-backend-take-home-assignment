import { DisabilityInsuranceLine } from 'src/risk/domain/entities/insurance-lines/disability-insurance-line.entity';
import { User } from 'src/risk/domain/entities/user.entity';
import { InsurancePlansEnum } from 'src/risk/domain/enums/insurance-plans.enum';
import { makeFakeUser } from 'test/unit/utils/make-fake-user';
import { makeSpyForInsuranceLine } from 'test/unit/utils/make-spy';

describe('risk :: domain :: disability insurance line', () => {
  const baseScore = 0;

  const makeDisabilityInsuranceLine = (user: User) =>
    new DisabilityInsuranceLine(user, baseScore);

  describe('validate if user is ineligible', () => {
    it(`returns ineligible if user hasn't income`, () => {
      const user = makeFakeUser({ income: 0 });
      const plan = makeDisabilityInsuranceLine(user).process();

      expect(plan).toBe(InsurancePlansEnum.INELIGIBLE);
    });

    it(`returns ineligible if user is over 60 years old`, () => {
      const user = makeFakeUser({ income: 1, age: 61 });
      const plan = makeDisabilityInsuranceLine(user).process();

      expect(plan).toBe(InsurancePlansEnum.INELIGIBLE);
    });
  });

  describe('verify calls for super class on process method', () => {
    it(`should call methods with correct params`, () => {
      const ageSpy = makeSpyForInsuranceLine('decreaseByAge');
      const isMarriedSpy = makeSpyForInsuranceLine('decreaseIfIsMarried');
      const incomeSpy = makeSpyForInsuranceLine('decreaseIfIncomeIsAboveThan');
      const mortgagedHouseSpy = makeSpyForInsuranceLine(
        'increaseIfHouseIsMortgaged',
      );
      const getPlanSpy = makeSpyForInsuranceLine('getPlan');

      const user = makeFakeUser({
        income: 1,
        age: 30,
      });
      makeDisabilityInsuranceLine(user).process();

      expect(ageSpy).toHaveBeenCalledTimes(1);
      expect(isMarriedSpy).toHaveBeenCalledTimes(1);
      expect(incomeSpy).toHaveBeenCalledWith(200000);
      expect(mortgagedHouseSpy).toHaveBeenCalledTimes(1);
      expect(getPlanSpy).toHaveBeenCalledTimes(1);
    });
  });
});
