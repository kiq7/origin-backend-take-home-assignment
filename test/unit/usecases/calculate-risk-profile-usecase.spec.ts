import { HouseFactory } from 'src/risk/domain/entities/factories/house.factory';
import { RiskProfileFactory } from 'src/risk/domain/entities/factories/risk-profile.factory';
import { UserFactory } from 'src/risk/domain/entities/factories/user.factory';
import { VehicleFactory } from 'src/risk/domain/entities/factories/vehicle.factory';
import { AutoInsuranceLine } from 'src/risk/domain/entities/insurance-lines/auto-insurance-line.entity';
import { DisabilityInsuranceLine } from 'src/risk/domain/entities/insurance-lines/disability-insurance-line.entity';
import { HomeInsuranceLine } from 'src/risk/domain/entities/insurance-lines/home-insurance-line.entity';
import { LifeInsuranceLine } from 'src/risk/domain/entities/insurance-lines/life-insurance-line.entity';
import { RentersInsuranceLine } from 'src/risk/domain/entities/insurance-lines/renters-insurance-line.entity';
import { HouseOwnershipStatusEnum } from 'src/risk/domain/enums/house-ownership-status.enum';
import { MaritalStatusEnum } from 'src/risk/domain/enums/marital-status.enum';
import { CalculateRiskInput } from 'src/risk/usecases/calculate-risk-profile/calculate-risk-profile.input';
import { CalculateRiskProfileUseCase } from 'src/risk/usecases/calculate-risk-profile/calculate-risk-profile.usecase';

describe('risk :: usecases :: calculate risk profile usecase', () => {
  const userFactory: UserFactory = {
    create: jest.fn().mockReturnValue({
      setHouse: jest.fn(),
      setVehicle: jest.fn(),
    }),
  };
  const houseFactory: HouseFactory = { create: jest.fn() };
  const vehicleFactory: VehicleFactory = { create: jest.fn() };
  const riskProfileFactory: RiskProfileFactory = {
    create: jest.fn().mockReturnValue({
      getInsuranceLines: jest.fn(),
    }),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const executeUseCase = (props: Partial<CalculateRiskInput>) =>
    new CalculateRiskProfileUseCase(
      userFactory,
      houseFactory,
      vehicleFactory,
      riskProfileFactory,
    ).execute(props as CalculateRiskInput);

  describe('when usecase is called', () => {
    it('should create an user instance with correct params', () => {
      executeUseCase({
        age: 30,
        dependents: 2,
        income: 200,
        maritalStatus: MaritalStatusEnum.MARRIED,
      });

      expect(userFactory.create).toBeCalledWith({
        age: 30,
        dependents: 2,
        income: 200,
        maritalStatus: MaritalStatusEnum.MARRIED,
      });
    });

    it('should create a house if house is provided', () => {
      executeUseCase({
        age: 30,
        dependents: 2,
        income: 200,
        maritalStatus: MaritalStatusEnum.MARRIED,
        house: {
          ownershipStatus: HouseOwnershipStatusEnum.MORTGAGED,
        },
      });

      expect(houseFactory.create).toBeCalledWith(
        HouseOwnershipStatusEnum.MORTGAGED,
      );
    });

    it(`shouldn't create a house if house isn't provided`, () => {
      executeUseCase({
        age: 30,
        dependents: 2,
        income: 200,
        maritalStatus: MaritalStatusEnum.MARRIED,
        house: undefined,
      });

      expect(houseFactory.create).toBeCalledTimes(0);
    });

    it('should create a vehicle if its provided', () => {
      executeUseCase({
        age: 30,
        dependents: 2,
        income: 200,
        maritalStatus: MaritalStatusEnum.MARRIED,
        vehicle: {
          year: 2000,
        },
      });

      expect(vehicleFactory.create).toBeCalledWith(2000);
    });

    it(`shouldn't create vehicle if isn't provided`, () => {
      executeUseCase({
        age: 30,
        dependents: 2,
        income: 200,
        maritalStatus: MaritalStatusEnum.MARRIED,
        vehicle: undefined,
      });

      expect(vehicleFactory.create).toBeCalledTimes(0);
    });

    it(`should create profile risk with insurance lines`, () => {
      executeUseCase({
        age: 30,
        dependents: 2,
        income: 200,
        maritalStatus: MaritalStatusEnum.MARRIED,
        riskQuestions: [1, 0, 1],
      });

      const insuranceLines = {
        auto: AutoInsuranceLine,
        disability: DisabilityInsuranceLine,
        home: HomeInsuranceLine,
        life: LifeInsuranceLine,
        renters: RentersInsuranceLine,
      };

      expect(riskProfileFactory.create).toHaveBeenCalledWith({
        user: {
          setHouse: undefined,
          setVehicle: undefined,
        },
        riskQuestions: [1, 0, 1],
        insuranceLines,
      });
    });
  });
});
