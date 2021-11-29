const crypto = require("crypto");

//the secret must be stored in an env variable in the finished app
const secret = process.env.SECRET || "stue"


let utils = {};

//--------------------------
utils.decodeCred = function(credString){
    let cred = {};

	let b64String = credString.replace("basic", ""); // 
	let asciiString = Buffer.from(b64String, "base64").toString("ascii"); // 'anita:appeksamen'	
	cred.username = asciiString.replace(/:.*/, ""); //anita	
	cred.password = asciiString.replace(cred.username + ":", ""); //appeksamen

	return cred;

}

//--------------------------
utils.createHash = function(password){
    console.log(secret)

    let hash = {};
    //let hash = createHash("appeksamen");
    console.log(hash);

    hash.salt = Math.random().toString();
    hash.value = crypto.scryptSync(password, hash.salt, 64).toString("hex");
    console.log(hash);

    return hash;

}

//---------------------------
utils.createToken = function(username, userID) {
    //part 1 and 2 as JSON-text
    let part1 = JSON.stringify({"alg": "HS256", "typ": "JWT"});
    let part2 = JSON.stringify({"user": username, "userId": userID, "iat": Date.now()});
    
    //part 1 and 2 as base64
    let b64Part1 = Buffer.from(part1).toString("base64");
    let b64Part2 = Buffer.from(part2).toString("base64");

    //part 1 and 2 combined seperated with . (period)
    let openPart = b64Part1 + "." + b64Part2;

    //create the 3. part (signature) using a hash-function in the crypto-module
    let secret = "appeksamen"; //must be stored in an env variable in the finished app
    let sign = crypto.createHmac("SHA256", secret).update(openPart).digest("base64");

    return openPart + "." + sign;

}

//---------------------------
utils.verifyToken = function(token){
    //let token = createToken("anita");

    //using the string-method split to extract the three parts into an array
    let tokenArr = token.split(".");
    let openPart = tokenArr[0] + "." + tokenArr[1];
    let checkSignature = tokenArr[2];

    let secret = "appeksamen";
    let sign = crypto.createHmac("SHA256", secret).update(openPart).digest("base64");

    if (checkSignature != sign){
        //signature not ok
        return false;
    }
    let payloadTxt = Buffer.from(tokenArr[1], "base64").toString("ascii");
    let payload = JSON.parse(payloadTxt);

    let expireTime = payload.iat + 24 * 60 * 60 * 1000; //time in millisec.
    if (expireTime < Date.now()){
        return false;
    }
        //token ok
        return payload;
}

//-----------------------------
 utils.verifyPassword = function(passwordFromUser, hashFromDB, saltFromDB) {
    hash = crypto.scryptSync(passwordFromUser, saltFromDB, 64).toString("hex");

    if (hash == hashFromDB) {
        return true;
    }
    return false;
}

//-----------------------------
module.exports = utils;
