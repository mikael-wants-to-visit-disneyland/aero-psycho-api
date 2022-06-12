"use strict";
import { DynamoDB } from "aws-sdk";

/* Transform the query string parameters into the DynamoDB filter expression, 
   alongside the expression's key and value input objects. */
const getFilterExpressionParams: (filterParams: Record<string, string>) => {
  FilterExpression: string;
  ExpressionAttributeNames: Record<string, string>;
  ExpressionAttributeValues: Record<string, string>;
} = (filterParams) => {
  const attributeNames = Object.keys(filterParams).map((name, i) => ({
    [`#${i}`]: name,
  }));
  const attributeValues = Object.values(filterParams).map((value, i) => ({
    [`:${i}`]: value,
  }));
  const filterExpression = attributeNames
    .map((_, i) => `#${i} = :${i}`)
    .join(" AND ");
  return {
    FilterExpression: filterExpression,
    ExpressionAttributeNames: Object.assign({}, ...attributeNames),
    ExpressionAttributeValues: Object.assign({}, ...attributeValues),
  };
};

module.exports.getOrders = async (event) => {
  // make the queryable keys into env vars

  // do check and statuscode error return for bad parameter
  const scanParams = {
    TableName: process.env.DYNAMODB_ORDERS_TABLE,
    ...getFilterExpressionParams(event.queryStringParameters),
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
