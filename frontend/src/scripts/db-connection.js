const mysql = require("mysql2");

const connectAndQuery = async () => {
	const mysql_connection = mysql.createConnection({
		host: "localhost",
		user: "root",
		password: "CoderZiya1305",
		database: "mini_imdb",
	});
	mysql_connection.connect();

	mysql_connection.query("SELECT * FROM CAST", (err, result, fields) => {
		console.log("res: ", result);
	});
};

export default connectAndQuery;
