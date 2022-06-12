# Simple SQS Standard Example

This example demonstrates how to setup a SQS Standard and send messages through the message body and attributes.

## Usage

In order to enable filtering by more fields, simply add them to:

1. `AttributeDefinitions` and `GlobalSecondaryIndexes` in `serverless.yml > resources > ordersTable`
2. `filterableAttributes` in `getOrders`
