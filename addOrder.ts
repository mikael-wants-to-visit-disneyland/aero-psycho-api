"use strict";
const AWS = require("aws-sdk");

export interface IOrder {
  orderId: string;
  dateCreated: string;
  sellerId: string;
  address: IAddress;
  items: IItem[];
}

export interface IAddress {
  line1: string;
  line2: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
}

export interface IItem {
  product: string;
  description: string;
  name: string;
  unitPrice: number;
  qty: number;
  totalPrice: number;
}

export const addOrder = async (order: IOrder, id: string) => {
  const dynamoDb = new AWS.DynamoDB.DocumentClient();
  const putParams = {
    TableName: process.env.DYNAMODB_ORDERS_TABLE,
    Key: { id },
    ConditionExpression: "attribute_not_exists(id)", // Ensures idempotency, as explained in https://cloudonaut.io/your-lambda-function-might-execute-twice-deal-with-it/
    Item: { id, ...order },
  };
  await dynamoDb.put(putParams).promise();

  return {
    statusCode: 201,
  };
};
