"use strict";
import { DynamoDB } from "aws-sdk";

module.exports.getOrders = async (event) => {
  console.log(Object.entries(event.queryStringParameters));
  console.log(
    Object.entries(event.queryStringParameters)
      .map(([key, value], _) => `${key} = ${value}`)
      .join(" AND ")
  );

  const attributeNames = Object.keys(event.queryStringParameters).map(
    (name, i) => ({ [`#${i}`]: name })
  );
  const attributeValues = Object.values(event.queryStringParameters).map(
    (value, i) => ({ [`:${i}`]: value })
  );
  const filterExpression = attributeNames
    .map((_, i) => `#${i} = :${i}`)
    .join(" AND ");

  // make the queryable keys into env vars

  // do check and statuscode error return for bad parameter
  const scanParams = {
    TableName: process.env.DYNAMODB_ORDERS_TABLE,
    FilterExpression: filterExpression,
    ExpressionAttributeNames: Object.assign({}, ...attributeNames),
    ExpressionAttributeValues: Object.assign({}, ...attributeValues),
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
