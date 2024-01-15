import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';

const App = () => {
  const [movie, setMovie] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [savedMovies, setSavedMovies] = useState([]);

  useEffect(() => {
    // Fetch saved movies from the backend
    axios.get('http://localhost:5000/api/getSavedMovies')
      .then(response => setSavedMovies(response.data))
      .catch(error => console.error('Error fetching saved movies:', error));
  }, []);

  const searchMovie = async () => {
    try {
      // Fetch movie recommendations from the OMDb API
      const response = await axios.get(`http://www.omdbapi.com/?s=${movie}&apikey=99c8e8d7`);
      if (response.data.Search) {
        const movieRecommendations = response.data.Search.map(movie => movie.Title);
        setRecommendations(movieRecommendations);
      } else {
        setRecommendations([]);
      }
    } catch (error) {
      console.error('Error fetching movie recommendations:', error);
    }
  };

  const saveMovie = (movie) => {
    // Save the selected movie to the backend
    axios.post('http://localhost:5000/api/saveMovie', { movie })
      .then(response => {
        if (response.data.success) {
          setSavedMovies([...savedMovies, movie]);
        }
      })
      .catch(error => console.error('Error saving movie:', error));
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Cool Movie Recommendation App</h1>
        <div className="movie-search">
          <input
            type="text"
            placeholder="Enter a movie"
            value={movie}
            onChange={(e) => setMovie(e.target.value)}
          />
          <button onClick={searchMovie}>Search</button>
        </div>
        <div className="recommendations">
          <h2>Movie Recommendations</h2>
          <ul>
            {recommendations.map((recommendation, index) => (
              <li key={index}>
                {recommendation}
                <button onClick={() => saveMovie(recommendation)}>Save</button>
              </li>
            ))}
          </ul>
        </div>
        <div className="saved-movies">
          <h2>Saved Movies</h2>
          <ul>
            {savedMovies.map((savedMovie, index) => (
              <li key={index}>{savedMovie}</li>
            ))}
          </ul>
        </div>
      </header>
    </div>
  );
};

export default App;