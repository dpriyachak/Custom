import boto3
import fitz  # PyMuPDF
import base64
import os

s3 = boto3.client("s3")

# ---------- Helpers ----------
def detect_filetype_from_s3(key: str, content_type: str) -> str:
    """Return 'pdf' | 'jpeg' | 'png'."""
    ct = (content_type or "").lower()
    if "pdf" in ct:
        return "pdf"
    if "jpeg" in ct or "jpg" in ct:
        return "jpeg"
    if "png" in ct:
        return "png"
    ext = key.lower().split(".")[-1]
    if ext in ("pdf", "jpg", "jpeg", "png"):
        return "jpeg" if ext in ("jpg", "jpeg") else ext
    raise ValueError(f"Unsupported file type: {content_type}, key={key}")

def load_file_from_s3(bucket: str, key: str):
    obj = s3.get_object(Bucket=bucket, Key=key)
    data = obj["Body"].read()
    filetype = detect_filetype_from_s3(key, obj.get("ContentType", ""))
    return data, filetype

def save_bytes_to_s3(bucket: str, key: str, data_bytes: bytes, content_type="image/jpeg"):
    s3.put_object(Bucket=bucket, Key=key, Body=data_bytes, ContentType=content_type)

# ---------- Zoom-based resize ----------
def render_pixmap_with_zoom(pix, max_mb=7.0, min_zoom=0.2, max_zoom=1.0, zoom_step=0.1):
    zoom = max_zoom
    last_bytes, last_dims, size_mb = None, None, None

    while zoom >= min_zoom:
        mat = fitz.Matrix(zoom, zoom)
        scaled_pix = fitz.Pixmap(pix, 0, mat) if pix.alpha == 0 else fitz.Pixmap(pix, 0, mat, alpha=False)
        jpg = scaled_pix.tobytes("jpeg")
        size_mb = len(jpg) / (1024 * 1024)
        last_bytes = jpg
        last_dims = (scaled_pix.width, scaled_pix.height)

        if size_mb <= max_mb:
            break
        zoom -= zoom_step
    else:
        print(f"⚠️ Warning: Still > {max_mb} MB even at min_zoom={min_zoom}")

    b64 = base64.b64encode(last_bytes).decode("utf-8")
    return b64, size_mb, last_dims, last_bytes

# ---------- PDF handler ----------
def pdf_to_vertex_safe(pdf_bytes, max_mb=7.0, first_page_only=False,
                       min_zoom=0.2, max_zoom=1.0, zoom_step=0.1):
    doc = fitz.open(stream=pdf_bytes, filetype="pdf")
    pages = [0] if first_page_only else range(len(doc))
    results = []
    for pno in pages:
        page = doc.load_page(pno)
        pix = page.get_pixmap(alpha=False)
        b64, size_mb, dims, jpg = render_pixmap_with_zoom(
            pix, max_mb=max_mb, min_zoom=min_zoom, max_zoom=max_zoom, zoom_step=zoom_step
        )
        results.append({"page": pno + 1, "base64": b64, "size_mb": size_mb, "dimensions": dims, "jpeg": jpg})
    return results

# ---------- Image handler ----------
def image_to_vertex_safe(image_bytes, filetype, max_mb=7.0,
                         min_zoom=0.2, max_zoom=1.0, zoom_step=0.1):
    pix = fitz.Pixmap(image_bytes)  # direct load into pixmap
    b64, size_mb, dims, jpg = render_pixmap_with_zoom(
        pix, max_mb=max_mb, min_zoom=min_zoom, max_zoom=max_zoom, zoom_step=zoom_step
    )
    return {"base64": b64, "size_mb": size_mb, "dimensions": dims, "jpeg": jpg}

# ---------- Lambda handler ----------
def lambda_handler(event, context):
    """
    event = {
      "bucket": "my-input-bucket",
      "key": "file.pdf|file.jpg|file.png",
      "output_bucket": "my-output-bucket",   # optional
      "first_page_only": true,               # for PDFs
      "max_mb": 7.0,
      "min_zoom": 0.2,
      "max_zoom": 1.0,
      "zoom_step": 0.1
    }
    """
    bucket = event["bucket"]
    key = event["key"]
    output_bucket = event.get("output_bucket")
    first_page_only = bool(event.get("first_page_only", False))
    max_mb = float(event.get("max_mb", 7.0))
    min_zoom = float(event.get("min_zoom", 0.2))
    max_zoom = float(event.get("max_zoom", 1.0))
    zoom_step = float(event.get("zoom_step", 0.1))

    file_bytes, filetype = load_file_from_s3(bucket, key)

    results = []
    if filetype == "pdf":
        rendered = pdf_to_vertex_safe(
            file_bytes, max_mb=max_mb,
            first_page_only=first_page_only,
            min_zoom=min_zoom, max_zoom=max_zoom, zoom_step=zoom_step
        )
        for r in rendered:
            if output_bucket:
                out_key = f"{os.path.splitext(key)[0]}_page_{r['page']}.jpg"
                save_bytes_to_s3(output_bucket, out_key, r["jpeg"])
                r["s3_output"] = f"s3://{output_bucket}/{out_key}"
            r.pop("jpeg", None)
            results.append(r)
    else:
        r = image_to_vertex_safe(
            file_bytes, filetype=filetype,
            max_mb=max_mb, min_zoom=min_zoom, max_zoom=max_zoom, zoom_step=zoom_step
        )
        if output_bucket:
            out_key = f"{os.path.splitext(key)[0]}_resized.jpg"
            save_bytes_to_s3(output_bucket, out_key, r["jpeg"])
            r["s3_output"] = f"s3://{output_bucket}/{out_key}"
        r.pop("jpeg", None)
        results.append(r)

    return {"status": "success", "filetype": filetype, "results": results}
