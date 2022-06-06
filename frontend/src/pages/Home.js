import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Home.scss";
import { Table } from "react-bootstrap";
import Navigation from "../components/navbar";

const Home = () => {
	const [search, setSearch] = useState("");

	useEffect(() => {
		// declare the data fetching function
		const fetchData = async () => {
			try {
				const res = (
					await axios.get(
						"http://localhost:8080/api?queryString=SELECT * FROM CAST"
					)
				).data;
				console.log("res: ", res.data);
			} catch (err) {
				console.log("err: ", err.message);
			}
		};

		// call the function
		fetchData();
	}, []);

	return (
		<div id="home">
			<Navigation />
			<div className="movie-list">
				<h1 className="title">Top Movies</h1>
				<Table striped>
					<thead>
						<tr>
							<th>Rank & Title</th>
							<th>Rating</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td> 1. The Shawshank Redemption (1994)</td>
							<td>9.2</td>
						</tr>
						<tr>
							<td> 2. The Godfather (1972)</td>
							<td>9.2</td>
						</tr>
						<tr>
							<td> 3. The Dark Knight (2008)</td>
							<td>9.0</td>
						</tr>
					</tbody>
				</Table>
			</div>
		</div>
	);
};

export default Home;
