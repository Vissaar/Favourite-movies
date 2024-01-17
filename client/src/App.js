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
      // Fetch detailed movie recommendations from the OMDb API
      const response = await axios.get(`http://www.omdbapi.com/?s=${movie}&apikey=99c8e8d7`);
      if (response.data.Search) {
        setRecommendations(response.data.Search);
      } else {
        setRecommendations([]);
      }
    } catch (error) {
      console.error('Error fetching movie recommendations:', error);
    }
  };

  const saveMovie = (movie) => {
    // Save the selected movie to the backend
    axios.post('http://localhost:5000/api/saveMovie', { movie: movie.Title })
      .then(response => {
        if (response.data.success) {
          setSavedMovies([...savedMovies, movie]);
        }
      })
      .catch(error => console.error('Error saving movie:', error));
  };

  const deleteMovie = (index) => {
    // Delete the selected movie from the backend
    axios.post('http://localhost:5000/api/deleteMovie', { index })
      .then(response => {
        if (response.data.success) {
          const updatedSavedMovies = [...savedMovies];
          updatedSavedMovies.splice(index, 1);
          setSavedMovies(updatedSavedMovies);
        }
      })
      .catch(error => console.error('Error deleting movie:', error));
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
        <div className="sections">
          <div className="recommendations">
            <h2>Movie Recommendations</h2>
            <div className="cards-container">
              {recommendations.map((recommendation, index) => (
                <div key={index} className="card">
                  <img src={recommendation.Poster} className="card-img-top" alt={recommendation.Title} />
                  <div className="card-body">
                    <h5 className="card-title">{recommendation.Title}</h5>
                    <button className="save-button" onClick={() => saveMovie(recommendation)}>Save</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="saved-movies">
            <h2>Saved Movies</h2>
            <div className="cards-container">
              {savedMovies.map((savedMovie, index) => (
                <div key={index} className="card">
                  <img src={savedMovie.Poster || 'path-to-default-image.jpg'} className="card-img-top" alt={savedMovie.Title} />
                  <div className="card-body">
                    <h5 className="card-title">{savedMovie.Title}</h5>
                    <button className="delete-button" onClick={() => deleteMovie(index)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export default App;