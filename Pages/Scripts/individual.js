// Your API key
const apiKey = '165da49bc464981d104d3ca429f44d75';

// Fetch popular movie IDs from TMDb
fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}`)
    .then(response => response.json())
    .then(data => {
        const movieIds = data.results.map(movie => movie.id);
        console.log(movieIds); // Array of popular movie IDs
        // Fetch individual movie data using the array
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

            // Display only the first genre if it exists
            document.getElementById('genre').textContent = data.genres.length > 0 ? data.genres[0].name : 'Genre not available';

            document.getElementById('rating').textContent = data.vote_average;
            document.getElementById('duration').textContent = `${data.runtime} minutes`;

            // Extract and display only the year from release_date
            document.getElementById('release-date').textContent = data.release_date ? data.release_date.slice(0, 4) : 'Year not available';

            document.getElementById('description').textContent = data.overview;

            // Generate YouTube trailer URL (assuming data includes trailer information)
            document.getElementById('trailer').src = `https://www.youtube.com/embed/${data.trailer_id}`; // Replace with actual trailer ID key if available

            // Fetch and display the director and cast information
            fetchMovieCredits(movieId);
        })
        .catch(error => console.error('Error fetching data:', error));
}

// Fetch and display the director and cast
function fetchMovieCredits(movieId) {
    fetch(`https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${apiKey}`)
        .then(response => response.json())
        .then(creditsData => {
            // Find the director from the crew array
            const director = creditsData.crew.find(member => member.job === 'Director');
            document.getElementById('director-p').textContent = director ? director.name : 'Director not available';

            // Display the names of the first few cast members
            const castMembers = creditsData.cast.slice(0, 3).map(member => member.name).join(', ');
            document.getElementById('cast-p').textContent = castMembers || 'Cast not available';
        })
        .catch(error => console.error('Error fetching credits:', error));
}

// Call the function to fetch and display random movie data on page load
window.onload = () => {
    fetchMovies(currentPage);
    fetchMovieData();
};