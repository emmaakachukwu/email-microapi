const express = require("express");
const sendMail = require("./mail");
const log = console.log;
const app = express();
const path = require("path");

const PORT = 8080;

app.use(express.urlencoded({
  extended: false
}));
app.use(express.json());


app.post("/email", function(req, res){
  const { subject, email, text  } = req.body;
  console.log("Data: ", req.body);
  sendMail(email, subject, text, function(err, data){
    if (err){
      res.status(500).json({ message: "internal error"});
    }else {
      res.json({ message: "email sent"});
    }
  });
  
});

app.get("/", function(req, res){
  res.sendFile(path.join(__dirname, "views", "index.html"))
});

app.listen(PORT, function(){
  log("Server is starting on PORT, ", 8080);
});