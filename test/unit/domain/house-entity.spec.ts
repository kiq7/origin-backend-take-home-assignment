import { House } from 'src/risk/domain/entities/house.entity';
import { HouseOwnershipStatusEnum } from 'src/risk/domain/enums/house-ownership-status.enum';

describe('risk :: domain :: house', () => {
  describe('validate if is mortgaged', () => {
    it('returns true if is mortgaged', () => {
      const house = new House(HouseOwnershipStatusEnum.MORTGAGED);
      expect(house.isMortgaged()).toBe(true);
    });

    it(`returns true if isn't mortgaged`, () => {
      const house = new House(HouseOwnershipStatusEnum.OWNED);
      expect(house.isMortgaged()).toBe(false);
    });
  });
});
