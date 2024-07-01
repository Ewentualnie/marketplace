import { Controller, Get, Post, Body } from '@nestjs/common';
import { GetCurrentUserId } from 'src/utils/decorators/get-user-id.decorator';
import { ApiTags } from '@nestjs/swagger';
import { TimeSlotsService } from './timeslots.service';
import TimeSlotsRequestDto from 'src/models/dto/add-timeslots.dto';

@ApiTags('Timeslots')
@Controller('timeslots')
export class TimeSlotsController {
  constructor(private readonly timeslotsService: TimeSlotsService) {}

  @Post('')
  addTimeSlots(
    @Body() scheduleDto: TimeSlotsRequestDto,
    @GetCurrentUserId() id: number,
  ) {
    return this, this.timeslotsService.addTimeSlots(scheduleDto, id);
  }

  @Get('')
  getTimeSlots(@GetCurrentUserId() id: number) {
    return this, this.timeslotsService.getTimeSlots(id);
  }
}
