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

  const getAllCastsQuery = `http://localhost:8080/api?queryString=
  SELECT CC.fullName, CC.birthYear, CC.deathYear 
  FROM MOVIE AS M, CREW_CAST AS CC, PLAYS_IN AS PI 
  WHERE PI.mid = M.id and PI.cast_id = CC.id
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

  useEffect(() => {
    // declare the data fetching function
    if (!logged) {
      navigate("/login");
    }
    executeQuery(getAllCastsQuery);
  }, []);

  const handleFilter = async () => {
    let castsMovies;
    try {
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
        castsMovies = res.data;
      }
      setCasts(castsMovies);
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
          <div className="flex-row">
            <h1 className="title">Casts</h1>
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
