"use strict";
import { DynamoDB } from "aws-sdk";
import { IFlight, flightSchema } from "./interfaces";

export const addFlight = async (flight: IFlight) => {
  const dynamoDb = new DynamoDB.DocumentClient();
  await dynamoDb
    .put({
      TableName: process.env.DYNAMODB_ORDERS_TABLE,
      ConditionExpression: "attribute_not_exists(flightCode)", // Ensures idempotency, as explained in https://cloudonaut.io/your-lambda-function-might-execute-twice-deal-with-it/
      Item: await flightSchema.validate(flight),
    })
    .promise();

  return {
    statusCode: 201,
  };
};
