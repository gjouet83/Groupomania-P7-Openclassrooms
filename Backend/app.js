require("dotenv").config();

const mysql = require("mysql");
const { Sequelize } = require("sequelize");
const express = require("express");
const path = require("path");

const userRoutes = require("./routes/user");


const app = express();

// on connecte la bdd
const sequelize = new Sequelize(
	"groupomania",
	process.env.USERNAME,
	process.env.PASSWORD,
	{
		dialect: "mysql",
		host: process.env.HOST,
	}
);
sequelize
	.authenticate()
	.then(() => {
		console.log("Connexion à la base de données: SUCCES !");
	})
	.catch((err) => {
		console.log("Connexion à la base de données: ECHEC ", err);
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
app.use("/api/users", userRoutes);


module.exports = app;
