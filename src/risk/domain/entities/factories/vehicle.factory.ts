import { Injectable } from '@nestjs/common';
import { Vehicle } from 'src/risk/domain/entities/vehicle.entity';

@Injectable()
export class VehicleFactory {
  public create(year: number): Vehicle {
    return new Vehicle(year);
  }
}
