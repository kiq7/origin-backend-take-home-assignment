import { Vehicle } from 'src/risk/domain/entities/vehicle.entity';

describe('risk :: domain :: vehicle', () => {
  describe(`validate vehicle's year`, () => {
    it('returns true if vehicle was produced on the last five years', () => {
      const vehicle = new Vehicle(new Date().getFullYear() - 3);
      expect(vehicle.wasProducedInTheLastFiveYears()).toBe(true);
    });

    it(`returns false if vehicle wasn't produced on the last five years`, () => {
      const vehicle = new Vehicle(new Date().getFullYear() - 6);
      expect(vehicle.wasProducedInTheLastFiveYears()).toBe(false);
    });
  });
});
