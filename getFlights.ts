"use strict";
import { DynamoDB } from "aws-sdk";
import _ from "lodash";

const queryStringParamsFilterAttributes: Record<
  string,
  { attribute: string; comparison: string }
> = {
  dataType: { attribute: "dataType", comparison: "=" },
  originAirportCode: { attribute: "originAirportCode", comparison: "=" },
  destinationAirportCode: {
    attribute: "destinationAirportCode",
    comparison: "=",
  },
  flightCode: { attribute: "flightCode", comparison: "=" },
  startDate: { attribute: "date", comparison: ">=" },
  endDate: { attribute: "date", comparison: "<=" },
};

export const dataTypes = { airport: "airport", flights: "flight" };
export const getDataTypedParams = (filterParams, dataType) => ({
  ...filterParams,
  dataType: dataType,
});

/* Transform the query string parameters into the DynamoDB filter expression, 
   alongside the expression's key and value input objects. */
const getFilterExpressionParams: (filterParams: Record<string, string>) => {
  FilterExpression: string;
  ExpressionAttributeNames: Record<string, string>;
  ExpressionAttributeValues: Record<string, string>;
} = (filterParams) => {
  console.log(filterParams);
  const FilterExpression = Object.keys(filterParams)
    .map(
      (name, i) =>
        `#${i} ${queryStringParamsFilterAttributes[name].comparison} :${i}`
    )
    .join(" AND ");
  const ExpressionAttributeNames = Object.assign(
    {},
    ...Object.keys(filterParams).map((name, i) => ({
      [`#${i}`]: queryStringParamsFilterAttributes[name].attribute,
    }))
  );
  const ExpressionAttributeValues = Object.assign(
    {},
    ...Object.values(filterParams).map((value, i) => ({
      [`:${i}`]: value,
    }))
  );
  return {
    FilterExpression,
    ExpressionAttributeNames,
    ExpressionAttributeValues,
  };
};

module.exports.getFlights = async (event) => {
  /* Check that every query string parameter corresponds to a filterable field. */
  Object.keys(event.queryStringParameters).forEach((param) => {
    if (
      !Object.keys(queryStringParamsFilterAttributes).find(
        (field) => field === param
      )
    ) {
      console.error(`Query string parameter ${param} is not valid.`);
    }
  });

  const scanParams = {
    TableName: process.env.DYNAMODB_ORDERS_TABLE,
    ...getFilterExpressionParams(
      getDataTypedParams(event.queryStringParameters, dataTypes.flights)
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
