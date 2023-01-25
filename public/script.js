// tmdb API
const tmdbKey = '55d7a3a01c23df8352d27a59eddeff35';
// tmdb URL
const tmdbBaseUrl = 'https://api.themoviedb.org/3';
// Button from the DOM
const playBtn = document.getElementById('playBtn');

// function to get the genres from the API
const getGenres = async() => {
  const genreRequestEndpoint = '/genre/movie/list';
  const requestParams = `?api_key=${tmdbKey}`
  const urlToFetch = `${tmdbBaseUrl}${genreRequestEndpoint}${requestParams}`;
  try {
    const response = await fetch(urlToFetch);
    if (response.ok) {
      // If response is ok then we can proceed to fetch the response
      const jsonResponse = await response.json();
      console.log(jsonResponse);
      // save the array genres from the API
      const genres = jsonResponse.genres;
      console.log(genres);
      return genres
    }
  } catch (error)
   {
    console.log(error);
   }   
}
// function  to get a selection of random movies based in a genre
const getMovies = async () => {
  // getSelectedGenre fuction is on the helper.js file
  const selectedGenre = getSelectedGenre();
  const discoverMovieEndpoint = '/discover/movie';
  const requestParams = `?api_key=${tmdbKey}&with_genres=${selectedGenre}`;
  const urlToFetch = `${tmdbBaseUrl}${discoverMovieEndpoint}${requestParams}`;
  try {
    const response = await fetch(urlToFetch);
    // If response is ok then we can proceed to fetch the response
    if (response.ok) {
      const jsonResponse = await response.json();
      console.log(jsonResponse)
      // save the array results from the API
      const movies = jsonResponse.results;
      console.log(movies);
      return movies;
    }
  } catch (error) 
  {
    console.log(error);
  }
};
// Gets an individual movie
const getMovieInfo = async (movie) => {
  const movieID = movie.id;
  console.log(movieID)
  // remember to use `` instead of '' to inject teh JS
  const movieEndPoint = `/movie/${movieID}`
  console.log(movieEndPoint)
  const requestParams = `?api_key=${tmdbKey}`;
  const urlToFetch = `${tmdbBaseUrl}${movieEndPoint}${requestParams}`;
  try {
    const response = await fetch(urlToFetch);
    // If response is ok then we can proceed to fetch the response
    if (response.ok) {
      const movieInfo = await response.json();
      console.log(movieInfo)
      return movieInfo;    
    }
  } catch (error) {
    console.log(error);
  }  

};
// Gets a list of movies and ultimately displays the info of a random movie from the list
const showRandomMovie = async () => {
  // display the elements in the DOM in the Id movieInfo
  const movieInfo = document.getElementById('movieInfo');
  // if there are results clear existing view with the func clearCurrentMovie() from the helper.js
  if (movieInfo.childNodes.length > 0) {
    clearCurrentMovie();
  };
  // launch the getMovies func from this js
  const movies = await getMovies();
  // launch the getRandomMovie func from helper js passing the parameter movies from getMovies()
  const randomMovie = await getRandomMovie(movies);
  console.log(randomMovie)
  // launch the getMovieInfo() func from this js passing the parameter randomMovie from getRandomMovie()
  const info = await getMovieInfo(randomMovie);
  console.log(info)
  // launch the displayMovie from helper.js func passing the parameter info obtained from getMovieInfo()
  displayMovie(info)
};
// populate the dropdown with the return from the getGenres() from this js
getGenres().then(populateGenreDropdown);
// launch the func when interacting with the button in the DOM
playBtn.onclick = showRandomMovie;