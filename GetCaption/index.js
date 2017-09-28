https = require('https');

module.exports = function (context, req) {
    context.log('***************************** Start Run ****************************')
    
    if (req.query.imageURL || (req.body && req.body.imageURL)) {
        var url = req.body.imageURL;
        postContent(url, context);

    } else {
        context.res = {
            status: 400,
            body: "Please pass an imageURL on the query string or in the request body"
        };
        context.done();
    }
};

// make request to Cognitive Services
const postContent = function(url, context) {

    var postData = JSON.stringify({'url': url});

    var options = {
        hostname: 'westcentralus.api.cognitive.microsoft.com',
        port: 443,
        path: '/vision/v1.0/describe',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key': process.env.API_KEY
        }
    };

    var req = https.request(options, (res) => {
        context.log(`STATUS: ${res.statusCode}`);
        res.setEncoding('utf8');
        
        res.on('data', (chunk) => {
            context.log(`BODY: ${chunk}`);
            var result = JSON.parse(chunk).description.captions[0].text;
            context.log(result);
            context.res = {
                body: result
            };
        });
        
        res.on('end', () => {
            context.log('***************************** End Run ****************************');
            context.done();
            });
        });

        req.on('error', (e) => {
            context.log(`problem with request: ${e.message}`);
            context.log('***************************** End Run ****************************');
            context.done();
        });

    // write data to request body
    req.write(postData);
    req.end();
};

