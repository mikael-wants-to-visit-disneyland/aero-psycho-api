"use strict";
import { DynamoDB } from "aws-sdk";
import _ from "lodash";
import { dataTypes, getFilterExpressionParams } from "./dbFiltering";

module.exports.getAirports = async (event) => {
  const scanParams = {
    TableName: process.env.DYNAMODB_ORDERS_TABLE,
    ...getFilterExpressionParams(
      event.queryStringParameters || {},
      dataTypes.airport
    ),
  };
  const dynamoDB = new DynamoDB.DocumentClient();
  const result = await dynamoDB.scan(scanParams).promise();

  if (result.Count === 0) {
    console.log("dynamoDB scan yielded an empty result.");
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
