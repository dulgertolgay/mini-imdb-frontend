import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Home.scss";
import { Table, Button, Form } from "react-bootstrap";
import Navigation from "../components/navbar";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Casts = () => {
  const navigate = useNavigate();
  const logged = useSelector((store) => store.logged);

  const [casts, setCasts] = useState([]);
  const [filter, setFilter] = useState({
    castName: "",
  });

  const getAllCastsAndCrewsQuery = `http://localhost:8080/api?queryString=
    SELECT CREW_CAST.fullName, CREW_CAST.birthYear, CREW_CAST.deathYear 
    FROM CAST, CREW, CREW_CAST
    WHERE CAST.id = CREW_CAST.id or CREW.id = CREW_CAST.id
    LIMIT 300`;

  const getBestCastsQuery = `http://localhost:8080/api?queryString=
  SELECT crew_cast.fullName, crew_cast.birthYear, crew_cast.deathYear, avg(rates.rating) as avgRatingOfCast
  FROM cast, crew_cast, plays_in, rates
  WHERE cast.id = crew_cast.id and cast.id = plays_in.cast_id and plays_in.mid in (
      SELECT rates.mid
      FROM movie
      WHERE rates.mid = movie.id 
      GROUP BY movie.id
  )
  GROUP BY cast.id
  ORDER BY avgRatingOfCast DESC;
`;

  const getBestProducersQuery = `http://localhost:8080/api?queryString=
  SELECT crew_cast.fullName, crew_cast.birthYear, crew_cast.deathYear, avg(rates.rating) as avgRatingOfProducer
  FROM crew, crew_cast, works_in, rates
  WHERE crew.id = crew_cast.id and crew.id = works_in.crew_id and works_in.role = "Producer" and works_in.mid in (
      SELECT rates.mid
      FROM movie
      WHERE rates.mid = movie.id 
      GROUP BY movie.id
  )
  GROUP BY crew.id
  ORDER BY avgRatingOfProducer DESC;
  `;

  const getAliveCastsWithMoviesQuery = `http://localhost:8080/api?queryString=
    SELECT crew_cast.fullName, crew_cast.birthYear, crew_cast.deathYear
    FROM cast, crew_cast, plays_in
    WHERE cast.id = crew_cast.id AND plays_in.cast_id = cast.id AND crew_cast.deathYear IS NULL 
    GROUP BY cast.id
    HAVING count(*) > ${filter.minNumberOfMovies}; 
  `;

  const getCrewWithRoleQuery = `http://localhost:8080/api?queryString=
    SELECT DISTINCT crew_cast.fullName, crew_cast.birthYear, crew_cast.deathYear, works_in.role
    FROM crew, crew_cast, works_in
    WHERE crew.id = crew_cast.id AND works_in.crew_id = crew.id AND works_in.role = '${filter.role}'
  `;

  useEffect(() => {
    // declare the data fetching function
    if (!logged) {
      navigate("/login");
    }
    executeQuery(getAllCastsAndCrewsQuery);
  }, []);

  const handleFilter = async () => {
    let castData = [];
    let crewData = [];
    try {
      if (filter.minNumberOfMovies) {
        const res = (await axios.get(getAliveCastsWithMoviesQuery)).data;
        castData = res.data;
      }
      if (filter.role) {
        const res = (await axios.get(getCrewWithRoleQuery)).data;
        crewData = res.data;
      }

      setCasts([...castData, ...crewData]);
    } catch (err) {
      console.log("err: ", err.message);
    }
  };

  const executeQuery = async (query) => {
    let bestCasts;
    try {
      const res = (await axios.get(query)).data;
      bestCasts = res.data;
      setCasts(bestCasts);
    } catch (err) {
      console.log("err: ", err.message);
    }
  };

  return (
    <div id="casts">
      <Navigation />
      <div className="content">
        <div className="card">
          <Form.Group className="mb-3">
            <Form.Label>Role</Form.Label>
            <Form.Control
              placeholder="Enter a role"
              onChange={(e) => {
                setFilter({ role: e.target.value });
              }}
            />
            <Form.Text className="text-muted">
              Enter role of the cast or crew
            </Form.Text>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Min Number of Movies</Form.Label>
            <Form.Control
              placeholder="Min number of movies"
              onChange={(e) => {
                setFilter({ minNumberOfMovies: e.target.value });
              }}
            />
            <Form.Text className="text-muted">
              List the casts or crews that worked in more movies than the
              entered number
            </Form.Text>
          </Form.Group>
          <Button variant="primary" type="submit" onClick={handleFilter}>
            Filter
          </Button>
        </div>
        <div className="movie-list">
          <div className="flex-row">
            <h1 className="title">Casts & Crews</h1>
            <div className="button-div">
              <Button
                variant="primary"
                type="submit"
                onClick={() => executeQuery(getBestCastsQuery)}
              >
                Best actors/actresses based on movies' rating
              </Button>
              <Button
                variant="primary"
                type="submit"
                onClick={() => executeQuery(getBestProducersQuery)}
              >
                Best producers based on movies' rating
              </Button>
            </div>
          </div>
          <Table striped>
            <thead>
              <tr>
                <th>Name</th>
                <th>Birth</th>
                <th>Death</th>
                {casts.length > 0 && casts[0].avgRatingOfCast ? (
                  <th>Average Rating</th>
                ) : null}
                {casts.length > 0 && casts[0].avgRatingOfProducer ? (
                  <th>Average Rating</th>
                ) : null}
                {casts.length > 0 && casts[0].role ? <th>Role</th> : null}
              </tr>
            </thead>
            <tbody>
              {casts.length !== 0
                ? casts.map((cast, i) => (
                    <tr key={i}>
                      <td>{cast.fullName}</td>
                      <td>{cast.birthYear ? cast.birthYear : "-"}</td>
                      <td>{cast.deathYear ? cast.deathYear : "-"}</td>
                      {cast.avgRatingOfCast ? (
                        <td>{Number(cast.avgRatingOfCast).toFixed(1)}</td>
                      ) : null}
                      {cast.avgRatingOfProducer ? (
                        <td>{Number(cast.avgRatingOfProducer).toFixed(1)}</td>
                      ) : null}
                      {cast.role ? <td>{cast.role}</td> : null}
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

export default Casts;
