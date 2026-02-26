import boto3
from botocore.exceptions import ClientError

# Initialize AWS S3 client
s3_client = boto3.client('s3')

def check_open_s3_buckets():
    """Check for open (public) S3 buckets in AWS."""
    try:
        response = s3_client.list_buckets()
        open_buckets = []

        for bucket in response['Buckets']:
            bucket_name = bucket['Name']
            acl = s3_client.get_bucket_acl(Bucket=bucket_name)

            for grant in acl['Grants']:
                if 'AllUsers' in grant.get('Grantee', {}).get('Type', ''):
                    open_buckets.append({
                        'name': bucket_name,
                        'details': 'Bucket is publicly accessible.',
                    })

        return open_buckets

    except ClientError as e:
        print(f"Error checking S3 buckets: {e}")
        return []


def check_iam_roles():
    """Check for overly permissive IAM roles."""
    try:
        iam_client = boto3.client('iam')
        response = iam_client.list_roles()
        issues = []

        for role in response.get('Roles', []):
            role_name = role['RoleName']
            # Check for permissive policies (simplified check)
            attached_policies = iam_client.list_attached_role_policies(RoleName=role_name)
            for policy in attached_policies.get('AttachedPolicies', []):
                if policy['PolicyName'] == 'AdministratorAccess':
                    issues.append(f"Role {role_name} has AdministratorAccess")

        return issues if issues else "No IAM issues found"
    except ClientError as e:
        return f"Error checking IAM roles: {e}"


def check_kms_encryption():
    """Check for unencrypted S3 buckets."""
    try:
        response = s3_client.list_buckets()
        issues = []

        for bucket in response['Buckets']:
            bucket_name = bucket['Name']
            try:
                encryption = s3_client.get_bucket_encryption(Bucket=bucket_name)
                if 'ServerSideEncryptionConfiguration' not in encryption:
                    issues.append(f"Bucket {bucket_name} is not encrypted")
            except ClientError as e:
                if 'ServerSideEncryptionConfigurationNotFoundError' in str(e):
                    issues.append(f"Bucket {bucket_name} does not have encryption enabled")

        return issues if issues else "All buckets are encrypted"
    except ClientError as e:
        return f"Error checking KMS encryption: {e}"


def check_cloudtrail():
    """Check if CloudTrail is enabled."""
    try:
        cloudtrail_client = boto3.client('cloudtrail')
        response = cloudtrail_client.describe_trails()

        if not response.get('trailList'):
            return "CloudTrail is not enabled in the account."

        for trail in response['trailList']:
            if not trail.get('IsMultiRegionTrail'):
                return "CloudTrail is not configured for multi-region"

        return "CloudTrail is properly configured"
    except ClientError as e:
        return f"Error checking CloudTrail: {e}"

