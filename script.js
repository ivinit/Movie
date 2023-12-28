const movHead = document.querySelector('#movHead');
const mov = document.querySelector('#movName');
const postersContainer = document.getElementById('posters-container');
const vidFrame = document.getElementById('vid');
const vidDetails = document.getElementById('vidDetails');
const searchBtn = document.getElementById('searchBtn');
const backBtn = document.getElementById('backBtn');

// Enter key press search
mov.addEventListener('keyup', function (event) {
  if (event.key === 'Enter') {
    searchMov();
  }
});

searchBtn.addEventListener('click', searchMov);

// Search movie function
function searchMov() {
  // Replace the API_URL with the actual API endpoint
  document.getElementById('loading').style.display = 'block';
  console.log('clicked');
  movHead.textContent = `Search results for "${mov.value}"`;
  postersContainer.innerHTML = '';

  const API_URL = `https://www.omdbapi.com/?apikey=7ceb24d1&s=${mov.value}`;

  // Fetch data from the API
  fetch(API_URL)
    .then(response => response.json())
    .then(data => {
      // Hide loading message once data is fetched
      document.getElementById('loading').style.display = 'none';
      displayMoviePosters(data.Search);
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      // Hide loading message in case of an error
      document.getElementById('loading').style.display = 'none';
      // Display an error message
      document.getElementById('posters-container').innerHTML =
        '<p>Error loading data</p>';
    });
}

backBtn.addEventListener('click', e => {
  backBtn.style.display = 'none';
  mov.style.display = 'inline';
  searchBtn.style.display = 'inline';
  postersContainer.style.display = 'flex';
  vidFrame.style.height = '0vh';
});

// function to open a movie in iframe
const openMov = function (movie, linkUrl) {
  backBtn.style.display = 'inline';
  mov.style.display = 'none';
  searchBtn.style.display = 'none';
  postersContainer.style.display = 'none';
  vidFrame.style.height = '50vh';
  //   console.log(`From openMov : ${mov}`);
  movHead.textContent = `${
    movie.Type[0].toUpperCase() + movie.Type.substring(1)
  }: ${movie.Title} (${movie.Year})`;
  vidFrame.setAttribute('allowfullscreen', 'true');
  vidFrame.src = linkUrl;
};

// Function to display movie posters
function displayMoviePosters(movies) {
  if (movies && movies.length > 0) {
    movies.forEach(movie => {
      const movieCard = document.createElement('div');
      movieCard.className = 'movie-card';

      const movieLink = document.createElement('a');
      movieLink.className = 'movie-link';

      // Determine the link based on the movie type
      const linkType = movie.Type === 'movie' ? 'movie' : 'tv';
      const linkUrl = `https://vidsrc.to/embed/${linkType}/${movie.imdbID}`;

      if (movie.Poster != 'N/A') {
        const posterImage = document.createElement('img');
        posterImage.src = movie.Poster;
        posterImage.alt = `${movie.Title} Poster`;

        const movieTitle = document.createElement('p');
        movieTitle.className = 'movie-title';
        movieTitle.textContent = movie.Title;

        movieLink.onclick = function () {
          console.log(movie);
          openMov(movie, linkUrl);
        };

        movieLink.appendChild(posterImage);
        movieLink.appendChild(movieTitle);
        movieCard.appendChild(movieLink);
        postersContainer.appendChild(movieCard);
      }
    });
    mov.value = '';
  } else {
    movHead.textContent = `No movies found : ${mov.value}`;
  }
}

function handlePopstate(event) {
  // Check if there is a previous state
  if (event.state) {
    // Previous state is available, perform your operations here
    console.log('User navigated back to a previous state:', event.state);
    // Call your custom function or perform any operations you need
    // For example, you can call a function like restorePageState(event.state);
  } else {
    // No previous state available, handle accordingly
    console.log('No previous state available');
    // Perform your operations for the absence of a previous state
  }
}

// Attach the event listener for the popstate event
window.addEventListener('popstate', handlePopstate);
