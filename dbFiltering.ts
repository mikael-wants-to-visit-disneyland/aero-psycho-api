export const queryStringParamsFilterAttributes: Record<
  string,
  { attribute: string; comparison: string }
> = {
  dataType: { attribute: "dataType", comparison: "=" },
  departureAirportCode: { attribute: "departureAirportCode", comparison: "=" },
  airportCode: {
    attribute: "airportCode",
    comparison: "=",
  },
  flightCode: { attribute: "flightCode", comparison: "=" },
  startDate: { attribute: "date", comparison: ">=" },
  endDate: { attribute: "date", comparison: "<=" },
};

export const dataTypes = { airport: "airport", flight: "flight" };

/* Transform the query string parameters into the DynamoDB filter expression, 
   alongside the expression's key and value input objects. */
export const getFilterExpressionParams: (
  filterParams: Record<string, string>,
  dataType: string
) => {
  FilterExpression: string;
  ExpressionAttributeNames: Record<string, string>;
  ExpressionAttributeValues: Record<string, string>;
} = (filterParams, dataType) => {
  /* Check that every query string parameter corresponds to a filterable field. */
  Object.keys(filterParams).forEach((param) => {
    if (
      !Object.keys(queryStringParamsFilterAttributes).find(
        (field) => field === param
      )
    ) {
      console.error(`Query string parameter ${param} is not valid.`);
    }
  });
  const augmentedParams = {
    ...filterParams,
    dataType: dataType,
  };
  console.log(augmentedParams);
  const FilterExpression = Object.keys(augmentedParams)
    .map(
      (name, i) =>
        `#${i} ${queryStringParamsFilterAttributes[name].comparison} :${i}`
    )
    .join(" AND ");
  const ExpressionAttributeNames = Object.assign(
    {},
    ...Object.keys(augmentedParams).map((name, i) => ({
      [`#${i}`]: queryStringParamsFilterAttributes[name].attribute,
    }))
  );
  const ExpressionAttributeValues = Object.assign(
    {},
    ...Object.values(augmentedParams).map((value, i) => ({
      [`:${i}`]: value,
    }))
  );
  return {
    FilterExpression,
    ExpressionAttributeNames,
    ExpressionAttributeValues,
  };
};
