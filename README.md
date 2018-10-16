# GOB Management Frontend

A frontend on the GOB Management API.

Written in Vue.js

## Requirements

- npm >=5
- node >= 8

## Configuration

The configuration variables are stored in .env* files in the root directory of the project.

- VUE_APP_API: The address of the GOB Management API

## Dependencies

The [GOB Management API](https://github.com/Amsterdam/GOB-Management) should be up.

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Run your unit tests

Tests have been made for all services with a coverage of 100%.

All component logic is implemented by means of services.
Because components do not contain any logic they are not tested. 

```
npm run test:unit
```
