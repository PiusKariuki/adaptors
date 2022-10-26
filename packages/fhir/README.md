# language-fhir [<img src="https://avatars2.githubusercontent.com/u/9555108?s=200&v=4)" alt="alt text" height="20">](https://www.openfn.org) [![Build Status](https://travis-ci.org/OpenFn/language-fhir.svg?branch=master)](https://travis-ci.org/OpenFn/language-fhir)

An OpenFn **_adaptor_** for building integration jobs for use with the HAPI FHIR
API.

## FHIR Documentation

The Restfull API can be seen here: https://www.hl7.org/fhir/http.html

## Documentation

- View the documentation at https://openfn.github.io/adaptor/
- To update the documentation site, run:
  `./node_modules/.bin/jsdoc --readme ./README.md ./lib -d docs`

## Technical Documentation

#### Sample configuration

> See [credential schema ](./credential-schema.json)

```json
{
  "resource": "resource_url",
  "authType": "Basic",
  "token": "supersecrettoken"
}
```

#### Creates a resource in a destination system using a POST request

```js
create('/endpoint', { foo: 'bar' });
```

#### Creates a transactionBundle for HAPI FHIR

```js
createTransactionBundle({
  entry: [transactionBundle],
});
```

## Development

Clone the [adaptors monorepo](https://github.com/OpenFn/adaptors). Follow the
`Getting Started` guide inside to get set up.

Run tests using `pnpm run test` or `pnpm run test:watch`

Build the project using `pnpm build`.

To just build the docs run `pnpm build docs`