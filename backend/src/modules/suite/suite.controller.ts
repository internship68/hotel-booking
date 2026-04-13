import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { SUITE_RESOURCE_SEGMENT } from "./constants/suite-route";
import { CreateSuiteDto } from "./dto/create-suite.dto";
import { FindAvailableSuitesDto } from "./dto/find-available-suites.dto";
import { UpdateSuiteStatusDto } from "./dto/update-suite-status.dto";
import { SuiteService } from "./suite.service";

@Controller(SUITE_RESOURCE_SEGMENT)
export class SuiteController {
  constructor(private readonly suiteService: SuiteService) {}

  @Get()
  findAll() {
    return this.suiteService.findAll();
  }

  @Get("availability")
  findAvailable(@Query() dto: FindAvailableSuitesDto) {
    return this.suiteService.findAvailable(dto);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.suiteService.findOne(id);
  }

  @Post()
  create(@Body() dto: CreateSuiteDto) {
    return this.suiteService.create(dto);
  }

  @Patch(":id")
  updateStatus(@Param("id") id: string, @Body() dto: UpdateSuiteStatusDto) {
    return this.suiteService.updateStatus(id, dto.status);
  }
}
