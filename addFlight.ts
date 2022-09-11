"use strict";
import { DynamoDB } from "aws-sdk";
import { IFlight, flightSchema } from "./interfaces";
import _ from "lodash";

export const addFlight = async (flight: IFlight) => {
  await flightSchema.validate(flight);
  const { sensorData, ...rest } = flight;
  const dynamoDb = new DynamoDB.DocumentClient();
  await dynamoDb
    .put({
      TableName: process.env.DYNAMODB_ORDERS_TABLE,
      Item: { ...rest, ...sensorData },
    })
    .promise();

  return {
    statusCode: 201,
  };
};
