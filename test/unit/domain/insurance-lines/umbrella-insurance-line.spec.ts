import { UmbrellaInsuranceLine } from 'src/risk/domain/entities/insurance-lines/umbrella-insurance-line.entity';
import { makeFakeUser } from 'test/unit/utils/make-fake-user';
import { makeSpyForInsuranceLine } from 'test/unit/utils/make-spy';

describe('domain :: unit :: umbrella insurance line', () => {
  describe('verify calls for super class on process method', () => {
    it(`should call methods with correct params`, () => {
      const ageSpy = makeSpyForInsuranceLine('decreaseByAge');
      const incomeSpy = makeSpyForInsuranceLine('decreaseIfIncomeIsAboveThan');
      const getPlanSpy = makeSpyForInsuranceLine('getPlan');

      new UmbrellaInsuranceLine(makeFakeUser(), 0).process();

      expect(ageSpy).toHaveBeenCalledTimes(1);
      expect(incomeSpy).toHaveBeenCalledWith(200000);
      expect(getPlanSpy).toHaveBeenCalledTimes(1);
    });
  });
});
