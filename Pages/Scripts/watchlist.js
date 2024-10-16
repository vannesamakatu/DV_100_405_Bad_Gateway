$(document).ready(function() {
    const apiKey = '165da49bc464981d104d3ca429f44d75';
    const apiUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&sort_by=popularity.desc`;
    const genreUrl = `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=en-US`;

    let genres = {};

    // Fetch genres
    $.getJSON(genreUrl, function(genreJson) {
        console.log('Genres:', genreJson); // Log the genres response
        genreJson.genres.forEach(function(genre) {
            genres[genre.id] = genre.name;
        });

        // Fetch movies
        $.getJSON(apiUrl, function(json) {
            console.log('Movies:', json); // Log the movies response
            if (json.results.length > 0) {
                $('#poster-4').empty();
                $('#poster-20').empty();
                
                let randomMovies4 = json.results.sort(() => 0.5 - Math.random()).slice(0, 4);
                let randomMovies20 = json.results.sort(() => 0.5 - Math.random()).slice(0, 20);

                randomMovies4.forEach(function(movie) {
                    if (movie.poster_path) {
                        $('#poster-4').append(
                            `<div class="movie-card">
                                <img src="http://image.tmdb.org/t/p/w500/${movie.poster_path}" class="img-responsive" alt="${movie.title}" />
                                <p class="d-flex align-items-center">
                                    <strong>${movie.title}</strong>
                                    <svg class="ms-auto" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
                                        <line x1="15" x2="9" y1="10" y2="10"/>
                                    </svg>
                                </p>
                                <div class="info-buttons">
                                    <span class="button">Rating: ${movie.vote_average || 'N/A'}</span>
                                    <span class="button">Year: ${new Date(movie.release_date).getFullYear() || 'N/A'}</span>
                                </div>
                            </div>`
                        );
                    }
                });
                

                randomMovies20.forEach(function(movie) {
                    if (movie.poster_path) {
                        $('#poster-20').append(
                            `<div class="movie-card">
                                <img src="http://image.tmdb.org/t/p/w500/${movie.poster_path}" class="img-responsive" alt="${movie.title}" />
                                <p><strong>${movie.title}</strong></p>
                                <div class="info-buttons">
                                    <span class="button">Rating: ${movie.vote_average || 'N/A'}</span>
                                    <span class="button">Year: ${new Date(movie.release_date).getFullYear() || 'N/A'}</span>
                                </div>
                            </div>`
                        );
                    }
                });
            } else {
                $('#poster-4').html('<div class="alert"><p>No movies found.</p></div>');
                $('#poster-20').html('<div class="alert"><p>No movies found.</p></div>');
            }
        });
    });
});
