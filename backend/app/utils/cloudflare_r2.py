"""Cloudflare R2 storage client for image uploads."""
import logging
import uuid
import boto3
from botocore.client import Config

from app.core.config import settings

logger = logging.getLogger("app.utils.cloudflare_r2")

s3 = boto3.client(
    service_name="s3",
    endpoint_url=f"https://{settings.R2_ACCOUNT_ID}.r2.cloudflarestorage.com",
    aws_access_key_id=settings.R2_ACCESS_KEY_ID,
    aws_secret_access_key=settings.R2_SECRET_ACCESS_KEY,
    config=Config(signature_version="s3v4"),
    region_name="auto"
)

def upload_file(file, folder="business"):

    extension = file.filename.split(".")[-1]

    filename = f"{folder}/{uuid.uuid4()}.{extension}"

    s3.upload_fileobj(
        file.file,
        settings.R2_BUCKET_NAME,
        filename,
        ExtraArgs={
            "ContentType": file.content_type
        }
    )

    return f"{settings.R2_PUBLIC_URL}/{filename}"