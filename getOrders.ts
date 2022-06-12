"use strict";
import { DynamoDB } from "aws-sdk";

module.exports.getOrders = async (event) => {
  console.log(event.queryStringParameters);

  // do check and statuscode error return for bad parameter
  const scanParams = {
    TableName: process.env.DYNAMODB_ORDERS_TABLE,
    FilterExpression: "#sid = :sid",
    ExpressionAttributeNames: {
      "#sid": "sellerId",
    },
    ExpressionAttributeValues: {
      ":sid": "guuuuu",
    },
  };

  const dynamoDB = new DynamoDB.DocumentClient();
  const result = await dynamoDB.scan(scanParams).promise();

  if (result.Count === 0) {
    return {
      statusCode: 404,
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(result.Items),
    headers: { "Content-Type": "application/json" },
  };
};
