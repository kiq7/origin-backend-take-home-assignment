import { Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller('risk')
export class UserRiskController {
  @Post('profile')
  public async calculateRisk(@Res() res: Response): Promise<any> {
    return res.status(200).json({ status: 'all good :)' });
  }
}
