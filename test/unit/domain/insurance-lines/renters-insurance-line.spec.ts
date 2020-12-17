import { House } from 'src/risk/domain/entities/house.entity';
import { RentersInsuranceLine } from 'src/risk/domain/entities/insurance-lines/renters-insurance-line.entity';
import { User } from 'src/risk/domain/entities/user.entity';
import { HouseOwnershipStatusEnum } from 'src/risk/domain/enums/house-ownership-status.enum';
import { InsurancePlansEnum } from 'src/risk/domain/enums/insurance-plans.enum';
import { makeFakeUser } from 'test/unit/utils/make-fake-user';
import { makeSpyForInsuranceLine } from 'test/unit/utils/make-spy';

describe('risk :: domain :: renters insurance line', () => {
  const baseScore = 0;
  const makeInsuranceLine = (user: User) =>
    new RentersInsuranceLine(user, baseScore);

  describe('validate if user is eligible', () => {
    describe('if user has a house', () => {
      describe('if house is rented', () => {
        it('returns eligible', () => {
          const user = makeFakeUser({
            house: new House(HouseOwnershipStatusEnum.RENTED),
          });
          const insuranceLine = makeInsuranceLine(user);

          expect(insuranceLine.process()).not.toBe(
            InsurancePlansEnum.INELIGIBLE,
          );
        });
      });
      describe('if house is not rented', () => {
        it('returns ineligible', () => {
          const user = makeFakeUser({
            house: new House(HouseOwnershipStatusEnum.OWNED),
          });
          const insuranceLine = makeInsuranceLine(user);

          expect(insuranceLine.process()).toBe(InsurancePlansEnum.INELIGIBLE);
        });
      });
    });

    describe('if user has not a house', () => {
      it('returns ineligible', () => {
        const user = makeFakeUser({ house: undefined });
        const insuranceLine = makeInsuranceLine(user);

        expect(insuranceLine.process()).toBe(InsurancePlansEnum.INELIGIBLE);
      });
    });
  });

  describe('verify calls for super class on process method', () => {
    it(`should call methods with correct params`, () => {
      const ageSpy = makeSpyForInsuranceLine('decreaseByAge');
      const incomeSpy = makeSpyForInsuranceLine('decreaseIfIncomeIsAboveThan');
      const getPlanSpy = makeSpyForInsuranceLine('getPlan');

      const user = makeFakeUser({
        house: new House(HouseOwnershipStatusEnum.RENTED),
      });

      makeInsuranceLine(user).process();

      expect(ageSpy).toHaveBeenCalledTimes(1);
      expect(incomeSpy).toHaveBeenCalledWith(200000);
      expect(getPlanSpy).toHaveBeenCalledTimes(1);
    });
  });
});
