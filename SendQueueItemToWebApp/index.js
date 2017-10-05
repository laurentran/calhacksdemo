var request = require('request');

module.exports = function (context, myQueueItem) {
    context.log('JavaScript queue trigger function processed work item', myQueueItem);

    var requestBody = JSON.stringify(myQueueItem);
    requestBody = '[' + requestBody + ']';
    context.log(requestBody);
    var params = {
        url: process.env.URL,
        method: 'POST',
        headers: {
            'content-type': 'application/json',
        },
        body: requestBody,
    };

    request(params, function(error, response, body) {
        if(!error) {
            context.log("success!")
            context.log(response.statusCode);
            context.done();
        } else {
            context.log(error);
            context.done();
        }
    });
};