import { Injectable } from '@nestjs/common';
import { CreateUserProps, User } from 'src/risk/domain/entities/user.entity';

@Injectable()
export class UserFactory {
  public create(props: CreateUserProps): User {
    return new User(props);
  }
}
