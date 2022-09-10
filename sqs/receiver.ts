import { SQSHandler } from "aws-lambda";
import { addFlight } from "../addFlight";
import { IFlight } from "../interfaces";

const receiver: SQSHandler = async (event) => {
  try {
    for (const record of event.Records) {
      const flight: IFlight = JSON.parse(record.body);
      await addFlight(flight);
    }
  } catch (error) {
    console.log(error);
  }
};

export default receiver;
