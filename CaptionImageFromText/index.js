var twilio = require('twilio');
var request = require('request');
var MessagingResponse = require('twilio').twiml.MessagingResponse;

module.exports = function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    // parse post body and store key value pairs in smsData
    var smsData = {};
    req.body.split("&").forEach(function(part) {
        var item = part.split("=");
        smsData[item[0]] = decodeURIComponent(item[1]);
    });


    // check if incoming text has an image
    if(smsData.hasOwnProperty('MediaUrl0')) {
        var outputData = {};
        outputData['imageURL'] = smsData['MediaUrl0'];
        outputData['phoneNumber'] = smsData['From'].substring(8,12);

        context.log("Getting caption");
        context.log(smsData['MediaUrl0']);
        getCaption(context, smsData['MediaUrl0'], outputData);
        //context.done();
    }

    // respond asking for image
    else {
        context.log("text");
        sendResponse(context, "Send an image");
    }
};

function getCaption(context, imageUrl, outputData) {
    var requestBody = JSON.stringify({"url":imageUrl});
    var params = {
        url: 'https://westcentralus.api.cognitive.microsoft.com/vision/v1.0/describe',
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'Ocp-Apim-Subscription-Key':'5c752cdeac9d4a3cbbce41504780fb8a' 
        },
        body: requestBody,
        context: context
    };
    context.log("making request");
    request(params, function(error, response, body) {
        if(!error) {
            context.log(JSON.parse(body));
            var caption = JSON.parse(body).description.captions[0].text;
            context.log(caption);

            // write to queue
            outputData['caption'] = caption;
            writeToQueue(params.context, outputData);
            //params.context.bindings.outputQueueItem = outputData;

            // send sms 
            sendResponse(params.context, caption);
        } else {
            context.log("error");
        }
    });
    //context.done();
}

function sendResponse(context, smsResponse) {
    // set up response message
    context.log("sending response");
    const twiml = new MessagingResponse();
    const message = twiml.message();
    message.body(smsResponse);
    context.res = {
        status: 200,
        body: twiml.toString(),
        headers: {
            'Content-Type': 'text/xml'
        },
        isRaw: true
    };
    context.done()
}

function writeToQueue(context, queueItem) {
    context.log("writing to queue");
    context.bindings.outputQueueItem = queueItem;
    context.log("done");
}