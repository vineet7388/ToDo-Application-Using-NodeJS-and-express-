const express = require("express");
var app = express();

var mysql = require("mysql");
var con = mysql.createConnection({
	host:"localhost",
	user:"root",
	password:"xxx",
	database:"demo"
})

var handlebars = require("express-handlebars").create({defaultLayout:"main"});
app.engine("handlebars",handlebars.engine);
app.use(express.static(__dirname + '/public'));

var bodyParser=require("body-parser");
app.use(bodyParser());


con.connect((err) => {
  if (err) throw err;
  var name;
  app.post("/",function(req,res){
  	const {body} = req;

  	if(body.update && body.taskid!="No tasks"){
  		name = body.name;
  		let updatecriteria = body.task;
  		let id=body.taskid;
  		var sqlquery = "update todo set task = '" + updatecriteria + "'where taskid ='" + id + "'";
  		con.query(sqlquery, function(err,result){
		if(err) throw err;
  	})
  	}

  	if(body.add){
  		name = body.name;
  		let addtask = body.task;
  		var sqlquery = "insert into todo (name,creationdate,task) values ('" + name + "',curdate(),'" + addtask + "');";
  		con.query(sqlquery, function(err,result){
		if(err) throw err;
  	})
  	}

  	if(body.remove && body.taskid!="No tasks"){
  		let id=body.taskid;
  		var sqlquery = "delete from todo where taskid=" + id + "";
  		con.query(sqlquery, function(err,result){
		if(err) throw err;
  	})
  	}

  		name = body.name;
  		var sqlquery = "select taskid,name,DATE_FORMAT(creationdate,'%D/%M/%Y') as date,task from todo where name='" + name + "'";
  	
  	con.query(sqlquery, function(err,result){
		if(err) throw err;
		//console.log(body.task);
		if(result.length>0){
			console.log(result);
			res.render("tasks.handlebars",{result:result});
		}
		else{
			let today = new Date();
			let dd = String(today.getDate()).padStart(2, '0');
			let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
			let yyyy = today.getFullYear();

			today = mm + '/' + dd + '/' + yyyy;
			result = [ {
    		taskid: 'No tasks',
    		name: name,
    		date: today,
    		task: 'N/A'
  }];
  res.render("tasks.handlebars",{result:result});
		}
		
	})
  })
});

app.get("/",function(req,res){
	res.render("home.handlebars");
})



app.listen("3030",()=>{
	console.log("Listening on port 3030");
})

