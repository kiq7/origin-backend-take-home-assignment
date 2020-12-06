export class UserProfileRequestModel {
  public age: number;
  public dependents: number;
  public house: {
    ownership_status: string;
  };
  public income: number;
  public marital_status: string;
  public risk_questions: number[];
  public vehicle: {
    year: number;
  };
}
