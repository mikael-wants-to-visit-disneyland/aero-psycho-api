import * as yup from "yup";
import moment from "moment";

export interface IFlight {
  flightCode: string;
  date: string;
  estimatedDepartureTime: string;
  estimatedArrivalTime: string;
  airportCode: string;
  departureAirportCode: string;
  mood: number;
  tiredness: number;
  love: number;
}

export interface IAirport {
  airportCode: string;
  location: string;
  suffix: string;
}

const dateTest = (date) => moment(date, "YYYY-MM-DD", true).isValid();
const timeTest = (time) => moment(time, "HH:mm:ss", true).isValid();

export const airportSchema = yup.object().shape({
  airportCode: yup.string().required(),
  location: yup.string().required(),
  suffix: yup.string().required(),
});

export const flightSchema = yup.object().shape({
  flightCode: yup.string().required(),
  airportCode: yup.string().required(),
  departureAirportCode: yup.string().required(),
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
