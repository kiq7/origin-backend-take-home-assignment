import { CreateUserProps, User } from 'src/risk/domain/entities/user.entity';
import { MaritalStatusEnum } from 'src/risk/domain/enums/marital-status.enum';

export const makeFakeUser = (props?: Partial<CreateUserProps>): User => {
  return new User({
    age: props?.age || 0,
    dependents: props?.dependents || 0,
    income: props?.income || 0,
    maritalStatus: props?.maritalStatus || MaritalStatusEnum.SINGLE,
    house: props?.house,
    vehicle: props?.vehicle,
  });
};
