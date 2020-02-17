![npm](https://img.shields.io/npm/v/200-ok-boomer)
![Codecov](https://img.shields.io/codecov/c/github/mbpreble/200-ok-boomer)

# 200-ok-boomer
Middleware to convert "200 OK" into "200 OK Boomer"

This project shouldn't be taken seriously or in any way as a political statement.
It *only* provides a single function okBoomer which has the signature of Express Middleware 
`function okBoomer(req, res, next)`

This middleware overwrites the `send` method of the request to transmit a `statusMessage` of "OK Boomer" along
as long as `statusCode` is 200. That's it, that's all it does.

In order to work properly this middleware should be registered before request handlers or anything else which can transmit headers to clients since it replaces `res.send` at the time it is invoked as middleware.

# Usage
In the case of an Express app, simply require `200-ok-boomer` and apply as middleware
e.g. 
```
const express = require('express');
const okBoomer = require('200-ok-boomer');

const app = express();
app.use(okBoomer());
app.get('/', (req, res) => res.sendStatus(200));
server = app.listen(5000);
```

```
$curl -I localhost:5000
HTTP/1.1 200 OK Boomer
```

# Telemetry
As of version 2.0.0, 200-ok-boomer will by default emit simple metrics (a count of 200 OK Boomer responses).
This will be done by periodically (once per minute) calling a metrics endpoint with an aggregated count.

If this behavior is undesirable, please pass a configuration object specifying "collectMetrics" to be false:
```
app.use(okBoomer()); // Will collect and transmit metrics
app.use(okBoomer({collectMetrics: false})); // Will NOT collect and transmit metrics
```