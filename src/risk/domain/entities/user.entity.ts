import { House } from 'src/risk/domain/entities/house.entity';
import { Vehicle } from 'src/risk/domain/entities/vehicle.entity';
import { MaritalStatusEnum } from 'src/risk/domain/enums/marital-status.enum';

export type CreateUserProps = {
  age: number;
  dependents: number;
  income: number;
  maritalStatus: MaritalStatusEnum;
  house?: House;
  vehicle?: Vehicle;
};

export class User {
  private age: number;
  private dependents: number;
  private income: number;
  private maritalStatus: MaritalStatusEnum;
  private _house?: House;
  private _vehicle?: Vehicle;

  constructor({
    age,
    dependents,
    income,
    maritalStatus,
    house,
    vehicle,
  }: CreateUserProps) {
    this.age = age;
    this.dependents = dependents;
    this.income = income;
    this.maritalStatus = maritalStatus;
    this._house = house;
    this._vehicle = vehicle;
  }

  public hasDependents = (): boolean => this.dependents > 0;
  public hasVehicle = (): boolean => this._vehicle != undefined;
  public hasHouse = (): boolean => this._house != undefined;
  public hasIncome = (): boolean => this.income > 0;

  public isOlderThan = (age: number): boolean => this.age > age;
  public isYoungerThan = (age: number): boolean => this.age < age;

  public isIncomeAboveThan = (amount: number) => this.income >= amount;
  public isMarried = () => this.maritalStatus === MaritalStatusEnum.MARRIED;

  public get house() {
    return this._house;
  }

  public set setHouse(house: House) {
    this._house = house;
  }

  public get vehicle() {
    return this._vehicle;
  }

  public set setVehicle(vehicle: Vehicle) {
    this._vehicle = vehicle;
  }
}
