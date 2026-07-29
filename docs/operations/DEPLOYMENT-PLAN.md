# Deployment Plan

## Local Development

Initial local stack:

- Node.js LTS
- PostgreSQL
- Redis
- S3-compatible local storage such as MinIO
- API app
- Admin web app

## Environments

- Local
- Development
- Staging
- Production

## AWS v1 Deployment

Recommended first production architecture:

- AWS ECS/Fargate for API and workers
- AWS RDS PostgreSQL
- AWS ElastiCache Redis
- AWS S3 for files
- AWS CloudFront for public assets
- AWS Secrets Manager
- AWS CloudWatch logs and alarms
- GitHub Actions for CI/CD

## Deployment Rules

- Database migrations run before application deployment.
- Background workers deploy with API version compatibility.
- Rollbacks must include migration strategy.
- Feature flags protect incomplete modules.
- Staging must use production-like tenant data structure.

## Later Scale Path

Move to Kubernetes, Kafka, OpenSearch, and extracted services only when supported by real customer scale or enterprise requirements.

