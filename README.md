# Webhook Handler

A handler for enabling e-commerce platforms to send flights to our platform. This is a serverless solution, with Lambda as the processor, SQS as the queue engine, and DynamoDB as the storage layer.

## Usage

### Initializing

Use `serverless deploy` to get started. Upon success, the urls of the POST and the GET will be printed out. Use them in the following requests.

### Adding flights

Use POST to add flights. You can test it like this, with `{ url }` replaced by the actual url:

```
curl --request POST '{ url }/dev/sender' \
     --header 'Content-Type: application/json' \
     --data-raw '{
  "flightCode": "5903",
  "date": "2022-01-09",
  "originAirportCode": "0"
}'
```

Note that all of these fields are required; they cannot be the empty string.

### Viewing flights

Get all flights for a seller:

```
curl --url '{ url }?originAirportCode=booboo'
```

Get an flight by the `originAirportCode` and `flightCode`:

```
curl --url '{ url }?originAirportCode=booboo&flightCode=5903'
```

Get all flights between certain dates:

```
curl --url '{ url }?startDate=2022-02-01&endDate=2022-09-23'
```

You can use any combination of these parameters.

### Adding attributes

In order to enable filtering by more attributes, simply add them to these two places:

1. `AttributeDefinitions` and `GlobalSecondaryIndexes` in `serverless.yml > resources > flightsTable`
2. `queryStringParamsFilterAttributes` in `getFlights`

## Debugging

Do `sls logs -f <func> -t` in another terminal to view the logs for a func as they are received.

## Todo

If you want to contribute, it would be great to get some automated tests using jest, for each of the lambdas, as well as for the extracted units (currently only `addFlight`).
