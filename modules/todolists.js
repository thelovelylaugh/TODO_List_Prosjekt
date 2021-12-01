const express = require('express');
const db = require('./databaseHandler.js');
const authUtils = require("./auth_utils.js");
const router = express.Router();

// endpoints ----------------------------
router.post("/user/", async function(req, res, next) {
	
	let token = req.body.token;
	let valid = authUtils.verifyToken(token);
	console.log("token: " + token + " valid: " + Object.keys( valid))
	let userid = valid.userId;
	console.log(userid)

	let sql= "SELECT * FROM todo";

	
	try{
	//let result = await pool.query(sql);
	let data = await db.getUserLists(userid);
	console.log(data.rows)
	res.status(200).json(data.rows).end();
	}
	catch(err){
		//res.status(500).json({error: err}).end();
		next(err);
	}
});

router.get("/todo", async function(req, res, next) {

	let sql= "SELECT * FROM todo";
	
	try{
	//let result = await pool.query(sql);
	let data = await db.getAllTodoLists();
	res.status(200).json(data.rows).end();
	}
	catch(err){
		//res.status(500).json({error: err}).end();
		next(err);
	}
});

router.post("/todoGetItems", async function(req, res, next){
	let updata = req.body;


	try{
		let data = await db.getListItems(updata.id);
		console.log(data)
		res.status(200).json(data.rows).end();
	}catch(err){
		next(err)
	}
})

router.post("/todo", async function(req, res, next) {	
	let updata = req.body;
	let token = updata.token;
	console.log("token: "+token)
	let valid = authUtils.verifyToken(token)
	console.log("valid: "+Object.keys(valid))
	let userid = valid.userId;

	

	try{
		//let result = await pool.query(sql, values);

		console.log(updata.listItems, updata.listName)
		let data = await db.createTodoList(JSON.stringify(updata.listName), userid.toString());
		let items = []
		let listItems = JSON.parse(updata.listItems);
		console.log(Object.keys(listItems).length)

		for (let i = 0; i<Object.keys(listItems).length; i++){
			items.push(listItems[i])
			data = await db.createListItems(userid.toString(), JSON.stringify(updata.listName), listItems[i])
		}
		console.log(items)
		if (data.rows.length > 0){
            console.log("test")
			res.status(200).json({msg: "The todolist was created succesfully"}).end();
		} else {
			throw "The todolist couldn´t be created";
		}
	}
	catch(err){
		res.status(500).json({error: err}).end;
		next(err);
	}
});
router.delete("/todoitem", async function(req, res, next) {
	
	let updata= req.body;


	try{
		let data = await db.deleteTodoListItem(updata.id);

		if(data.rows.length > 0){
			res.status(200).json({msg: "The item was deleted successfully"}).end();
		}
		else{
			throw "The item couldn´t be deleted";
		}
	}
	catch(err){
		//res.status(500).json({error: err}).end();
		next(err); //called by using next(error) inside a catchblock in anyone of the async middleware or endpoint-functions above the error-handler
	}
});

router.delete("/todo", async function(req, res, next) {
	
	let updata= req.body;

	//let sql = "DELETE FROM todo WHERE id = $1 RETURNING *";
	//let values = [updata.id];

	try{
		//let result = await pool.query(sql, values);
		let data = await db.deleteTodoList(updata.id);

		if(data.rows.length > 0){
			res.status(200).json({msg: "The todolist was deleted successfully"}).end();
		}
		else{
			throw "The todolist couldn´t be deleted";
		}
	}
	catch(err){
		//res.status(500).json({error: err}).end();
		next(err); //called by using next(error) inside a catchblock in anyone of the async middleware or endpoint-functions above the error-handler
	}
});



module.exports = router;
