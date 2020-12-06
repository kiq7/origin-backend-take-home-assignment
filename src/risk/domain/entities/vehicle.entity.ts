export class Vehicle {
  private year: number;

  constructor(year: number) {
    this.year = year;
  }

  public wasProducedInTheLastFiveYears(): boolean {
    const currentYear = new Date().getFullYear() - 5;
    return this.year >= currentYear;
  }
}
