import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AiAssistantDto } from './dto/ai-assistant.dto';

@Injectable()
export class AiAssistantService {
  constructor(private readonly configService: ConfigService) {}

  itineraryDraft(dto: AiAssistantDto) {
    return this.localResponse('itinerary_draft', dto, [
      'Confirm traveller profile, dates, budget, and pace.',
      `Create a day-wise plan for ${dto.destination ?? 'the selected destination'}.`,
      'Add hotels, transfers, key activities, meals, exclusions, and ops notes.',
    ]);
  }

  quotationAssist(dto: AiAssistantDto) {
    return this.localResponse('quotation_assist', dto, [
      'Check base supplier cost, markup, discount, tax, and commission.',
      'Generate good-better-best pricing options.',
      'Flag payment schedule and cancellation terms before sending.',
    ]);
  }

  salesReply(dto: AiAssistantDto) {
    return this.localResponse('sales_reply', dto, [
      'Acknowledge the enquiry warmly.',
      'Confirm destination, dates, travellers, hotel category, and budget.',
      'Offer the next step: TripOS quotation and itinerary preparation.',
    ]);
  }

  private localResponse(
    type: string,
    dto: AiAssistantDto,
    suggestions: string[],
  ) {
    return {
      mode:
        this.configService.get<boolean>('integrations.ai.enabled') === true
          ? 'provider_configured'
          : 'local_assist',
      type,
      prompt: dto.prompt,
      destination: dto.destination,
      travelDates: dto.travelDates,
      suggestions,
      generatedAt: new Date().toISOString(),
    };
  }
}
