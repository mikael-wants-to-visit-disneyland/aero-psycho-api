import * as yup from "yup";
import moment from "moment";

export interface IFlight {
  flightId: string;
  date: string;
  airportId: string;
}

export const flightSchema = yup.object().shape({
  flightId: yup.string().required(),
  date: yup
    .string()
    .test(
      "date-format",
      "date is not in the format YYYY-MM-DD, as required for DynamoDB filtering.",
      (date) => moment(date, "YYYY-MM-DD", true).isValid()
    )
    .required(),
  airportId: yup.string().required(),
});
