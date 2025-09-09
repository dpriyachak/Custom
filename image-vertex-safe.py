import boto3
import fitz  # PyMuPDF
import base64
import os

s3 = boto3.client("s3")

# ----------------------
# Utilities
# ----------------------
def load_pdf_from_s3(bucket, key):
    obj = s3.get_object(Bucket=bucket, Key=key)
    pdf_bytes = obj["Body"].read()
    return fitz.open(stream=pdf_bytes, filetype="pdf")

def load_image_from_s3(bucket, key):
    obj = s3.get_object(Bucket=bucket, Key=key)
    img_bytes = obj["Body"].read()
    return fitz.Pixmap(img_bytes)

def save_bytes_to_s3(bucket, key, data_bytes, content_type="image/jpeg"):
    s3.put_object(Bucket=bucket, Key=key, Body=data_bytes, ContentType=content_type)

def pdf_page_to_vertex_safe_image(page, max_mb=7, min_zoom=0.2, max_zoom=1.0, zoom_step=0.1):
    zoom = max_zoom
    while zoom >= min_zoom:
        mat = fitz.Matrix(zoom, zoom)
        pix = page.get_pixmap(matrix=mat, alpha=False)
        img_bytes = pix.tobytes("jpeg")
        size_mb = len(img_bytes) / (1024 * 1024)
        if size_mb <= max_mb:
            break
        zoom -= zoom_step
    else:
        print(f"⚠️ Warning: Image exceeds {max_mb} MB even at min_zoom={min_zoom}")

    return (
        base64.b64encode(img_bytes).decode("utf-8"),
        size_mb,
        (pix.width, pix.height),
        img_bytes,
    )

def image_to_vertex_safe(base_pix, max_mb=7, min_zoom=0.2, max_zoom=1.0, zoom_step=0.1):
    zoom = max_zoom
    img_bytes = None
    final_pix = None

    while zoom >= min_zoom:
        new_width = int(base_pix.width * zoom)
        new_height = int(base_pix.height * zoom)
        scaled_pix = fitz.Pixmap(base_pix, 0).resize(new_width, new_height)
        img_bytes = scaled_pix.tobytes("jpeg")
        size_mb = len(img_bytes) / (1024 * 1024)
        if size_mb <= max_mb:
            final_pix = scaled_pix
            break
        zoom -= zoom_step
    else:
        print(f"⚠️ Warning: Image exceeds {max_mb} MB even at min_zoom={min_zoom}")
        final_pix = scaled_pix

    return (
        base64.b64encode(img_bytes).decode("utf-8"),
        size_mb,
        (final_pix.width, final_pix.height),
        img_bytes,
    )

# ----------------------
# Lambda Handler
# ----------------------
def lambda_handler(event, context):
    """
    Expected event:
    {
      "bucket": "my-input-bucket",
      "key": "file.pdf" | "file.jpg",
      "output_bucket": "my-output-bucket",
      "first_page_only": true
    }
    """
    bucket = event["bucket"]
    key = event["key"]
    output_bucket = event.get("output_bucket")
    max_mb = float(event.get("max_mb", 7))
    first_page_only = event.get("first_page_only", False)

    results = []

    if key.lower().endswith(".pdf"):
        # Handle PDF
        doc = load_pdf_from_s3(bucket, key)
        pages_to_process = [0] if first_page_only else range(len(doc))
        for page_num in pages_to_process:
            page = doc.load_page(page_num)
            img_b64, size_mb, dims, img_bytes = pdf_page_to_vertex_safe_image(
                page, max_mb=max_mb
            )
            if output_bucket:
                out_key = f"{os.path.splitext(key)[0]}_page_{page_num+1}.jpg"
                save_bytes_to_s3(output_bucket, out_key, img_bytes)
            results.append(
                {
                    "page": page_num + 1,
                    "size_mb": size_mb,
                    "dimensions": dims,
                    "base64": img_b64,
                }
            )
    else:
        # Handle image
        base_pix = load_image_from_s3(bucket, key)
        img_b64, size_mb, dims, img_bytes = image_to_vertex_safe(
            base_pix, max_mb=max_mb
        )
        if output_bucket:
            out_key = f"{os.path.splitext(key)[0]}_resized.jpg"
            save_bytes_to_s3(output_bucket, out_key, img_bytes)
        results.append(
            {"size_mb": size_mb, "dimensions": dims, "base64": img_b64}
        )

    return {
        "status": "success",
        "results": results,
    }
