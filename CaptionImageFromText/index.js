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
        context.log("Getting caption");
        context.log(smsData['MediaUrl0']);
        getCaption(context, smsData['MediaUrl0']);
    }

    // respond asking for image
    else {
        context.log("text");
        sendResponse(context, "Send an image");
    }
};

function getCaption(context, imageUrl) {
    var requestBody = JSON.stringify({"url":imageUrl});
    var params = {
        url: 'https://westcentralus.api.cognitive.microsoft.com/vision/v1.0/describe',
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'Ocp-Apim-Subscription-Key': process.env.API_KEY
        },
        body: requestBody,
        context: context
    };
    context.log("making request");
    request(params, function(error, response, body) {
        if(!error) {
            var caption = JSON.parse(body).description.captions[0].text;
            context.log(caption);
            sendResponse(params.context, caption);
        } else {
            context.log("error");
        }
    });
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