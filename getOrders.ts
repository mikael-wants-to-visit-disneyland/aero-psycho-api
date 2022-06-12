"use strict";
import { DynamoDB } from "aws-sdk";

module.exports.getOrders = async (event) => {
  console.log(event);
  const scanParams = {
    TableName: process.env.DYNAMODB_ORDERS_TABLE,
  };

  const dynamoDB = new DynamoDB.DocumentClient();
  const result = await dynamoDB.scan(scanParams).promise();

  if (result.Count === 0) {
    return {
      statusCode: 404,
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(result),
    headers: { "Content-Type": "application/json" },
    //   items: await result.Items.map((customer) => {
    //     return {
    //       name: customer.primary_key,
    //       email: customer.email,
    //     };
    //   }),
  };
};
