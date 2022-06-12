"use strict";
import { DynamoDB } from "aws-sdk";

export interface IOrder {
  orderId: string;
  dateCreated: string; // have to check the YYYY-MM-DD format, as it is needed for he filter expression
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
  const dynamoDb = new DynamoDB.DocumentClient();
  await dynamoDb
    .put({
      TableName: process.env.DYNAMODB_ORDERS_TABLE,
      //ConditionExpression: "attribute_not_exists(id)", // Ensures idempotency, as explained in https://cloudonaut.io/your-lambda-function-might-execute-twice-deal-with-it/
      Item: { id, sellerId: order.sellerId, ...order },
    })
    .promise();

  return {
    statusCode: 201,
  };
};
