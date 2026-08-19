# Sandbox Integrations

TripOS runs with safe sandbox/local integration values by default in `tripos-api-server/.env.example` and `tripos-api-server/.env.development`.

Do not commit real vendor secrets. Production values must be supplied through the deployment secret store.

## Dependency Matrix

| Area              | Sandbox provider      | Required keys                                                                                                                          | Production action                               |
| ----------------- | --------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| Email             | `sandbox_smtp`        | `NOTIFICATION_EMAIL_SMTP_HOST`, `NOTIFICATION_EMAIL_SMTP_USERNAME`, `NOTIFICATION_EMAIL_SMTP_PASSWORD`                                 | Replace with SMTP/SES/SendGrid credentials      |
| SMS               | `sandbox_msg91`       | `NOTIFICATION_SMS_MSG91_AUTH_KEY`, `NOTIFICATION_SMS_MSG91_TEMPLATE_ID`                                                                | Replace with approved SMS sender credentials    |
| WhatsApp          | `sandbox_meta`        | `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_BUSINESS_ACCOUNT_ID`, `WHATSAPP_WEBHOOK_VERIFY_TOKEN`                   | Replace with Meta WhatsApp Business credentials |
| Push              | `sandbox_fcm`         | `NOTIFICATION_PUSH_FCM_PROJECT_ID`, `NOTIFICATION_PUSH_FCM_CLIENT_EMAIL`, `NOTIFICATION_PUSH_FCM_PRIVATE_KEY`                          | Replace with Firebase project credentials       |
| Payments          | `sandbox`             | `PAYMENT_SIGNATURE_SECRET`, `PAYMENT_WEBHOOK_SECRET`, `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `STRIPE_SECRET_KEY`                    | Replace with selected gateway live credentials  |
| Google Play       | `sandbox_google_play` | `GOOGLE_PLAY_PACKAGE_NAME`, `GOOGLE_PLAY_SERVICE_ACCOUNT_JSON`, `GOOGLE_PLAY_RTDN_AUDIENCE`                                            | Replace with Play Console service account       |
| App Store         | `sandbox_app_store`   | `APPLE_STORE_ISSUER_ID`, `APPLE_STORE_KEY_ID`, `APPLE_STORE_BUNDLE_ID`, `APPLE_STORE_PRIVATE_KEY`, `APPLE_STORE_ENVIRONMENT`           | Replace with App Store Connect API credentials  |
| Maps              | `google_maps`         | `GOOGLE_MAPS_API_KEY`                                                                                                                  | Replace with restricted Google Maps API key     |
| AI assistant      | `sandbox_ai`          | `AI_PROVIDER_API_KEY`, `AI_PROVIDER_BASE_URL`, `AI_PROVIDER_MODEL`                                                                     | Replace with selected AI provider credentials   |
| Document renderer | `sandbox_html`        | `DOCUMENT_RENDERER_API_KEY`, `DOCUMENT_RENDERER_BASE_URL`                                                                              | Replace with renderer service credentials       |
| Accounting export | `sandbox_accounting`  | `ACCOUNTING_EXPORT_API_KEY`, `ACCOUNTING_EXPORT_BASE_URL`                                                                              | Replace with accounting connector credentials   |
| Storage           | `local`               | `STORAGE_DRIVER`, `STORAGE_LOCAL_ROOT`; S3 mode also needs `AWS_REGION`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_S3_BUCKET` | Replace with S3-compatible bucket credentials   |
| Monitoring        | `sandbox_sentry`      | `SENTRY_DSN`, `SENTRY_TRACES_SAMPLE_RATE`                                                                                              | Replace with Sentry/APM project DSN             |

## Smoke Test

Use the integration health and smoke-test APIs after loading sandbox env:

- `GET /api/v1/integrations/health`
- `POST /api/v1/integrations/smoke-tests`

Each provider should return `local`, `sandbox`, or `configured`. A `missing_credentials` mode means the module is not ready for deployment in that environment.
