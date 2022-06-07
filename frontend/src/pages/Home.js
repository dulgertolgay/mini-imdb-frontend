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

  const [movies, setMovies] = useState([]);
  const [filter, setFilter] = useState({
    castName: "",
    movieName: "",
  });
  const [movieData, setMovieData] = useState({
    id: "",
    name: "",
    language: "",
    budget: 0,
    revenue: 0,
    year: 0,
  });

  useEffect(() => {
    // declare the data fetching function
    if (!logged) {
      navigate("/login");
    }
    // call the function
    fetchData();
  }, [logged, navigate]);

  const fetchData = async () => {
    try {
      const res = (
        await axios.get(
          `http://localhost:8080/api?queryString=
          SELECT movie.name, movie.year, movie.revenue, rates.rating
          FROM movie, rates
          WHERE movie.id = rates.mid 
          ORDER BY rates.rating DESC 
          LIMIT 300`
        )
      ).data;
      let movieData = res.data;
      setMovies(movieData);
    } catch (err) {
      console.log("err: ", err.message);
    }
  };

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
      }
      if (filter.movieName) {
        const res = (
          await axios.get(
            `http://localhost:8080/api?queryString=
            SELECT *
            FROM movie
            WHERE movie.name = '${filter.movieName}'
            `
          )
        ).data;
        movieData = movieData
          ? movieData.filter((movie) =>
              res.data.map((x) => x.id).includes(movie.id)
            )
          : res.data;
      }
      if (!filter.castName && !filter.movieName) {
        const res = (
          await axios.get(
            `http://localhost:8080/api?queryString=
            SELECT movie.name, movie.year, movie.revenue, rates.rating
			      FROM movie, rates
            WHERE movie.id = rates.mid 
			      ORDER BY rates.rating DESC 
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

  const handleAdd = async () => {
    try {
      let randomInt = Math.floor(Math.random() * 100000000);
      setMovieData((prevState) => ({
        ...prevState,
        id: "tt" + randomInt,
      }));

      const res = (
        await axios.get(
          `http://localhost:8080/api?queryString=
            INSERT INTO MOVIE(id, name, language, budget, revenue, year)
            VALUES('${movieData.id}', '${movieData.name}', '${movieData.language}', ${movieData.budget}, ${movieData.revenue}, ${movieData.year});
            `
        )
      ).data;
      fetchData();
    } catch (err) {
      console.log("err: ", err.message);
    }
  };

  return (
    <div id="home">
      <Navigation />
      <div className="content">
        <div className="flex-col">
          <div className="card">
            <Form.Group className="mb-3">
              <Form.Label>Cast Name</Form.Label>
              <Form.Control
                placeholder="Enter a cast name"
                onChange={(e) => {
                  setFilter((prevState) => ({
                    ...prevState,
                    castName: e.target.value,
                  }));
                }}
              />
              <Form.Text className="text-muted">Select cast's movies</Form.Text>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Movie Name</Form.Label>
              <Form.Control
                placeholder="Enter a movie name"
                onChange={(e) => {
                  setFilter((prevState) => ({
                    ...prevState,
                    movieName: e.target.value,
                  }));
                }}
              />
            </Form.Group>
            <Button variant="primary" type="submit" onClick={handleFilter}>
              Filter
            </Button>
          </div>
          <div className="card">
            <p>Add a Movie</p>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                placeholder="Name"
                onChange={(e) => {
                  setMovieData((prevState) => ({
                    ...prevState,
                    name: e.target.value,
                  }));
                }}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Language</Form.Label>
              <Form.Control
                placeholder="EN"
                onChange={(e) => {
                  setMovieData((prevState) => ({
                    ...prevState,
                    language: e.target.value,
                  }));
                }}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Budget</Form.Label>
              <Form.Control
                placeholder="Budget"
                type="number"
                onChange={(e) => {
                  setMovieData((prevState) => ({
                    ...prevState,
                    budget: e.target.value,
                  }));
                }}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Revenue</Form.Label>
              <Form.Control
                placeholder="Revenue"
                type="number"
                onChange={(e) => {
                  setMovieData((prevState) => ({
                    ...prevState,
                    revenue: e.target.value,
                  }));
                }}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Year</Form.Label>
              <Form.Control
                placeholder="Year"
                type="number"
                onChange={(e) => {
                  setMovieData((prevState) => ({
                    ...prevState,
                    year: e.target.value,
                  }));
                }}
              />
            </Form.Group>
            <Button variant="primary" type="submit" onClick={handleAdd}>
              Add Movie
            </Button>
          </div>
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
                      <td>{movie.rating}</td>
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
