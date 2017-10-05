# Azure Functions Hands-on-Lab

## Part 1: Create your Azure Function App

1. Navigate to http://functions.azure.com, and click the green **“Try it Free”** button.

2. We’ll create an HTTP triggered function with JavaScript.  On the screen below, select **Webhook + API** for the scenario, and choose **JavaScript** for the language.  Click **“Create this Function”**

<kbd><img src="https://i.imgur.com/r9J2xcx.png" width="800"></kbd>

3. You’ll see your new function and the function editor window shown below.  You can view your files by clicking View files on the right pane.  

<kbd><img src="https://i.imgur.com/4yEarCi.png" width="800"></kbd>

4. Let's test the sample function code under the **Test** tab on the right pane. In the **Request body**, change **"Azure""** to your name. 

<kbd><img src="https://i.imgur.com/kapQ630.png" width="800"></kbd>

5. Hit the **"Run""** button at the bottom of the screen. In the **Output** window, you'll see the response. 

<kbd><img src="https://i.imgur.com/6T8Ghss.png" width="800"></kbd>

## Part 2: Get a Cognitive Services Computer Vision API Key

6. Navigate to [https://azure.microsoft.com/en-us/try/cognitive-services/](https://azure.microsoft.com/en-us/try/cognitive-services/)

7. Next to **Computer Vision API**, click the **"Get API Key** button. Agree to the terms, click **Next**, and then log in with your account of choice. 

<kbd><img src="https://i.imgur.com/cLHrCva.png" width="800"></kbd>

8. Cognitive Services will provide you an endpoint and an API key. Note *both of these items* to use in your Azure Function

<kbd><img src="https://i.imgur.com/yJxcmam.png" width="800"></kbd>


## Part 3: Build you Azure Function to Call Cognitive Services

9. Navigate to [https://github.com/laurentran/calhacksdemo/blob/master/GetCaption/index.js](https://github.com/laurentran/calhacksdemo/blob/master/GetCaption/index.js), and replace your function code (index.js) with the provided sample code. 

10. One line 25, if the **hostname** of your provided Cognitive Service Computer Vision API is different than the sample, update it. The **hostname** should be: `{location}.api.cognitive.microsoft.com`. 

11. On line 31, notice that the API key is stored as an environment variable: `process.env.API_KEY`. In the free version of Azure Function, we don't have access to storing environment variables, so we'll hard code in the API key. 

12. Substitute `process.env.API_KEY` with your API key. Be sure to use quotes around your string. (When you create an Azure account, you'll be able to create environment variables in the **Application Settings**). 

13. We're ready to test! In the right pane in the **Test** console, subsitute the **Request Body** with a request in the following format: 

```json
{
    "imageURL" : "url.jpg"
}
```

14. Find an image on Bing or Google, and provide the URL for the image. For example: 

```json
{
    "imageURL": "http://cdn3-www.dogtime.com/assets/uploads/gallery/30-impossibly-cute-puppies/impossibly-cute-puppy-21.jpg"
} 
```

15. Click **Run**, and you should see the caption in the **Output** window from Cognitive Services! 

<kbd><img src="https://i.imgur.com/0inaMA2.png" width="800"></kbd>

16. (Optional): To Test your Azure function outside of the provided testing console (i.e. using Postman or Curl), you can grab the function URL by clicking on **</> Get function URL**

<kbd><img src="https://i.imgur.com/YPt4z7B.png" width="800"></kbd>

Hooray! 