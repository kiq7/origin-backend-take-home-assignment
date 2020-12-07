import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { request } from 'http';
import { InvalidUsecaseInputFilter } from 'src/risk/presentation/http/exception-filters/invalid-use-case-input.filter';
import { UserProfileRequestModel } from 'src/risk/presentation/http/requests/user-profile.request';
import { RiskModule } from 'src/risk/risk.module';
import { agent } from 'supertest';

describe('integration :: calculate risk profile feature', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [RiskModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalFilters(new InvalidUsecaseInputFilter());

    await app.init();
  });

  const postRiskProfile = async (body: Partial<UserProfileRequestModel>) => {
    return agent(app.getHttpServer()).post('/risk/profile').send(body);
  };

  describe(`/POST risk/profile`, () => {
    describe('validate endpoint contract', () => {
      it('should contain insurance lines keys', async () => {
        const { body, status } = await postRiskProfile({
          age: 35,
          dependents: 2,
          income: 0,
          marital_status: 'married',
          risk_questions: [0, 1, 0],
          vehicle: { year: 2018 },
          house: undefined,
        });

        expect(status).toBe(200);
        expect(body).toMatchObject({
          auto: expect.any(String),
          disability: expect.any(String),
          home: expect.any(String),
          life: expect.any(String),
        });
      });
    });

    describe('when is missing a required param or invalid enum value', () => {
      it('should returns 400 with error description', async () => {
        const { status } = await postRiskProfile({
          dependents: 2,
          income: 0,
          marital_status: 'married',
          risk_questions: [0, 1, 0],
          vehicle: { year: 2018 },
          house: undefined,
        });

        expect(status).toBe(400);
      });
    });

    describe('when house is not provided', () => {
      it('should be ineligible for home insurance', async () => {
        const { body, status } = await postRiskProfile({
          age: 35,
          dependents: 2,
          income: 0,
          marital_status: 'married',
          risk_questions: [0, 1, 0],
          vehicle: { year: 2018 },
          house: undefined,
        });

        expect(status).toBe(200);
        expect(body.home).toBe('ineligible');
      });
    });

    describe('when income is zero', () => {
      it('should be ineligible for disability insurance', async () => {
        const { body, status } = await postRiskProfile({
          age: 35,
          dependents: 2,
          income: 0,
          marital_status: 'married',
          risk_questions: [0, 1, 0],
          vehicle: { year: 2018 },
          house: undefined,
        });

        expect(status).toBe(200);
        expect(body.disability).toBe('ineligible');
      });
    });

    describe('when vehicle is not provided', () => {
      it('should be ineligible for auto insurance', async () => {
        const { body, status } = await postRiskProfile({
          age: 35,
          dependents: 2,
          income: 0,
          marital_status: 'married',
          risk_questions: [0, 1, 0],
          vehicle: undefined,
          house: undefined,
        });

        expect(status).toBe(200);
        expect(body.auto).toBe('ineligible');
      });
    });

    describe('when provided age is over than 60 years old', () => {
      it('should be ineligible for life and disability insurance', async () => {
        const { body, status } = await postRiskProfile({
          age: 61,
          dependents: 2,
          income: 1000,
          marital_status: 'married',
          risk_questions: [0, 1, 0],
          vehicle: { year: 2020 },
          house: {
            ownership_status: 'owned',
          },
        });

        expect(status).toBe(200);
        expect(body.life).toBe('ineligible');
        expect(body.disability).toBe('ineligible');
      });
    });

    describe(`when user data doesn't match any risk rules`, () => {
      let requestBody: UserProfileRequestModel;

      beforeEach(() => {
        requestBody = {
          age: 45,
          dependents: 0,
          income: 100000,
          marital_status: 'single',
          risk_questions: [0, 0, 0],
          vehicle: { year: 2010 },
          house: {
            ownership_status: 'owned',
          },
        };
      });

      describe('calculate score based on risk questions', () => {
        it('all insurance lines should be economic for score less than 1', async () => {
          requestBody.risk_questions = [0, 0, 0];

          const { body, status } = await postRiskProfile(requestBody);

          expect(status).toBe(200);
          expect(body).toMatchObject({
            auto: 'economic',
            disability: 'economic',
            home: 'economic',
            life: 'economic',
          });
        });

        it('all insurance lines should be regular for score between 1 and 2', async () => {
          requestBody.risk_questions = [1, 1, 0];

          const { body, status } = await postRiskProfile(requestBody);

          expect(status).toBe(200);
          expect(body).toMatchObject({
            auto: 'regular',
            disability: 'regular',
            home: 'regular',
            life: 'regular',
          });
        });

        it('all insurance lines should be responsible for score above 3', async () => {
          requestBody.risk_questions = [1, 1, 1];

          const { body, status } = await postRiskProfile(requestBody);

          expect(status).toBe(200);
          expect(body).toMatchObject({
            auto: 'responsible',
            disability: 'responsible',
            home: 'responsible',
            life: 'responsible',
          });
        });
      });
    });

    describe('when user is eligible for all insurance lines', () => {
      let requestBody: UserProfileRequestModel;

      beforeEach(() => {
        requestBody = {
          age: 45,
          dependents: 0,
          income: 100000,
          marital_status: 'single',
          risk_questions: [0, 0, 0],
          vehicle: { year: 2010 },
          house: {
            ownership_status: 'owned',
          },
        };
      });

      describe('considering risk question score equals 3', () => {
        beforeEach(() => {
          requestBody.risk_questions = [1, 1, 1];
        });

        describe('when user is under 30 years old', () => {
          beforeEach(() => {
            requestBody.age = 29;
          });

          it('all insurance lines should be regular', async () => {
            const { body, status } = await postRiskProfile(requestBody);

            expect(status).toBe(200);
            expect(body).toMatchObject({
              auto: 'regular',
              disability: 'regular',
              home: 'regular',
              life: 'regular',
            });
          });
        });

        describe('when user is between 30 and 40 years old', () => {
          beforeEach(() => {
            requestBody.age = 35;
          });

          it('all insurance lines should be regular', async () => {
            const { body, status } = await postRiskProfile(requestBody);

            expect(status).toBe(200);
            expect(body).toMatchObject({
              auto: 'regular',
              disability: 'regular',
              home: 'regular',
              life: 'regular',
            });
          });
        });

        describe('when income is above than $200k', () => {
          beforeEach(() => {
            requestBody.income = 200001;
          });

          it('all insurance lines should be regular', async () => {
            const { body, status } = await postRiskProfile(requestBody);

            expect(status).toBe(200);
            expect(body).toMatchObject({
              auto: 'regular',
              disability: 'regular',
              home: 'regular',
              life: 'regular',
            });
          });
        });

        describe('when house is mortgaged', () => {
          beforeEach(() => {
            requestBody.house = {
              ownership_status: 'mortgaged',
            };
          });

          it('home and disability should be responsible', async () => {
            const { body, status } = await postRiskProfile(requestBody);

            expect(status).toBe(200);
            expect(body.disability).toEqual('responsible');
            expect(body.home).toEqual('responsible');
          });
        });

        describe('when has dependents', () => {
          beforeEach(() => {
            requestBody.dependents = 1;
          });

          it('disability and life should be responsible', async () => {
            const { body, status } = await postRiskProfile(requestBody);

            expect(status).toBe(200);
            expect(body.disability).toEqual('responsible');
            expect(body.life).toEqual('responsible');
          });
        });

        describe('when is married', () => {
          beforeEach(() => {
            requestBody.marital_status = 'married';
          });

          it('disability should be regular and life score should be responsible', async () => {
            const { body, status } = await postRiskProfile(requestBody);

            expect(status).toBe(200);
            expect(body.disability).toEqual('regular');
            expect(body.life).toEqual('responsible');
          });
        });

        describe('when vehicle was produced in the last 5 years', () => {
          beforeEach(() => {
            requestBody.vehicle = {
              year: new Date().getFullYear() - 1,
            };
          });

          it('auto should be repsonsible', async () => {
            const { body, status } = await postRiskProfile(requestBody);

            expect(status).toBe(200);
            expect(body.life).toEqual('responsible');
          });
        });
      });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
