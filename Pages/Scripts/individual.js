//  API key
const apiKey = '165da49bc464981d104d3ca429f44d75';

// Fetch popular movie IDs from TMDb
fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}`)
    .then(response => response.json())
    .then(data => {
        const movieIds = data.results.map(movie => movie.id);
        console.log(movieIds); // Array of popular movie IDs
        // array to fetch individual movie data
        fetchMovieData(movieIds);
    })
    .catch(error => console.error('Error fetching data:', error));

// Fetch and display movie data
function fetchMovieData(movieIds) {
    const randomIndex = Math.floor(Math.random() * movieIds.length);
    const movieId = movieIds[randomIndex];
    fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('movie-title').textContent = data.title;
            document.getElementById('genre').textContent = data.genres.map(genre => genre.name).join(', ');
            document.getElementById('rating').textContent = data.vote_average; 
            document.getElementById('duration').textContent = `${data.runtime} minutes`;
            document.getElementById('release-date').textContent = data.release_date;
            document.getElementById('description').textContent = data.overview;
            document.getElementById('trailer').src = `https://www.youtube.com/embed/your-trailer-id`;
        })
        .catch(error => console.error('Error fetching data:', error));
}

