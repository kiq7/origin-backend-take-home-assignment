import { Injectable } from '@nestjs/common';
import {
  RiskProfile,
  RiskProfileProps,
} from 'src/risk/domain/entities/risk-profile.entity';

@Injectable()
export class RiskProfileFactory {
  public create(props: RiskProfileProps): RiskProfile {
    return new RiskProfile(props);
  }
}
