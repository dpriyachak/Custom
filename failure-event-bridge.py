import boto3
import time

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table("StepFunctionFailures")

def lambda_handler(event, context):
    detail = event.get("detail", {})
    
    execution_arn = detail.get("executionArn", "Unknown")
    state_machine = detail.get("stateMachineArn", "Unknown").split(":")[-1]
    status = detail.get("status", "Unknown")
    start_time = detail.get("startDate")
    stop_time = detail.get("stopDate")
    error_info = detail.get("error", {})
    
    error_type = error_info.get("Error", "Unknown")
    cause = error_info.get("Cause", "No details")
    
    # Write into DynamoDB
    table.put_item(
        Item={
            "ExecutionArn": execution_arn,
            "StateMachineName": state_machine,
            "Status": status,
            "ErrorType": error_type,
            "Cause": cause,
            "StartTime": str(start_time),
            "StopTime": str(stop_time),
            "RecordedAt": int(time.time())
        }
    )
    
    return {"message": "Failure recorded", "ExecutionArn": execution_arn}
