# Serverless demo and workshop with Azure Functions and Cognitive Services 

### Demo 1
The **GetCaption** function has an [HTTP input trigger](https://docs.microsoft.com/en-us/azure/azure-functions/functions-bindings-http-webhook), where it takes an image URL as input, makes a call to the Computer Vision Cognitive Services API, and sends back the caption as a response to the HTTP call.

Here is an example of the request body for this function:

```
{
  "imageURL": "url.jpg"
}
```

### Demo 2
**CaptionImageFromText** and **SendQueueItemToWebApp** are both part of a demo app which receives texts from Twilio and displays the MMS images on a webpage with their respective captions.  **CaptionImageFromText** reads in SMS/MMS messages and parses them to grab images from the text (if an image was sent), and uses Cognitive Services to caption the image.  This function also uses Cognitive Services to filter out racy/adult images.  It writes the result to a queue:

```
{
  "imageURL: "url.jpg",
  "phoneNumber": "[last 4 digits]",
  "caption": "[caption from Cog Svcs]"
}
```

**SendQueueItemToWebApp** is a queue-triggered function that grabs items from the queue and then posts to a web page.
