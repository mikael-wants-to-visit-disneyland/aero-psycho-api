# Webhook Handler

A handler for enabling e-commerce platforms to send orders to our platform. This is a serverless solution, with Lambda as the processor, SNS as the queue engine, and DynamoDB as the storage layer.

## Usage

### Inititalizing

Use `serverless deploy` to get started. Upon success, the urls of the POST and tge GET will be printed out. Use them in the following requests.

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

You can use any combination of these three parameters.

### Adding attributes

In order to enable filtering by more attributes, simply add them to these two places:

1. `AttributeDefinitions` and `GlobalSecondaryIndexes` in `serverless.yml > resources > ordersTable`
2. `queryStringParamsFilterAttributes` in `getOrders`

## Todo

- Automated tests using jest, for each of the lambdas, as well as the extracted units (currently only `addOrder`).

- If yup validation results in an error, it seems that for some reason `receiver` keeps on getting invoked forever, as shown by the repeated logging of the same error. Have to make it stop. Alternatively, try switching from yup to JSON Schema Validator.
