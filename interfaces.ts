import * as yup from "yup";
import moment from "moment";

export interface IFlight {
  flightCode: string;
  date: string;
  originAirportId: string;
  destinationAirportId: string;
}

export const flightSchema = yup.object().shape({
  flightCode: yup.string().required(),
  date: yup
    .string()
    .test(
      "date-format",
      "date is not in the format YYYY-MM-DD, as required for DynamoDB filtering.",
      (date) => moment(date, "YYYY-MM-DD", true).isValid()
    )
    .required(),
  originAirportId: yup.string().required(),
  destinationAirportId: yup.string().required(),
});
