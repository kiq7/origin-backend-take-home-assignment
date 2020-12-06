import { House } from 'src/risk/domain/entities/house.entity';
import { Vehicle } from 'src/risk/domain/entities/vehicle.entity';
import { HouseOwnershipStatusEnum } from 'src/risk/domain/enums/house-ownership-status.enum';
import { MaritalStatusEnum } from 'src/risk/domain/enums/marital-status.enum';
import { makeFakeUser } from 'test/unit/utils/make-fake-user';

describe('risk :: domain :: user', () => {
  describe('validate if has dependents', () => {
    it('returns true if has dependents', () => {
      const user = makeFakeUser({ dependents: 1 });
      expect(user.hasDependents()).toBe(true);
    });

    it('returns false if has not dependents', () => {
      const user = makeFakeUser({ dependents: 0 });
      expect(user.hasDependents()).toBe(false);
    });
  });

  describe('validate if has vehicle', () => {
    it('returns true if has vehicle', () => {
      const user = makeFakeUser({ vehicle: new Vehicle(1900) });
      expect(user.hasVehicle()).toBe(true);
    });

    it('returns false if has not vehicle', () => {
      const user = makeFakeUser({ vehicle: undefined });
      expect(user.hasVehicle()).toBe(false);
    });
  });

  describe('validate if has house', () => {
    it('returns true if has house', () => {
      const user = makeFakeUser({
        house: new House(HouseOwnershipStatusEnum.MORTGAGED),
      });
      expect(user.hasHouse()).toBe(true);
    });

    it('returns false if has not house', () => {
      const user = makeFakeUser({
        house: undefined,
      });

      expect(user.hasHouse()).toBe(false);
    });
  });

  describe('validate if has income', () => {
    it('returns true if has income', () => {
      const user = makeFakeUser({
        income: 1,
      });
      expect(user.hasIncome()).toBe(true);
    });

    it('returns false if has not income', () => {
      const user = makeFakeUser({
        income: 0,
      });

      expect(user.hasIncome()).toBe(false);
    });
  });

  describe('validate if the user is older than provived age', () => {
    it(`returns false if the user isn't older than provided age`, () => {
      const user = makeFakeUser({
        age: 18,
      });

      expect(user.isOlderThan(19)).toBe(false);
    });

    it(`returns true if the user is older than provided age`, () => {
      const user = makeFakeUser({
        age: 18,
      });

      expect(user.isOlderThan(17)).toBe(true);
    });
  });

  describe('validate if the user is younger than provived age', () => {
    it(`returns true if the user is younger than provided age`, () => {
      const user = makeFakeUser({
        age: 18,
      });

      expect(user.isYoungerThan(19)).toBe(true);
    });

    it(`returns true if the user isn't younger than provided age`, () => {
      const user = makeFakeUser({
        age: 18,
      });

      expect(user.isYoungerThan(17)).toBe(false);
    });
  });

  describe(`validate if the user's income is above than provided value`, () => {
    it(`returns true if the provided value is greater than user's income`, () => {
      const user = makeFakeUser({
        income: 100,
      });

      expect(user.isIncomeAboveThan(50)).toBe(true);
    });

    it(`returns false if the provided value is greater than user's income`, () => {
      const user = makeFakeUser({
        income: 100,
      });

      expect(user.isIncomeAboveThan(200)).toBe(false);
    });
  });

  describe(`validate if the user is married`, () => {
    it(`returns true if is married`, () => {
      const user = makeFakeUser({
        maritalStatus: MaritalStatusEnum.MARRIED,
      });

      expect(user.isMarried()).toBe(true);
    });

    it(`returns false if isn't married`, () => {
      const user = makeFakeUser({
        maritalStatus: MaritalStatusEnum.SINGLE,
      });

      expect(user.isMarried()).toBe(false);
    });
  });
});
