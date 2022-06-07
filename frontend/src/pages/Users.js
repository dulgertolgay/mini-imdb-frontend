import React, { useEffect, useState } from "react";
import axios from "axios";
// import "../styles/Home.scss";
import { Table, Button, Form } from "react-bootstrap";
import Navigation from "../components/navbar";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Users = () => {
	const navigate = useNavigate();
	const logged = useSelector((store) => store.logged);

	const [search, setSearch] = useState("");
	const [users, setUsers] = useState([]);
	const [filter, setFilter] = useState({
		username: "",
	});

	useEffect(() => {
		// declare the data fetching function
		if (!logged) {
			navigate("/login");
		}
		const fetchData = async () => {
			try {
				const res = (
					await axios.get(
						`http://localhost:8080/api?queryString=
            SELECT user.username, count(*) as interactionCount 
						FROM user, rates 
						WHERE user.uid = rates.uid 
						GROUP BY user.uid 
						ORDER BY count(*) desc`
					)
				).data;
				let userData = res.data;
				setUsers(userData);
				// setFilteredUsers(userData);
				console.log("recieved user data: ", userData);
			} catch (err) {
				console.log("err: ", err.message);
			}
		};

		// call the function
		fetchData();
	}, [logged, navigate]);

	const handleFilter = async () => {
		setFilter({
			username: search,
		});
	};

	return (
		<div id="home">
			<Navigation />
			<div className="content">
				<div className="card">
					<Form.Group className="mb-3">
						<Form.Label>User Name</Form.Label>
						<Form.Control
							placeholder="Enter a user name"
							onChange={(e) => {
								setSearch(e.target.value);
							}}
						/>
					</Form.Group>
					<Button variant="primary" type="submit" onClick={handleFilter}>
						Filter
					</Button>
				</div>
				<div className="movie-list">
					<h1 className="title">Most Active Users</h1>
					<Table striped>
						<thead>
							<tr>
								<th>Username</th>
								<th>Interaction Count</th>
							</tr>
						</thead>
						<tbody>
							{users.length !== 0
								? filter.username
									? users
											.filter((user) => user.username === filter.username)
											.map((user, i) => (
												<tr key={i}>
													<td>{user.username}</td>
													<td>{user.interactionCount}</td>
												</tr>
											))
									: users.map((user, i) => (
											<tr key={i}>
												<td>{user.username}</td>
												<td>{user.interactionCount}</td>
											</tr>
									  ))
								: null}
						</tbody>
					</Table>
				</div>
			</div>
		</div>
	);
};

export default Users;
