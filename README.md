# Webhook Handler

A handler for enabling e-commerce platforms to send orders to our platform. This is a serverless solution, with Lambda as the processor, SNS as the queue engine, and DynamoDB as the storage layer.

## Usage

### Initializing

Use `serverless deploy` to get started. Upon success, the urls of the POST and the GET will be printed out. Use them in the following requests.

### Adding orders

Use POST to add orders. You can test it like this, with `{ url }` replaced by the actual url:

```
curl --request POST '{ url }/dev/sender' \
     --header 'Content-Type: application/json' \
     --data-raw '{
  "orderId": "5903",
  "dateCreated": "2022-01-09",
  "sellerId": "booboo",
  "address": {
    "line1": "Flat 4D, Norfolk Mansions",
    "line2": "Lithos Road",
    "city": "London",
    "state": "England",
    "postcode": "NW8 6DU",
    "country": "UK"
  },
  "items": [
    {
      "product": "0-3jknjd03",
      "description": "best console",
      "name": "Nintendo Switch",
      "unitPrice": "245",
      "qty": "3",
      "totalPrice": "800"
    }
  ]
}'
```

Note that all of these fields are required; they cannot be the empty string.

### Viewing orders

Get all orders for a seller:

```
curl --url '{ url }?sellerId=booboo'
```

Get an order by the `sellerId` and `orderId`:

```
curl --url '{ url }?sellerId=booboo&orderId=5903'
```

Get all orders between certain dates:

```
curl --url '{ url }?startDate=2022-02-01&endDate=2022-09-23'
```

You can use any combination of these parameters.

### Adding attributes

In order to enable filtering by more attributes, simply add them to these two places:

1. `AttributeDefinitions` and `GlobalSecondaryIndexes` in `serverless.yml > resources > ordersTable`
2. `queryStringParamsFilterAttributes` in `getOrders`

## Debugging

Do `sls logs -f <func> -t` in another terminal to view the logs for a func as they are received.

## Todo

If you want to contribute, it would be great to get some automated tests using jest, for each of the lambdas, as well as for the extracted units (currently only `addOrder`).
