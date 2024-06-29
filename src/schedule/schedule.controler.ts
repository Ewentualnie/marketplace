import { Controller, Get, Post, Body } from '@nestjs/common';
import { GetCurrentUserId } from 'src/utils/decorators/get-user-id.decorator';
import { ApiTags } from '@nestjs/swagger';
import { ScheduleService } from './schedule.service';
import CreateScheduleDto from 'src/models/dto/create-schedule.dto';

@ApiTags('Schedule')
@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Post('')
  addSchedule(
    @Body() scheduleDto: CreateScheduleDto,
    @GetCurrentUserId() id: number,
  ) {
    return this, this.scheduleService.addSchedule(scheduleDto, id);
  }

  @Get('')
  getSchedule(@GetCurrentUserId() id: number) {
    return this, this.scheduleService.getSchedule(id);
  }
}
