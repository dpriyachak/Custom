import json
import os

# Define the list of invalid extensions
INVALID_EXTENSIONS = {".docx", ".doc", ".xlsx", ".csv", ".db"}

def lambda_handler(event, context):
    """
    Lambda to validate document type before processing
    """

    # Example: assuming the file name comes in request body as 'fileName'
    try:
        file_name = event.get("fileName")
        if not file_name:
            return {
                "statusCode": 400,
                "body": json.dumps({"error": "Missing 'fileName' in request"})
            }

        # Extract extension
        _, ext = os.path.splitext(file_name.lower())

        # Check if invalid
        if ext in INVALID_EXTENSIONS:
            return {
                "statusCode": 400,
                "body": json.dumps({
                    "error": f"Invalid document type: '{ext}'. Supported types are images and PDFs only."
                })
            }

        # ✅ Continue with processing for valid files
        return {
            "statusCode": 200,
            "body": json.dumps({"message": f"Document {file_name} accepted for processing."})
        }

    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({"error": str(e)})
        }
