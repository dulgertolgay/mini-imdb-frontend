import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Home.scss";
import { Table, Button, Form } from "react-bootstrap";
import Navigation from "../components/navbar";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const logged = useSelector((store) => store.logged);

  const [search, setSearch] = useState("");
  const [movies, setMovies] = useState([]);
  const [filter, setFilter] = useState({
    castName: "",
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
            SELECT name, year, revenue 
			      FROM MOVIE 
			      ORDER BY revenue DESC 
			      LIMIT 300`
          )
        ).data;
        let movieData = res.data;
        setMovies(movieData);
      } catch (err) {
        console.log("err: ", err.message);
      }
    };

    // call the function
    fetchData();
  }, [logged, navigate]);

  const handleFilter = async () => {
    try {
      var movieData;
      if (filter.castName) {
        const res = (
          await axios.get(
            `http://localhost:8080/api?queryString=
            SELECT *
            FROM movie
            WHERE movie.id IN ( 
	                    SELECT mid
	                    FROM cast, plays_in, crew_cast
	                    WHERE plays_in.cast_id = cast.id AND crew_cast.id = cast.id AND crew_cast.fullName = '${filter.castName}');
            `
          )
        ).data;
        movieData = res.data;
      } else {
        const res = (
          await axios.get(
            `http://localhost:8080/api?queryString=
            SELECT *
			      FROM movie 
			      ORDER BY revenue DESC 
			      LIMIT 300`
          )
        ).data;
        movieData = res.data;
      }
      setMovies(movieData);
    } catch (err) {
      console.log("err: ", err.message);
    }
  };

  return (
    <div id="home">
      <Navigation />
      <div className="content">
        <div className="card">
          <Form.Group className="mb-3">
            <Form.Label>Cast Name</Form.Label>
            <Form.Control
              placeholder="Enter a cast name"
              onChange={(e) => {
                setFilter({ castName: e.target.value });
              }}
            />
            <Form.Text className="text-muted">Select cast's movies</Form.Text>
          </Form.Group>
          <Button variant="primary" type="submit" onClick={handleFilter}>
            Filter
          </Button>
        </div>
        <div className="movie-list">
          <h1 className="title">Top Movies</h1>
          <Table striped>
            <thead>
              <tr>
                <th>Rank & Title</th>
                <th>Year</th>
                <th>Revenue</th>
                <th>Rating</th>
              </tr>
            </thead>
            <tbody>
              {movies.length !== 0
                ? movies.map((movie, i) => (
                    <tr key={i}>
                      <td>{movie.name}</td>
                      <td>{movie.year}</td>
                      <td>${parseInt(movie.revenue)}</td>
                      <td>9.2</td>
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

export default Home;
