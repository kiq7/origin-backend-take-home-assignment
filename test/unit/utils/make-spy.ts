import { InsuranceLine } from 'src/risk/domain/entities/insurance-lines/base-insurance-line.entity';

export const makeSpyForInsuranceLine = (
  method: string,
): jest.SpyInstance<any, unknown[]> => {
  // @ts-expect-error
  return jest.spyOn(InsuranceLine.prototype, method);
};
