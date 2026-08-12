import { DocumentBuilder } from '@nestjs/swagger';

export function buildOpenApiConfig() {
  return new DocumentBuilder()
    .setTitle('TripOS API')
    .setDescription(
      'Travel CRM, quotation, booking, operations, B2B, and finance MVP API.',
    )
    .setVersion('0.1.0')
    .build();
}
