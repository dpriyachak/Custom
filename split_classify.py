import boto3
import json
import time

textract = boto3.client('textract')
bedrock = boto3.client('bedrock-runtime')
s3 = boto3.client('s3')


def lambda_handler(event, context):
    """
    Step 1: Run Textract on a PDF
    Step 2: Classify each page with an LLM on Bedrock
    Step 3: Return pageToDocMapping
    """

    bucket = event["bucket"]
    key = event["key"]

    print(f"Running Textract for s3://{bucket}/{key}")

    # 1️⃣ Run Textract (synchronous text detection for simplicity)
    response = textract.analyze_document(
        Document={'S3Object': {'Bucket': bucket, 'Name': key}},
        FeatureTypes=['FORMS', 'TABLES']
    )

    # 2️⃣ Build per-page text map
    pages = {}
    for block in response["Blocks"]:
        if block["BlockType"] == "PAGE":
            pages[block["Page"]] = ""
        elif block["BlockType"] == "LINE":
            page_num = block["Page"]
            pages.setdefault(page_num, "")
            pages[page_num] += block["Text"] + " "

    # 3️⃣ Classify each page using Bedrock LLM
    page_to_doc_mapping = []
    for page_num, text in pages.items():
        doc_type = classify_page_with_llm(text)
        page_to_doc_mapping.append({
            "page": page_num,
            "type": doc_type
        })

    # 4️⃣ Return result for next step
    result = {
        "bucket": bucket,
        "key": key,
        "pageToDocMapping": sorted(page_to_doc_mapping, key=lambda x: x["page"])
    }

    print("Classification result:")
    print(json.dumps(result, indent=2))
    return result


# === Helper ===
def classify_page_with_llm(text):
    """
    Calls an LLM (Claude or Titan) hosted on Bedrock to classify the page.
    """
    # Truncate text to first few hundred tokens for efficiency
    truncated_text = text[:2000]

    prompt = f"""
You are a document classifier.
Classify the following document page into one of the categories:
['BirthCertificate', 'DeathCertificate', 'MarriageCertificate', 'Other'].

Return ONLY the category name in JSON:
{{"type": "..."}}.

Page text:
---
{truncated_text}
---
"""

    response = bedrock.invoke_model(
        modelId="anthropic.claude-3-sonnet-20240229-v1:0",
        contentType="application/json",
        accept="application/json",
        body=json.dumps({
            "messages": [{"role": "user", "content": prompt}],
            "max_tokens": 100
        })
    )

    body = json.loads(response['body'].read())
    model_reply = body["content"][0]["text"]

    try:
        result_json = json.loads(model_reply)
        return result_json.get("type", "Unknown")
    except json.JSONDecodeError:
        return "Unknown"
