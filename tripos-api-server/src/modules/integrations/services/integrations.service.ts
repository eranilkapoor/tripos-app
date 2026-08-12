import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

type ProviderStatus = {
  provider: string;
  enabled: boolean;
  mode: 'local' | 'sandbox' | 'configured' | 'missing_credentials';
};

@Injectable()
export class IntegrationsService {
  constructor(private readonly configService: ConfigService) {}

  health() {
    return {
      email: this.provider(
        'integrations.email.provider',
        'integrations.email.enabled',
        ['NOTIFICATION_EMAIL_SMTP_HOST', 'NOTIFICATION_EMAIL_SMTP_USERNAME'],
      ),
      sms: this.provider(
        'integrations.sms.provider',
        'integrations.sms.enabled',
        ['NOTIFICATION_SMS_MSG91_AUTH_KEY'],
      ),
      whatsapp: this.provider(
        'integrations.whatsapp.provider',
        'integrations.whatsapp.enabled',
        ['WHATSAPP_ACCESS_TOKEN', 'WHATSAPP_PHONE_NUMBER_ID'],
      ),
      payments: this.provider('integrations.payments.provider', undefined, [
        'PAYMENT_SIGNATURE_SECRET',
      ]),
      maps: this.provider(
        'integrations.maps.provider',
        'integrations.maps.enabled',
        ['GOOGLE_MAPS_API_KEY'],
      ),
      ai: this.provider('integrations.ai.provider', 'integrations.ai.enabled', [
        'AI_PROVIDER_API_KEY',
      ]),
      monitoring: this.provider(
        'integrations.monitoring.provider',
        'integrations.monitoring.enabled',
        ['SENTRY_DSN'],
      ),
      documentRenderer: this.provider(
        'integrations.documentRenderer.provider',
        'integrations.documentRenderer.enabled',
        ['DOCUMENT_RENDERER_API_KEY'],
      ),
      accountingExport: this.provider(
        'integrations.accountingExport.provider',
        'integrations.accountingExport.enabled',
        ['ACCOUNTING_EXPORT_API_KEY'],
      ),
      storage: {
        provider: this.configService.get<string>('storage.driver') ?? 'local',
        enabled: true,
        mode:
          this.configService.get<string>('storage.driver') === 's3' &&
          !process.env.AWS_S3_BUCKET
            ? 'missing_credentials'
            : this.configService.get<string>('storage.driver') === 'local'
              ? 'local'
              : 'configured',
      },
    };
  }

  smokeTests() {
    const health = this.health();
    return Object.fromEntries(
      Object.entries(health).map(([name, status]) => {
        const item = status as ProviderStatus;
        return [
          name,
          {
            ...item,
            checkedAt: new Date().toISOString(),
            ok:
              item.mode === 'local' ||
              item.mode === 'sandbox' ||
              item.mode === 'configured',
            message:
              item.mode === 'missing_credentials'
                ? `${name} credentials are not configured.`
                : `${name} provider is ${item.mode}.`,
          },
        ];
      }),
    );
  }

  private provider(
    providerKey: string,
    enabledKey: string | undefined,
    requiredEnv: string[],
  ): ProviderStatus {
    const provider = this.configService.get<string>(providerKey) ?? 'log';
    const enabled = enabledKey
      ? (this.configService.get<boolean>(enabledKey) ?? false)
      : provider !== 'log';
    const sandboxEnabled = process.env.INTEGRATION_SANDBOX_MODE === 'true';
    const hasCredentials = requiredEnv.every((key) =>
      Boolean(process.env[key]),
    );
    return {
      provider,
      enabled,
      mode:
        !enabled || provider === 'log'
          ? 'local'
          : sandboxEnabled
            ? 'sandbox'
            : hasCredentials
              ? 'configured'
              : 'missing_credentials',
    };
  }
}
