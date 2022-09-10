"use strict";
import { DynamoDB } from "aws-sdk";
import _ from "lodash";
import { dataTypes, getFilterExpressionParams } from "./dbFiltering";
import { IFlight } from "./interfaces";

module.exports.getFlights = async (event) => {
  const scanParams = {
    TableName: process.env.DYNAMODB_ORDERS_TABLE,
    ...getFilterExpressionParams(
      event.queryStringParameters || {},
      dataTypes.flight
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

  const flights: IFlight[] = result.Items.map((flight) => {
    const { mood, tiredness, love, ...rest } = flight;
    return { ...rest, sensorData: { mood, tiredness, love } } as IFlight;
  });

  return {
    statusCode: 200,
    body: JSON.stringify(flights),
    headers: { "Content-Type": "application/json" },
  };
};
