import boto3
import json

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('JobHistoryTable')  # replace with your table name

def lambda_handler(event, context):
    response = table.scan(
        ProjectionExpression="status, reviewer, tags"
    )
    items = response.get("Items", [])

    statuses = set()
    reviewers = set()
    tags_set = set()

    for item in items:
        if "status" in item:
            statuses.add(item["status"])
        if "reviewer" in item:
            reviewers.add(item["reviewer"])
        if "tags" in item and isinstance(item["tags"], list):
            tags_set.update(item["tags"])

    return {
        "statusCode": 200,
        "headers": {"Content-Type": "application/json"},
        "body": json.dumps({
            "statuses": sorted(list(statuses)),
            "reviewers": sorted(list(reviewers)),
            "tags": sorted(list(tags_set))
        })
    }
