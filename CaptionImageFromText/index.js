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
        url: 'https://westcentralus.api.cognitive.microsoft.com/vision/v1.0/analyze?visualFeatures=Adult,Description&language=en',
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'Ocp-Apim-Subscription-Key':process.env.API_KEY 
        },
        body: requestBody,
        context: context
    };
    context.log("making request");
    request(params, function(error, response, body) {
        if(!error) {
            context.log(JSON.parse(body));
            var result = JSON.parse(body);
            var isAdult = result.adult.isAdultContent;
            var isRacy = result.adult.isRacyContent;
            var caption = result.description.captions[0].text;
            context.log(caption);

            // write to queue
            if (isAdult || isRacy) {
                outputData['imageURL'] = 'http://www.rockcellarmagazine.com/wp-content/uploads/2014/11/censored.jpg'
                caption = 'NSFW!'
            } 
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