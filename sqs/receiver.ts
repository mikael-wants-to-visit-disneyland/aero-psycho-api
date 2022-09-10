import { SQSHandler } from "aws-lambda";
import { addAirport } from "../addAirport";
import { addFlight } from "../addFlight";
import { dataTypes } from "../dbFiltering";
import { IAirport, IFlight } from "../interfaces";

const receiver: SQSHandler = async (event) => {
  try {
    for (const record of event.Records) {
      if (JSON.parse(record.body).dataType === dataTypes.flight) {
        const flight: IFlight = JSON.parse(record.body);
        await addFlight(flight);
      } else if (JSON.parse(record.body).dataType === dataTypes.airport) {
        const airport: IAirport = JSON.parse(record.body);
        await addAirport(airport);
      }
    }
  } catch (error) {
    console.log(error);
  }
};

export default receiver;
