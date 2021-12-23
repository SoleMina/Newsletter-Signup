const express = require("express");
const app = express();
const https = require("https");

const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));

//Al poner esto fija la ruta para todos, así que las imágenes y files usan esa
//Poner las imágenes y los css adentro de folder public
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res) => {
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstname,
          LNAME: lastname
        }
      }
    ]
  };

  const jsonData = JSON.stringify(data);

  const url = "https://us10.api.mailchimp.com/3.0/lists/3ea4120d6f";

  const options = {
    method: "POST",
    auth: "karina1:2fad303e3a2c3f7674d93e34e9ec2b02-us10"
  };

  const request = https.request(url, options, (response) => {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", (data) => {
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();
});

app.listen(PORT, () => {
  console.log("Server is running on port: " + PORT);
});

//API Key
//2fad303e3a2c3f7674d93e34e9ec2b02-us10

//List id
//3ea4120d6f
