"use strict";
import { DynamoDB } from "aws-sdk";
import { airportSchema, IAirport } from "./interfaces";

export const addAirport = async (airport: IAirport) => {
  const dynamoDb = new DynamoDB.DocumentClient();
  await dynamoDb
    .put({
      TableName: process.env.DYNAMODB_ORDERS_TABLE,
      Item: await airportSchema.validate(airport),
    })
    .promise();

  return {
    statusCode: 201,
  };
};
