"use strict";
import { DynamoDB } from "aws-sdk";
import { airportSchema, IAirport } from "./interfaces";

export const addAirport = async (airport: IAirport) => {
  const dynamoDb = new DynamoDB.DocumentClient();
  await dynamoDb
    .put({
      TableName: process.env.DYNAMODB_ORDERS_TABLE,
      ConditionExpression: "attribute_not_exists(airportCode)", // Ensures idempotency, as explained in https://cloudonaut.io/your-lambda-function-might-execute-twice-deal-with-it/
      Item: await airportSchema.validate(airport),
    })
    .promise();

  return {
    statusCode: 201,
  };
};
