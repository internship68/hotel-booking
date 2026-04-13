import { IsDateString, IsIn, IsOptional } from "class-validator";

export class FindAvailableSuitesDto {
  @IsDateString()
  checkInDate!: string;

  @IsDateString()
  checkOutDate!: string;

  @IsOptional()
  @IsIn(["SUITE", "PENTHOUSE", "VILLA"])
  category?: string;
}
