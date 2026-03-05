from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from botocore.exceptions import NoCredentialsError, ClientError
from security.responses import success_response, error_response
from .utils import check_iam_roles, check_kms_encryption, check_cloudtrail, check_credentials
from .models import CloudAuditResult
from security.permissions import TenantPermission, RoleBasedPermission, Permission
from security.middleware import TenantContext
import logging

logger = logging.getLogger(__name__)


class CloudAuditView(APIView):
    permission_classes = [
        TenantPermission,
        RoleBasedPermission([Permission.RUN_AUDITS], require_all=False),
    ]

    def get(self, request):
        if not check_credentials():
            return error_response(
                'Cloud audit requires AWS credentials to be configured. Please set up AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY environment variables.',
                'CREDENTIALS_REQUIRED',
                status.HTTP_400_BAD_REQUEST,
                {'status': 'requires_credentials'}
            )

        tenant_id = TenantContext.get_tenant()
        
        iam_issues = check_iam_roles()
        kms_issues = check_kms_encryption()
        cloudtrail_status = check_cloudtrail()

        try:
            CloudAuditResult.objects.create(
                tenant_id=tenant_id,
                audit_type="IAM Role Check",
                resource_name="IAM roles",
                status="open" if iam_issues and "No IAM issues found" not in str(iam_issues) else "closed",
                details=str(iam_issues)
            )

            CloudAuditResult.objects.create(
                tenant_id=tenant_id,
                audit_type="KMS Encryption Check",
                resource_name="S3 buckets",
                status="open" if kms_issues and "All buckets are encrypted" not in str(kms_issues) else "closed",
                details=str(kms_issues)
            )

            CloudAuditResult.objects.create(
                tenant_id=tenant_id,
                audit_type="CloudTrail Check",
                resource_name="CloudTrail",
                status="open" if cloudtrail_status == "CloudTrail is not enabled in the account." else "closed",
                details=cloudtrail_status
            )
        except Exception as e:
            logger.error(f"Error creating audit results: {e}")

        return success_response(message='Cloud audit completed successfully!')
