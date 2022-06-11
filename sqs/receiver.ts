import { SQSHandler } from "aws-lambda";
import { addOrder, IOrder } from "../addOrder";

const receiver: SQSHandler = async (event) => {
  try {
    for (const record of event.Records) {
      const order: IOrder = JSON.parse(
        Buffer.from(record.body, "base64").toString()
      );
      addOrder(order, record.messageId);
    }
  } catch (error) {
    console.log(error);
  }
};

export default receiver;
