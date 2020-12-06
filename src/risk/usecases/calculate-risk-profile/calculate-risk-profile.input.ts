import { plainToClass, Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsDefined,
  IsEnum,
  IsIn,
  IsInstance,
  IsInt,
  IsOptional,
  Min,
  ValidateNested,
} from 'class-validator';
import { UseCaseValidatable } from 'src/core/common/adapter/usecase-validatable.adapter';
import { HouseOwnershipStatusEnum } from 'src/risk/domain/enums/house-ownership-status.enum';
import { MaritalStatusEnum } from 'src/risk/domain/enums/marital-status.enum';

class House {
  @IsDefined()
  @IsEnum(HouseOwnershipStatusEnum)
  ownershipStatus: HouseOwnershipStatusEnum;
}

class Vehicle {
  @IsDefined()
  @IsInt()
  year: number;
}

export class CalculateRiskInput extends UseCaseValidatable {
  @IsDefined()
  @IsInt()
  @Min(0)
  age: number;

  @IsDefined()
  @IsInt()
  @Min(0)
  dependents: number;

  @IsDefined()
  @IsInt()
  @Min(0)
  income: number;

  @IsDefined()
  @IsEnum(MaritalStatusEnum, {
    message: `maritalStatus must be a valid enum value`,
  })
  maritalStatus: MaritalStatusEnum;

  @IsDefined()
  @IsIn([0, 1], { each: true })
  @Type(() => Number)
  @ArrayMinSize(3)
  @ArrayMaxSize(3)
  riskQuestions: number[];

  @IsOptional()
  @ValidateNested()
  @IsInstance(House)
  @Type(() => House)
  house?: House;

  @IsOptional()
  @ValidateNested()
  @IsInstance(Vehicle)
  @Type(() => Vehicle)
  vehicle?: Vehicle;

  public static async new(
    payload: Omit<CalculateRiskInput, 'validate'>,
  ): Promise<CalculateRiskInput> {
    const adapter = plainToClass(CalculateRiskInput, payload);
    await adapter.validate();

    return adapter;
  }
}
