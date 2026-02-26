from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .utils import check_iam_roles, check_kms_encryption, check_cloudtrail
from .models import CloudAuditResult

class CloudAuditView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Run all audit checks
        iam_issues = check_iam_roles()
        kms_issues = check_kms_encryption()
        cloudtrail_status = check_cloudtrail()

        # Store results in the database
        CloudAuditResult.objects.create(
            audit_type="IAM Role Check",
            resource_name="IAM roles",
            status="open" if iam_issues else "closed",
            details=str(iam_issues)
        )

        CloudAuditResult.objects.create(
            audit_type="KMS Encryption Check",
            resource_name="S3 buckets",
            status="open" if kms_issues else "closed",
            details=str(kms_issues)
        )

        CloudAuditResult.objects.create(
            audit_type="CloudTrail Check",
            resource_name="CloudTrail",
            status="open" if cloudtrail_status == "CloudTrail is not enabled in the account." else "closed",
            details=cloudtrail_status
        )

        return Response({"message": "Cloud audit completed successfully!"})
