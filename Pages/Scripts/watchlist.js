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

                // Function to fetch and display movie details
                function fetchMovieDetails(movie, targetContainer, showSVG = true) {
                    const movieDetailsUrl = `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${apiKey}&language=en-US`;

                    $.getJSON(movieDetailsUrl, function(details) {
                        if (details) {
                            const ageRating = details.content_ratings ? details.content_ratings.results[0]?.rating : 'N/A';
                            const runtime = details.runtime ? `${details.runtime} min` : 'N/A';

                            // Determine age rating based on the 'adult' property
                            const ageRatingText = details.adult ? "18+" : "Non-Adult";

                            // Create movie card HTML
                            let movieCardHTML = `
                                <div class="movie-card" data-movie-id="${movie.id}">
                                    <img src="http://image.tmdb.org/t/p/w500/${movie.poster_path}" class="img-responsive" alt="${movie.title}" />
                                    <p class="d-flex align-items-center">
                                        <strong>${movie.title}</strong>`;
                            
                            // Append SVG if showSVG is true
                            if (showSVG) {
                                movieCardHTML += `
                                        <svg class="remove-movie" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                            <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
                                            <line x1="15" x2="9" y1="10" y2="10"/>
                                        </svg>`;
                            }
                            
                            movieCardHTML += `
                                    </p>
                                    <div class="info-buttons">
                                        <span class="year-button">${new Date(details.release_date).getFullYear() || 'N/A'}</span>
                                        <span class="age-rating-button">${ageRatingText}</span>
                                        <span class="runtime-button">${runtime}</span>
                                    </div>
                                </div>`;

                            // Append the movie card to the target container
                            $(targetContainer).append(movieCardHTML);

                            // Add click event for the SVG to remove the movie
                            if (showSVG) {
                                $(targetContainer).find('.remove-movie').last().on('click', function() {
                                    $(this).closest('.movie-card').remove(); // Remove the movie card

                                    // Check if there are still movies left in #poster-4
                                    if ($('#poster-4 .movie-card').length === 0) {
                                        $('#poster-4').html('<p class="no-movies">Nothing to show here :(</p>');
                                    }
                                });
                            }
                        }
                    });
                }

                // Fetch details for the first 4 random movies and display them (with SVG)
                if (randomMovies4.length > 0) {
                    randomMovies4.forEach(movie => fetchMovieDetails(movie, '#poster-4'));
                } else {
                    $('#poster-4').html('<p class="no-movies">Nothing to show here :(</p>');
                }

                // Fetch details for the next 20 random movies and display them (without SVG)
                randomMovies20.forEach(function(movie) {
                    if (movie.poster_path) {
                        fetchMovieDetails(movie, '#poster-20', false); // Pass 'false' to not show SVG
                    }
                });
            } else {
                $('#poster-4').html('<div class="alert"><p>No movies found.</p></div>');
                $('#poster-20').html('<div class="alert"><p>No movies found.</p></div>');
            }
        });
    });
});