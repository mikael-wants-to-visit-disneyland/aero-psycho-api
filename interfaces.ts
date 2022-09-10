import * as yup from "yup";
import moment from "moment";

export interface IFlight {
  flightCode: string;
  date: string;
  estimatedDepartureTime: string;
  estimatedArrivalTime: string;
  originAirportCode: string;
  destinationAirportCode: string;
  mood: number;
  tiredness: number;
  love: number;
}

const dateTest = (date) => moment(date, "YYYY-MM-DD", true).isValid();
const timeTest = (time) => moment(time, "HH:mm:ss", true).isValid();

export const flightSchema = yup.object().shape({
  flightCode: yup.string().required(),
  originAirportCode: yup.string().required(),
  destinationAirportCode: yup.string().required(),
  date: yup
    .string()
    .test(
      "date-format",
      "date is not in the format YYYY-MM-DD, as required for DynamoDB filtering.",
      dateTest
    )
    .required(),
  estimatedDepartureTime: yup
    .string()
    .test(
      "time-format",
      "estimated departure time is not in the format HH:MM:SS",
      timeTest
    )
    .required(),
  estimatedArrivalTime: yup
    .string()
    .test(
      "time-format",
      "estimated arrival time is not in the format HH:MM:SS",
      timeTest
    )
    .required(),
  mood: yup.number().required(),
  tiredness: yup.number().required(),
  love: yup.number().required(),
});
