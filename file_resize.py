import fitz  # PyMuPDF
import base64

def pdf_page_to_vertex_safe_image(pdf_path, page_number=0, max_mb=7, max_dim=2000):
    """
    Convert one PDF page to base64 JPEG, only resizing if it's too large.
    """
    doc = fitz.open(pdf_path)
    page = doc[page_number]

    zoom = 1.0  # start at 100% resolution
    while True:
        mat = fitz.Matrix(zoom, zoom)
        pix = page.get_pixmap(matrix=mat)

        # Save as JPEG (smaller than PNG)
        img_bytes = pix.tobytes("jpeg")
        size_mb = len(img_bytes) / (1024 * 1024)

        # ✅ Case 1: Already safe size
        if size_mb <= max_mb and pix.width <= max_dim and pix.height <= max_dim:
            break  

        # ❌ Case 2: Too large → reduce resolution and retry
        zoom *= 0.8  

    img_b64 = base64.b64encode(img_bytes).decode("utf-8")
    return img_b64, size_mb, (pix.width, pix.height)

# Example usage
b64, size_mb, dims = pdf_page_to_vertex_safe_image("sample.pdf", page_number=0)
print(f"✅ Final size: {size_mb:.2f} MB, dimensions: {dims}")
