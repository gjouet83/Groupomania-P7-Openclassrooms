require("dotenv").config();

const mysql = require("mysql");
const express = require("express");
const path = require("path");


const userRoutes = require("./routes/user");

const app = express();

// on connecte la bdd 
const dataBase = mysql.createConnection({
	host: process.env.HOST,
	user: process.env.USERNAME,
	password: process.env.PASSWORD
});
dataBase.connect(function(err) {
	if (err) {
		console.log("Connexion à la base de données: ECHEC ");
	}else {
		console.log("Connexion à la base de données: SUCCES ");
	}
});

// on paramètre les headers pour eviter les erreurs cors
app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
	);
	res.setHeader(
		"Access-Control-Allow-Methods",
		"GET, POST, PUT, DELETE, PATCH, OPTIONS"
	);
	next();
});

app.use(express.json());

app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/api/auth", userRoutes);

module.exports = app;
