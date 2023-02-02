//require the respecting modules to use
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require("https");

//init the express app
const app = express();

//use the body-parser in the app
app.use(bodyParser.urlencoded({extended: true}));


//for serve static files from the server to the client by specifying a static folder 
app.use(express.static("public"));



//respond a request to the root page of the server from a client
app.get("/", function(req, res) {
    //by sending the signup.html file as a respond
    res.sendFile(__dirname + "/signup.html");
});

//respond to a post made from a client in the root page of the server
app.post("/", function(req, res) {
    //saving values from fields in the post request by using bodyParser
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;

    //creating the body data of the member that we're going to send to mailchimp
    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName 
                }
            }
        ]
    };

    //parsing the data to package it 
    var jsonData = JSON.stringify(data);

    //defining the url to make the request
    const url = "https://us17.api.mailchimp.com/3.0/lists/4b0d22bc9a"

    //defining the object of options
    const option = {
        method: "POST",
        auth: "jesus1:8e988ec870e91ec984a6199b0e48b9f7-us17"

    }

    //in order to send the data to mailchimp
    const request = https.request(url, option, function(response) {

        //Show status code from the request made to the server mailchimp
        console.log(response.statusCode);


        response.on("data", function(data) {
            console.log(JSON.parse(data));

            //check if the status code is 200 
            if (response.statusCode === 200) {
                //write back a message to the user that the process was OK

                res.sendFile(__dirname + "/success.html");
            } else {
                //either way then send a message of the process failed
                res.sendFile(__dirname + "/failure.html");
            }

        });



    });

    //we do a write with the jsonData to the mailchimp server
    request.write(jsonData);
    //specify that we end with the request
    request.end();
    
    //testing that values were sended to the server
    //console.log("Your name is: " + firstName + " " + lastName + " and your email: " + email);

});


//respond to try again whenever the post fails
app.post("/failure", function(req, res) {
    //redirect the client to the home 
    res.redirect("/");
});


//listen at picked port
app.listen(process.env.PORT || 3000, function() {
    console.log("Server is running on port 3000");
});

// API KEY: 8e988ec870e91ec984a6199b0e48b9f7-us17
// list ID or Audience ID 4b0d22bc9a