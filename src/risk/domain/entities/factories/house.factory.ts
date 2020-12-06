import { Injectable } from '@nestjs/common';
import { House } from 'src/risk/domain/entities/house.entity';
import { HouseOwnershipStatusEnum } from 'src/risk/domain/enums/house-ownership-status.enum';

@Injectable()
export class HouseFactory {
  public create(status: HouseOwnershipStatusEnum): House {
    return new House(status);
  }
}
