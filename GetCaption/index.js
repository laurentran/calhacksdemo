request = require('request')

module.exports = function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    if (req.query.name || (req.body && req.body.name)) {
        var url = req.body.name;
        requestBody = JSON.stringify({"url":url})
        request.post({
            headers: {'content-type':'application/json', 'Ocp-Apim-Subscription-Key':process.env.APIKEY},
            url: 'https://westcentralus.api.cognitive.microsoft.com/vision/v1.0/describe',
            body: requestBody,
        }, function(error, response, body){
            if(error) {
                context.log(error);
            } else {
                var result = JSON.parse(body).description.captions[0].text;
                context.log(result);
                context.res = {
                // status: 200, /* Defaults to 200 */
                    body: result
                };
            }
        });

    }
    else {
        context.res = {
            status: 400,
            body: "Please pass an imageURL on the query string or in the request body"
        };
    }
    context.done();
};