const express = require("express");
const JWT_SECRET = "randomsavitaillgotousa"
const jwt = require('jsonwebtoken');
const app = express();
app.use(express.json());

const users = [];


app.post("/signup", function(req,res){
    const username = req.body.username;
    const password = req.body.password;

    users.push({
        username: username,
        password: password
    })

    res.json({
        message: "You are signed up"
    })

    console.log(users)

});

app.post("/signin", function(req, res){ 

    const username = req.body.username;
    const password = req.body.password;

    //map and filter code concept check notion doc
    let foundUser = null;

    for(let i = 0; i<users.length; i++){
           if(users[i].username == username && users[i].password == password){
                foundUser = users[i]
           } 
    }

    if (foundUser) {
        const token = jwt.sign({
            username: username
        }, JWT_SECRET); // convert their username over to a jwt

        //foundUser.token = token;
        res.json({
            token: token
        })
    } else {
        res.status(403).send({
            message: "Invalid username or password"
        })
    }
    console.log(users)
    
});

app.get("/me", function(req,res){
    const token = req.headers.token //jwt
    const decodedInformation = jwt.verify(token, JWT_SECRET); // {username: "savita@gmall.com"}
    const username = decodedInformation.username

    let foundUser = null;

    for(let i = 0; i < users.length; i++){
        if(users[i].token == token) {
            foundUser = users[i]
        }
    }

    if (foundUser) {
        res.json({
            username: foundUser.username,
            password: foundUser.password
        })
    } else {
        res.json({
            message: "token invalid"
        })
    }
})

app.listen(3000); // http server is listening on port 3000

// use this cmd to get rid of port in used error 
//kill -9 $(lsof -ti:3000) || true
//node index.js