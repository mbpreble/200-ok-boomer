# 200-ok-boomer
Middleware to convert "200 OK" into "200 OK Boomer"

This project shouldn't be taken seriously or in any way as a political statement.
It *only* provides a single function okBoomer which has the signature of Express Middleware 
`function okBoomer(req, res, next)`

THE *only* thing this middleware function does is overwrite the `statusMessage` property of the current response with `OK Boomer`, and only if the response's `statusCode` property is currently 200.

In order to work properly this middleware should be registered before request handlers or anything else which can transmit headers to clients since it replaces `res.send` at the time it is invoked as middleware.

# Usage
In the case of an Express app, simply require `200-ok-boomer` and apply as middleware
e.g. 
```
const express = require('express');
const okBoomer = require('200-ok-boomer');
const app = express();

app.use(okBoomer);
```