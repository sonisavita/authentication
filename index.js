const express = require("express");
const JWT_SECRET = "randomsavitaillgoto"
const jwt = require('jsonwebtoken');
const app = express();
app.use(express.json());

const users = [];

function logger(req, res, next) {
    console.log(req.method + " request came");
    next();
}

app.post("/signup", logger, function(req,res){
    const username = req.body.username
    const password = req.body.password

    users.push({
        username: username,
        password: password
    })

    res.json({
        message: "You are signed up"
    })

    console.log(users)

});

app.post("/signin", logger, function(req, res){ 

    const username = req.body.username;
    const password = req.body.password;

    //map and filter code concept check notion doc
    let foundUser = null;

    for(let i = 0; i <users.length; i++){
           if(users[i].username === username && users[i].password === password){
                foundUser = users[i]
           } 
    }

    if(!foundUser) {
        res.json({
            message: "Credentials incorrect"
        })
        return
    } else  {
        const token = jwt.sign({
            username: "raman"
        }, JWT_SECRET); // convert their username over to a jwt
        res.header("jwt",token);

        res.header("random","savita");

        //foundUser.token = token;
        res.json({
            token: token
        })
    }
    console.log(users)
})

function auth(req, res, next){
    const token = req.headers.token;
    const decodedData = jwt.verify(token, JWT_SECRET);
    if(decodedData.username) {
        req.username = decodedData.username;
        next()
    } else {
        res.json({
            message: "You are not logged in"
        })
    }
}

app.get("/me", logger, auth, function(req,res) {

    let foundUser = null;

    for(let i = 0;  i < users.length; i++) {
        if(users[i].username === req.username) {
            foundUser = users[i]
        }
    }

    res.json({
        username: foundUser.username,
        password: foundUser.password
    })

    
})

app.listen(3000); // http server is listening on port 3000

// use this cmd to get rid of port in used error 
//kill -9 $(lsof -ti:3000) || true
//node index.js