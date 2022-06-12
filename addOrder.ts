"use strict";
import { DynamoDB } from "aws-sdk";
import { IOrder, orderSchema } from "./interfaces";

export const addOrder = async (order: IOrder, id: string) => {
  const dynamoDb = new DynamoDB.DocumentClient();
  await dynamoDb
    .put({
      TableName: process.env.DYNAMODB_ORDERS_TABLE,
      ConditionExpression: "attribute_not_exists(id)", // Ensures idempotency, as explained in https://cloudonaut.io/your-lambda-function-might-execute-twice-deal-with-it/
      Item: {
        id,
        ...(await orderSchema.validate(order)),
      },
    })
    .promise();

  return {
    statusCode: 201,
  };
};
