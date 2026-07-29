import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AiAssistantService } from './ai-assistant.service';
import { AiAssistantDto } from './dto/ai-assistant.dto';

@ApiTags('ai')
@Controller('ai')
export class AiAssistantController {
  constructor(private readonly service: AiAssistantService) {}

  @Post('itinerary-drafts')
  itineraryDraft(@Body() dto: AiAssistantDto) {
    return this.service.itineraryDraft(dto);
  }

  @Post('quotation-assist')
  quotationAssist(@Body() dto: AiAssistantDto) {
    return this.service.quotationAssist(dto);
  }

  @Post('sales-reply')
  salesReply(@Body() dto: AiAssistantDto) {
    return this.service.salesReply(dto);
  }
}
