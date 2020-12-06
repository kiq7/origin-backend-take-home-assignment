import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { HouseOwnershipStatusEnum } from 'src/risk/domain/enums/house-ownership-status.enum';
import { MaritalStatusEnum } from 'src/risk/domain/enums/marital-status.enum';
import { CalculateRiskProfileUseCase } from 'src/risk/usecases/calculate-risk-profile/calculate-risk-profile.usecase';
import { CalculateRiskInput } from 'src/risk/usecases/calculate-risk-profile/calculate-risk-profile.input';
import { UserProfileRequestModel } from 'src/risk/presentation/http/requests/user-profile.request';

@Controller('risk')
export class UserRiskController {
  constructor(
    private readonly calculateRiskUsecase: CalculateRiskProfileUseCase,
  ) {}

  @Post('profile')
  public async calculateRisk(
    @Res() res: Response,
    @Body() body: UserProfileRequestModel,
  ): Promise<any> {
    const input = await CalculateRiskInput.new({
      age: body.age,
      dependents: body.dependents,
      house: body.house && {
        ownershipStatus: body.house
          .ownership_status as HouseOwnershipStatusEnum,
      },
      income: body.income,
      maritalStatus: body.marital_status as MaritalStatusEnum,
      riskQuestions: body.risk_questions,
      vehicle: body.vehicle,
    });

    const profile = this.calculateRiskUsecase.execute(input);

    return res.status(200).json(profile);
  }
}
