const express = require('express');
const bodyParser = require('body-parser');
const mailChimp = require('@mailchimp/mailchimp_marketing');


const app = express();                     //initialising express

app.use(express.static("public"));        // for using static files such as images and stylesheet in the server

app.use(bodyParser.urlencoded({extended:true}));

app.get("/", (req,res) => res.sendFile(__dirname+"/signup.html"));     //handling GET request

app.post("/", (req, res) => {                                           //handling POST request
    const fName = req.body.fname;
    const lName = req.body.lname;
    const email = req.body.email;

  const userData = {                                    // the data to be passed should be a JSON
    members : [{
        email_address: email,
        status: "subscribed",
        merge_fields : {
            FNAME : fName,
            LNAME : lName
        }
    }]
  };

  const jsonData = JSON.stringify(userData);

  mailChimp.setConfig({
    apiKey: "e553b14c4457c69d88b8ec5b1072d7cc-us2",
    server: "us2",
  });
  
  const run = async () => {
    const response = await mailChimp.lists.batchListMembers("a74f1c4cbd", jsonData);
    if(response.error_count == 0){
        res.sendFile(__dirname+ "/success.html")
    }else{
        res.sendFile(__dirname+ "/failure.html")
    }
  };
  
  run();
  

});

app.post("/failure", (req,res) => res.redirect("/")); // When failure route get a post request it is redirected to home page


app.listen(process.env.PORT || 3000, () => console.log("Listening ")); // Will listen in heroku as well as local system.

//API key
//e553b14c4457c69d88b8ec5b1072d7cc-us2

//List id
//a74f1c4cbd