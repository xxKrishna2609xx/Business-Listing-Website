from app.utils.cloudflare_r2 import upload_file


async def upload_image_file(file) -> dict:
    """Upload an image file to Cloudflare R2."""
    if not file.content_type.startswith("image/"):
        return {
            "success": False,
            "message": "Only image files are allowed."
        }

    url = upload_file(file)

    return {
        "success": True,
        "url": url
    }
