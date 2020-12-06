import { AutoInsuranceLine } from 'src/risk/domain/entities/insurance-lines/auto-insurance-line.entity';
import { User } from 'src/risk/domain/entities/user.entity';
import { Vehicle } from 'src/risk/domain/entities/vehicle.entity';
import { InsurancePlansEnum } from 'src/risk/domain/enums/insurance-plans.enum';
import { makeFakeUser } from 'test/unit/utils/make-fake-user';
import { makeSpyForInsuranceLine } from 'test/unit/utils/make-spy';

describe('risk :: domain :: insurance line base', () => {
  const baseScore = 0;

  const makeAutoInsuranceLine = (user: User) =>
    new AutoInsuranceLine(user, baseScore);

  describe('validate if user is ineligible', () => {
    it(`returns ineligible if user hasn't vehicle`, () => {
      const user = makeFakeUser({ vehicle: undefined });

      const autoInsuranceLine = makeAutoInsuranceLine(user);
      const plan = autoInsuranceLine.process();

      expect(plan).toBe(InsurancePlansEnum.INELIGIBLE);
    });
  });

  describe('verify calls for super class on process method', () => {
    it(`should call methods with correct params`, () => {
      const ageSpy = makeSpyForInsuranceLine('decreaseByAge');
      const incomeSpy = makeSpyForInsuranceLine('decreaseIfIncomeIsAboveThan');
      const vehicleYearSpy = makeSpyForInsuranceLine('increaseByVehicleYear');
      const getPlanSpy = makeSpyForInsuranceLine('getPlan');

      const user = makeFakeUser({ vehicle: new Vehicle(1900) });
      const autoInsuranceLine = makeAutoInsuranceLine(user);
      autoInsuranceLine.process();

      expect(ageSpy).toHaveBeenCalledTimes(1);
      expect(incomeSpy).toHaveBeenCalledWith(200000);
      expect(vehicleYearSpy).toHaveBeenCalledTimes(1);
      expect(getPlanSpy).toHaveBeenCalledTimes(1);
    });
  });
});
