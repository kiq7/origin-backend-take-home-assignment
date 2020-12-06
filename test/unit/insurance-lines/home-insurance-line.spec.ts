import { House } from 'src/risk/domain/entities/house.entity';
import { HomeInsuranceLine } from 'src/risk/domain/entities/insurance-lines/home-insurance-line.entity';
import { User } from 'src/risk/domain/entities/user.entity';
import { HouseOwnershipStatusEnum } from 'src/risk/domain/enums/house-ownership-status.enum';
import { InsurancePlansEnum } from 'src/risk/domain/enums/insurance-plans.enum';
import { makeFakeUser } from 'test/unit/utils/make-fake-user';
import { makeSpyForInsuranceLine } from 'test/unit/utils/make-spy';

describe('risk :: domain :: home insurance line', () => {
  const baseScore = 0;

  const makeHomeInsuranceLine = (user: User) =>
    new HomeInsuranceLine(user, baseScore);

  describe('validate if user is ineligible', () => {
    it(`returns ineligible if user hasn't house`, () => {
      const user = makeFakeUser({ house: undefined });
      const plan = makeHomeInsuranceLine(user).process();

      expect(plan).toBe(InsurancePlansEnum.INELIGIBLE);
    });
  });

  describe('verify calls for super class on process method', () => {
    it(`should call methods with correct params`, () => {
      const ageSpy = makeSpyForInsuranceLine('decreaseByAge');
      const incomeSpy = makeSpyForInsuranceLine('decreaseIfIncomeIsAboveThan');
      const mortgagedHouseSpy = makeSpyForInsuranceLine(
        'increaseIfHouseIsMortgaged',
      );
      const getPlanSpy = makeSpyForInsuranceLine('getPlan');

      const user = makeFakeUser({
        house: new House(HouseOwnershipStatusEnum.MORTGAGED),
      });
      makeHomeInsuranceLine(user).process();

      expect(ageSpy).toHaveBeenCalledTimes(1);
      expect(incomeSpy).toHaveBeenCalledWith(200000);
      expect(mortgagedHouseSpy).toHaveBeenCalledTimes(1);
      expect(getPlanSpy).toHaveBeenCalledTimes(1);
    });
  });
});
