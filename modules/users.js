const express = require('express');
const db = require("./databaseHandler.js");
const authUtils = require("./auth_utils.js");
const router = express.Router();

//endpoints ------------------------------------

//user login -----------------------------------
router.post("/users/login", async function(req, res, next) {
    
    
   try{ 
    let credString = req.headers.authrization;

    
    let cred = authUtils.decodeCred(credString);

    
    let data = await (await db.getUser(cred.username)).rows[0]
    
    let correctPassword = authUtils.verifyPassword(cred.password, data.password, data.salt)
    
    let token;
    if(correctPassword){
        user = await (await db.verifyUser(data.username, data.password)).rows[0];
        token = authUtils.createToken(user.username, user.id)
    }
    console.log(user.id)
    res.status(200).json({token: token}).end();
}catch(err){
    console.log(err)
}
});

//list all users -------------------------------
router.get("/users", async function(req, res, next) {
    res.status(200).send("GET - /users = OK").end();
});

//create a new user ----------------------------
router.post("/users", async function(req, res, next) {
    let credString = req.headers.authorization;
    let cred = authUtils.decodeCred(credString);

    if (cred.username == "" || cred.password == "") {
        res.status(401).json({error: "No username or password"}).end();
        return;
    }
    
    let hash = authUtils.createHash(cred.password);

    try {
        let data = await db.createUser(cred.username, hash.value, hash.salt);

        if (data.rows.length > 0) {
            res.status(200).json({msg: "The user was created successfully"}).end();
        }
        else {
            throw "The user couldn`t be created";
        }
    }
   catch(err) {
       next(err);
   }
});

//delete a user ---------------------------------
router.delete("/users", async function(req, res, next) {
    res.status(200).send("Delete OK").end();
});

// ----------------------------------------------

module.exports = router;
