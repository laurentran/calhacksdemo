# Serverless demo with Azure Functions and Cognitive Services 

This Azure function has an [HTTP input trigger](https://docs.microsoft.com/en-us/azure/azure-functions/functions-bindings-http-webhook), where it takes an image URL as input, makes a call to the Computer Vision Cognitive Services API, and sends back the caption as a response to the HTTP call.

Here is an example of the request body for this function:

```
{
  "imageURL": "url.jpg"
}
```
