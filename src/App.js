import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;

// Populate dropdown menu with all the available genres
const populateGenreDropdown = (genres) => {
  const select = document.getElementById('genres')

  for (const genre of genres) {
      let option = document.createElement("option");
      option.value = genre.id;
      option.text = genre.name;
      select.appendChild(option);
  }
};

// Returns the current genre selection from the dropdown menu
const getSelectedGenre = () => {
  const selectedGenre = document.getElementById('genres').value;
  return selectedGenre;
};

// Displays the like and dislike buttons on the page
const showBtns = () => {
  const btnDiv = document.getElementById('likeOrDislikeBtns');
  btnDiv.removeAttribute('hidden');
};

// Clear the current movie from the screen
const clearCurrentMovie = () => {
  const moviePosterDiv = document.getElementById('moviePoster');
  const movieTextDiv = document.getElementById('movieText');
  moviePosterDiv.innerHTML = '';
  movieTextDiv.innerHTML = '';
}

// After liking a movie, clears the current movie from the screen and gets another random movie
const likeMovie = () => {
  clearCurrentMovie();
  showRandomMovie();
};

// After disliking a movie, clears the current movie from the screen and gets another random movie
const dislikeMovie = () => {
  clearCurrentMovie();
  showRandomMovie();
};

// Create HTML for movie poster
const createMoviePoster = (posterPath) => {
  const moviePosterUrl = `https://image.tmdb.org/t/p/original/${posterPath}`;

  const posterImg = document.createElement('img');
  posterImg.setAttribute('src', moviePosterUrl);
  posterImg.setAttribute('id', 'moviePoster');

  return posterImg;
};

// Create HTML for movie title
const createMovieTitle = (title) => {
  const titleHeader = document.createElement('h1');
  titleHeader.setAttribute('id', 'movieTitle');
  titleHeader.innerHTML = title;

  return titleHeader;
};

// Create HTML for movie overview
const createMovieOverview = (overview) => {
  const overviewParagraph = document.createElement('p');
  overviewParagraph.setAttribute('id', 'movieOverview');
  overviewParagraph.innerHTML = overview;

  return overviewParagraph;
};

// Returns a random movie from the first page of movies
const getRandomMovie = (movies) => {
  const randomIndex = Math.floor(Math.random() * movies.length);
  const randomMovie = movies[randomIndex];
  return randomMovie;
};

// Uses the DOM to create HTML to display the movie
const displayMovie = (movieInfo) => {
  const moviePosterDiv = document.getElementById('moviePoster');
  const movieTextDiv = document.getElementById('movieText');
  const likeBtn = document.getElementById('likeBtn');
  const dislikeBtn = document.getElementById('dislikeBtn');

  // Create HTML content containing movie info
  const moviePoster = createMoviePoster(movieInfo.poster_path);
  const titleHeader = createMovieTitle(movieInfo.title);
  const overviewText = createMovieOverview(movieInfo.overview);

  // Append title, poster, and overview to page
  moviePosterDiv.appendChild(moviePoster);
  movieTextDiv.appendChild(titleHeader);
  movieTextDiv.appendChild(overviewText);

  showBtns();
  likeBtn.onclick = likeMovie;
  dislikeBtn.onclick = dislikeMovie;
};

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