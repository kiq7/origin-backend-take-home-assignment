import { House } from 'src/risk/domain/entities/house.entity';
import { HomeInsuranceLine } from 'src/risk/domain/entities/insurance-lines/home-insurance-line.entity';
import { LifeInsuranceLine } from 'src/risk/domain/entities/insurance-lines/life-insurance-line.entity';
import { User } from 'src/risk/domain/entities/user.entity';
import { HouseOwnershipStatusEnum } from 'src/risk/domain/enums/house-ownership-status.enum';
import { InsurancePlansEnum } from 'src/risk/domain/enums/insurance-plans.enum';
import { makeFakeUser } from 'test/unit/utils/make-fake-user';
import { makeSpyForInsuranceLine } from 'test/unit/utils/make-spy';

describe('risk :: domain :: life insurance line', () => {
  const baseScore = 0;

  const makeLifeInsuranceLine = (user: User) =>
    new LifeInsuranceLine(user, baseScore);

  describe('validate if user ineligible', () => {
    it(`returns ineligible if user is over than 60 years old`, () => {
      const user = makeFakeUser({ age: 61 });
      const plan = makeLifeInsuranceLine(user).process();

      expect(plan).toBe(InsurancePlansEnum.INELIGIBLE);
    });
  });

  describe('verify calls for super class on process method', () => {
    it(`should call methods with correct params`, () => {
      const ageSpy = makeSpyForInsuranceLine('decreaseByAge');
      const incomeSpy = makeSpyForInsuranceLine('decreaseIfIncomeIsAboveThan');
      const dependentsSpy = makeSpyForInsuranceLine('increaseIfHasDependents');
      const getPlanSpy = makeSpyForInsuranceLine('getPlan');

      const user = makeFakeUser({ age: 30 });
      makeLifeInsuranceLine(user).process();

      expect(ageSpy).toHaveBeenCalledTimes(1);
      expect(incomeSpy).toHaveBeenCalledWith(200000);
      expect(dependentsSpy).toHaveBeenCalledTimes(1);
      expect(getPlanSpy).toHaveBeenCalledTimes(1);
    });
  });
});
