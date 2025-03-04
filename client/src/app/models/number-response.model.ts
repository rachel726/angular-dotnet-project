export interface NumberResponse {
  IsDivisibleByFive: boolean;
  IsRateLimited: boolean;
  NextAvailableTime?: Date;
  Message: string;
}