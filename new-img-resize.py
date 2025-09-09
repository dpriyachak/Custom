import boto3
import fitz  # PyMuPDF
import base64
import os

s3 = boto3.client("s3")

# ----------------------
# S3 Helpers
# ----------------------
def load_file_from_s3(bucket, key):
    obj = s3.get_object(Bucket=bucket, Key=key)
    return obj["Body"].read()

def save_bytes_to_s3(bucket, key, data_bytes, content_type="image/jpeg"):
    s3.put_object(Bucket=bucket, Key=key, Body=data_bytes, ContentType=content_type)

# ----------------------
# PDF Processing
# ----------------------
def pdf_page_to_vertex_safe_image(page, max_mb=7, min_zoom=0.2, max_zoom=1.0, zoom_step=0.1):
    zoom = max_zoom
    img_bytes, dims = None, None

    while zoom >= min_zoom:
        mat = fitz.Matrix(zoom, zoom)
        pix = page.get_pixmap(matrix=mat, alpha=False)
        img_bytes = pix.tobytes("jpeg")
        size_mb = len(img_bytes) / (1024 * 1024)

        if size_mb <= max_mb:
            dims = (pix.width, pix.height)
            break
        zoom -= zoom_step
    else:
        print(f"⚠️ Warning: Image exceeds {max_mb} MB even at min_zoom={min_zoom}")
        dims = (pix.width, pix.height)

    img_b64 = base64.b64encode(img_bytes).decode("utf-8")
    return img_b64, size_mb, dims, img_bytes

# ----------------------
# Image Processing
# ----------------------
def resize_image_with_zoom(image_bytes, zoom=1.0, fmt="jpeg"):
    """Open image as 1-page doc and render with Matrix zoom"""
    img_doc = fitz.open(stream=image_bytes, filetype="jpeg")  # auto-detectable
    page = img_doc[0]
    mat = fitz.Matrix(zoom, zoom)
    pix = page.get_pixmap(matrix=mat, alpha=False)
    img_bytes = pix.tobytes(fmt)
    return img_bytes, (pix.width, pix.height)

def image_to_vertex_safe(image_bytes, max_mb=7, min_zoom=0.2, max_zoom=1.0, zoom_step=0.1):
    zoom = max_zoom
    final_bytes, final_dims, size_mb = None, None, None

    while zoom >= min_zoom:
        resized_bytes, dims = resize_image_with_zoom(image_bytes, zoom=zoom)
        size_mb = len(resized_bytes) / (1024 * 1024)

        if size_mb <= max_mb:
            final_bytes, final_dims = resized_bytes, dims
            break
        zoom -= zoom_step
    else:
        print(f"⚠️ Warning: Image exceeds {max_mb} MB even at min_zoom={min_zoom}")
        final_bytes, final_dims = resized_bytes, dims

    img_b64 = base64.b64encode(final_bytes).decode("utf-8")
    return img_b64, size_mb, final_dims, final_bytes

# ----------------------
# Lambda Handler
# ----------------------
def lambda_handler(event, context):
    """
    Expected event:
    {
      "bucket": "my-input-bucket",
      "key": "file.pdf" | "file.jpg" | "file.png",
      "output_bucket": "my-output-bucket",
      "first_page_only": true,
      "max_mb": 7
    }
    """
    bucket = event["bucket"]
    key = event["key"]
    output_bucket = event.get("output_bucket")
    max_mb = float(event.get("max_mb", 7))
    first_page_only = event.get("first_page_only", False)

    results = []
    file_bytes = load_file_from_s3(bucket, key)

    if key.lower().endswith(".pdf"):
        # Process PDF
        doc = fitz.open(stream=file_bytes, filetype="pdf")
        pages_to_process = [0] if first_page_only else range(len(doc))

        for page_num in pages_to_process:
            page = doc.load_page(page_num)
            img_b64, size_mb, dims, img_bytes = pdf_page_to_vertex_safe_image(
                page, max_mb=max_mb
            )

            if output_bucket:
                out_key = f"{os.path.splitext(key)[0]}_page_{page_num+1}.jpg"
                save_bytes_to_s3(output_bucket, out_key, img_bytes)

            results.append({
                "page": page_num + 1,
                "size_mb": size_mb,
                "dimensions": dims,
                "base64": img_b64
            })

    else:
        # Process Image (jpg, png, etc.)
        img_b64, size_mb, dims, img_bytes = image_to_vertex_safe(
            file_bytes, max_mb=max_mb
        )

        if output_bucket:
            out_key = f"{os.path.splitext(key)[0]}_resized.jpg"
            save_bytes_to_s3(output_bucket, out_key, img_bytes)

        results.append({
            "size_mb": size_mb,
            "dimensions": dims,
            "base64": img_b64
        })

    return {
        "status": "success",
        "results": results
    }
