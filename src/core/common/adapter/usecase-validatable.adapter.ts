import { ClassValidator } from 'src/core/util/class-validator.util';
import { InvalidUsecaseInputError } from 'src/risk/usecases/errors/invalid-usecase-input.error';

export class UseCaseValidatable {
  public async validate(): Promise<void> {
    const details = await ClassValidator.validate(this);

    if (details) {
      throw new InvalidUsecaseInputError('invalid usecase input', {
        data: details,
      });
    }
  }
}
