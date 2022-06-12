"use strict";
import { DynamoDB } from "aws-sdk";

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
  const dynamoDb = new DynamoDB.DocumentClient();
  console.log("BUU");
  await dynamoDb
    .put({
      TableName: process.env.DYNAMODB_ORDERS_TABLE,
      //ConditionExpression: "attribute_not_exists(id)", // Ensures idempotency, as explained in https://cloudonaut.io/your-lambda-function-might-execute-twice-deal-with-it/
      Item: { id, sellerId: order.sellerId, ...order },
    })
    .promise();

  console.log("DONE");

  return {
    statusCode: 201,
  };
};
