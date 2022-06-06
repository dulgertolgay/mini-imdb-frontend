import express from "express";
import bodyParser from "body-parser";
import mysql from "mysql2";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();

const main = () => {
	const mysql_connection = mysql.createConnection({
		host: "localhost",
		user: "root",
		password: process.env.DB_PASSWORD,
		database: process.env.DB_NAME,
	});
	mysql_connection.connect();

	const app = express();
	app.use(bodyParser.json());
	app.use(cors({ origin: true }));

	const PORT = 8080;

	app.get("/api", (req, res) => {
		const queryString = req.query.queryString;
		if (!queryString) {
			res.status(400).send("queryString is required");
		}
		console.log("recieved query: ", queryString);

		mysql_connection.query(queryString, (err, result, fields) => {
			if (err) {
				res.status(400).send({
					type: "error",
					message: err.message,
				});
			}
			res.status(200).send({
				type: "success",
				data: result,
			});
		});
	});

	app.listen(PORT, () => console.log(`Listening at localhost: ${PORT}`));
};

main();
