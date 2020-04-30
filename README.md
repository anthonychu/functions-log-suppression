# Azure Functions - suppressing logs

Logging from Azure Functions Core Tools and Host can be quite verbose. Documenting different ways to suppress the logs here.

Some logs from the Azure Functions Job Host can be disabled in **host.json**, while others cannot.

All log settings can be configured with app settings. In the below examples, anything prefixed with `AzureFunctionsJobHost` can also be placed in host.json like this:

```json
{
  "version": "2.0",
  "logging": {
    "logLevel": {
      "default": "Information"
    }
  }
}
```

Theoretically they can be configured with environment variables too, but unfortunately `.` are not valid bash variable names (`:` can be substituted with `__`).

## Individual settings

Logs can be controlled if you know their category. The easiest way to figure out the category is to hook up app insights by adding `APPINSIGHTS_INSTRUMENTATIONKEY` to your app settings query the logs in the Azure portal.

### Function executing/executed

Example:

```
Executing 'Functions.HttpTrigger1' ...
Executed 'Functions.HttpTrigger1' (Succeeded ...)
```

Category: `Function.<function_name>`

To suppress in local.settings.json:

```
"AzureFunctionsJobHost:logging:logLevel:Function.HttpTrigger1": "None"
```

> Note that this also suppresses logs in subcategories. This includes user-initiated logs that were output in code using the default logger. See below for how to suppress these host generated logs but keep the user generated ones.

### Worker

Example:

```
Starting worker process:node  "/usr/local/Cellar/azure-functions-core-tools@3/3.0.2245/workers/node/dist/src/nodejsWorker.js" --host 127.0.0.1 --port 54329 --workerId bfccdde1-f215-4d73-9fa8-48dac1a4f0c0 --requestId 07d02f60-6f0d-4eca-a4df-52dae88e9d6a --grpcMaxMessageLength 134217728
node process with Id=93359 started
orker bfccdde1-f215-4d73-9fa8-48dac1a4f0c0 connecting on 127.0.0.1:54329
```

Category: `Worker.rpcWorkerProcess`, `Worker` (everything worker-related)

To suppress in local.settings.json:

```
"logging:logLevel:Worker.rpcWorkerProcess": "None"

// or suppress all subcategories
"logging:logLevel:Worker": "None"
```

### Host middleware and miscellaneous logs

Example:

```
Executed HTTP request: {
  "requestId": "e5944e46-62fa-4f9e-9a43-52352126f30c",
  "method": "GET",
  "uri": "/api/HttpTrigger2",
  "identities": [
    {
      "type": "WebJobsAuthLevel",
      "level": "Admin"
    }
  ],
  "status": 200,
  "duration": 780
}
```

Category: `Microsoft.Azure.WebJobs.Script.WebHost.Middleware.SystemTraceMiddleware`

To suppress in local.settings.json:

```
"logging:logLevel:Microsoft.Azure.WebJobs.Script.WebHost.Middleware.SystemTraceMiddleware": "None"

// Or just suppress all subcategories
"logging:logLevel:Microsoft": "None"
```

### All logs that are controllable in host.json

To control everything that can be controlled by host.json, use `default`.

To suppress in local.settings.json:

```
"AzureFunctionsJobHost:logging:logLevel:default": "None"
```

### STDOUT from function (e.g. console.log)

Example code:

```js
console.log("HttpTrigger1 console.log message");
```

Category: `Host.Function.Console`

To control in local.settings.json:

```
"AzureFunctionsJobHost:logging:logLevel:Host.Function.Console": "Information"
```

### Per function user-initiated logs

Example code:

```js
context.log('HttpTrigger1 context.log information');
context.log.error('HttpTrigger1 context.log error');
```

Category: `Function.<function_name>.User`

To control in local.settings.json:

```
"AzureFunctionsJobHost:logging:logLevel:Function.HttpTrigger1.User": "Information",
"AzureFunctionsJobHost:logging:logLevel:Function.HttpTrigger2.User": "Information"
```

## Common settings

### Disable all except user-initiated logs

Each function must be listed explicitly.

#### local.settings.json values

```json
{
    "logging:logLevel:Microsoft": "None",
    "logging:logLevel:Worker": "None",
    "AzureFunctionsJobHost:logging:logLevel:default": "None",
    "AzureFunctionsJobHost:logging:logLevel:Host.Function.Console": "Information",
    "AzureFunctionsJobHost:logging:logLevel:Function.HttpTrigger1.User": "Information",
    "AzureFunctionsJobHost:logging:logLevel:Function.HttpTrigger2.User": "Information"
}