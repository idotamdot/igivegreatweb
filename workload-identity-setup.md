# Neural Web Labs - Workload Identity Federation Setup

## 1. Google Cloud Console Configuration

### Create Workload Identity Pool
```bash
gcloud iam workload-identity-pools create neural-web-labs-pool \
    --project=neural-web-labs \
    --location=global \
    --display-name="Neural Web Labs Workload Pool"
```

### Create Workload Identity Provider
```bash
gcloud iam workload-identity-pools providers create-oidc replit-provider \
    --project=neural-web-labs \
    --location=global \
    --workload-identity-pool=neural-web-labs-pool \
    --display-name="Replit OIDC Provider" \
    --attribute-mapping="google.subject=assertion.sub,attribute.repository=assertion.repository" \
    --issuer-uri="https://oidc.replit.com"
```

### Bind Service Account
```bash
gcloud iam service-accounts add-iam-policy-binding \
    neural-web-labs@neural-web-labs.iam.gserviceaccount.com \
    --project=neural-web-labs \
    --role="roles/iam.workloadIdentityUser" \
    --member="principalSet://iam.googleapis.com/projects/PROJECT_NUMBER/locations/global/workloadIdentityPools/neural-web-labs-pool/attribute.repository/YourReplitUsername/neural-web-labs"
```

## 2. Replit Environment Configuration

### Set Environment Variables in Replit Secrets:

```
GOOGLE_CLOUD_PROJECT_ID = neural-web-labs
GOOGLE_CLOUD_LOCATION = us-central1

# Workload Identity Federation
GOOGLE_CLOUD_WORKLOAD_IDENTITY_PROVIDER = projects/PROJECT_NUMBER/locations/global/workloadIdentityPools/neural-web-labs-pool/providers/replit-provider
GOOGLE_CLOUD_SERVICE_ACCOUNT_EMAIL = neural-web-labs@neural-web-labs.iam.gserviceaccount.com

# Optional: Enhanced Features
GOOGLE_CLOUD_AI_ENDPOINT_ID = your-custom-model-endpoint
GOOGLE_CLOUD_LOG_NAME = neural-web-labs-operations
```

### Replace PROJECT_NUMBER
Find your project number:
```bash
gcloud projects describe neural-web-labs --format="value(projectNumber)"
```

## 3. Code Configuration (Already Implemented)

The Neural AI service automatically detects and uses Workload Identity Federation when the environment variables are present. No service account key files needed!

## 4. Verification Steps

### Test Connection
1. Deploy your application
2. Access Admin Dashboard → Neural AI tab
3. Click "Generate Neural Insights" 
4. Check Google Cloud Console for successful API calls

### Monitor Usage
- Google Cloud Console → AI Platform → Usage
- Cloud Logging → neural-web-labs-operations
- Cloud Monitoring → Custom Metrics

## 5. Security Benefits

- ✅ No service account keys to manage
- ✅ Automatic credential rotation
- ✅ Fine-grained access control
- ✅ Audit trail in Cloud Logging
- ✅ Integration with Replit's security model

## 6. Troubleshooting

### Common Issues:
1. **Permission Denied**: Verify service account has required roles
2. **Pool Not Found**: Check project number and pool name
3. **Provider Issues**: Verify Replit OIDC issuer configuration

### Debug Commands:
```bash
# List workload identity pools
gcloud iam workload-identity-pools list --location=global

# Describe pool
gcloud iam workload-identity-pools describe neural-web-labs-pool --location=global

# Test authentication
gcloud auth print-access-token --impersonate-service-account=neural-web-labs@neural-web-labs.iam.gserviceaccount.com
```

Your Neural Web Labs platform will automatically use Workload Identity Federation for secure, keyless Google Cloud integration!