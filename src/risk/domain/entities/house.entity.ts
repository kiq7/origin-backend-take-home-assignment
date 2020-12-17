import { HouseOwnershipStatusEnum } from 'src/risk/domain/enums/house-ownership-status.enum';

export class House {
  private status: HouseOwnershipStatusEnum;

  constructor(status: HouseOwnershipStatusEnum) {
    this.status = status;
  }

  public isMortgaged = () => this.status === HouseOwnershipStatusEnum.MORTGAGED;
  public isRented = () => this.status === HouseOwnershipStatusEnum.RENTED;
}
