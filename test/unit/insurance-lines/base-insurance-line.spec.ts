import { House } from 'src/risk/domain/entities/house.entity';
import { Vehicle } from 'src/risk/domain/entities/vehicle.entity';
import { HouseOwnershipStatusEnum } from 'src/risk/domain/enums/house-ownership-status.enum';
import { InsurancePlansEnum } from 'src/risk/domain/enums/insurance-plans.enum';
import { MaritalStatusEnum } from 'src/risk/domain/enums/marital-status.enum';
import { makeFakeUser } from 'test/unit/utils/make-fake-user';
import { TestInsuranceLine } from 'test/unit/utils/test-insurance-line';

describe('risk :: domain :: insurance line base', () => {
  const baseScore = 0;

  describe('decreaseByAge method', () => {
    it('deduct 2 score points if user is younger than 30', () => {
      const user = makeFakeUser({ age: 29 });
      const testInsuranceLine = new TestInsuranceLine(user, baseScore);
      testInsuranceLine.decreaseByAge();

      expect(testInsuranceLine.score).toBe(-2);
    });

    it(`deduct 1 score point if user's age is between 30 and 40`, () => {
      const user = makeFakeUser({ age: 35 });
      const testInsuranceLine = new TestInsuranceLine(user, baseScore);
      testInsuranceLine.decreaseByAge();

      expect(testInsuranceLine.score).toBe(-1);
    });
  });

  describe('decreaseIfIncomeIsAboveThan method', () => {
    it(`deduct 1 score point if user's income is above than provided value`, () => {
      const user = makeFakeUser({ income: 200000 });
      const testInsuranceLine = new TestInsuranceLine(user, baseScore);
      testInsuranceLine.decreaseIfIncomeIsAboveThan(2000);

      expect(testInsuranceLine.score).toBe(-1);
    });
  });

  describe('increaseIfHouseIsMortgaged method', () => {
    it(`add 1 score point if user's house is mortgaged`, () => {
      const user = makeFakeUser({
        house: new House(HouseOwnershipStatusEnum.MORTGAGED),
      });
      const testInsuranceLine = new TestInsuranceLine(user, baseScore);
      testInsuranceLine.increaseIfHouseIsMortgaged();

      expect(testInsuranceLine.score).toBe(1);
    });
  });

  describe('increaseIfHasDependents method', () => {
    it(`add 1 score point if user has dependents`, () => {
      const user = makeFakeUser({ dependents: 1 });
      const testInsuranceLine = new TestInsuranceLine(user, baseScore);
      testInsuranceLine.increaseIfHasDependents();

      expect(testInsuranceLine.score).toBe(1);
    });
  });

  describe('increaseIfIsMarried method', () => {
    it(`add 1 score point if user is married`, () => {
      const user = makeFakeUser({ maritalStatus: MaritalStatusEnum.MARRIED });
      const testInsuranceLine = new TestInsuranceLine(user, baseScore);
      testInsuranceLine.increaseIfIsMarried();

      expect(testInsuranceLine.score).toBe(1);
    });
  });

  describe('decreaseIfIsMarried method', () => {
    it(`deduct 1 score point if user is married`, () => {
      const user = makeFakeUser({ maritalStatus: MaritalStatusEnum.MARRIED });
      const testInsuranceLine = new TestInsuranceLine(user, baseScore);
      testInsuranceLine.decreaseIfIsMarried();

      expect(testInsuranceLine.score).toBe(-1);
    });
  });

  describe('increaseByVehicleYear method', () => {
    it(`add 1 score point user's car was produced in the last five years`, () => {
      const user = makeFakeUser({
        vehicle: new Vehicle(new Date().getFullYear() - 2),
      });
      const testInsuranceLine = new TestInsuranceLine(user, baseScore);
      testInsuranceLine.increaseByVehicleYear();

      expect(testInsuranceLine.score).toBe(1);
    });
  });

  describe('insurance plan', () => {
    it(`returns economic if score is 0 and below`, () => {
      const user = makeFakeUser();
      const testInsuranceLine = new TestInsuranceLine(user, 0);
      expect(testInsuranceLine.getPlan()).toBe(InsurancePlansEnum.ECONOMIC);
    });

    it(`returns regular if score is 1 or 2`, () => {
      const user = makeFakeUser();
      const testInsuranceLine = new TestInsuranceLine(user, 2);
      expect(testInsuranceLine.getPlan()).toBe(InsurancePlansEnum.REGULAR);
    });

    it(`returns responsible if score is 3 and above`, () => {
      const user = makeFakeUser();
      const testInsuranceLine = new TestInsuranceLine(user, 3);
      expect(testInsuranceLine.getPlan()).toBe(InsurancePlansEnum.RESPONSIBLE);
    });
  });
});
