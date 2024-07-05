import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { GetCurrentUserId } from 'src/utils/decorators/get-user-id.decorator';
import { ApiTags } from '@nestjs/swagger';
import { TimeSlotsService } from './timeslots.service';
import TimeSlotsRequestDto from 'src/models/dto/timeslots-request.dto';

@ApiTags('Timeslots')
@Controller('timeslots')
export class TimeSlotsController {
  constructor(private readonly timeslotsService: TimeSlotsService) {}

  @Post('')
  addTimeSlots(
    @Body() timeslotsDto: TimeSlotsRequestDto,
    @GetCurrentUserId() id: number,
  ) {
    return this, this.timeslotsService.addTimeSlots(timeslotsDto, id);
  }

  @Get(':id')
  getUserTimeSlots(@Param('id', ParseIntPipe) userId: number) {
    return this, this.timeslotsService.getTimeSlots(userId);
  }

  @Get('')
  getTimeSlots(@GetCurrentUserId() id: number) {
    return this, this.timeslotsService.getTimeSlots(id);
  }
}
