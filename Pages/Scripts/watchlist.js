$(document).ready(function() {
    const apiKey = '165da49bc464981d104d3ca429f44d75';
    const apiUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&sort_by=popularity.desc`;
    const genreUrl = `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=en-US`;
  
    // Define genres
    let genres = {};
  
    // Fetch genres
    $.getJSON(genreUrl, function(genreJson) {
        genreJson.genres.forEach(function(genre) {
            genres[genre.id] = genre.name;
        });

        // Fetch movies when the page loads
        $.getJSON(apiUrl, function(json) {
            if (json.results.length > 0) {
                $('#poster').empty();
                
                // Randomly select 4 movies
                let randomMovies = json.results.sort(() => 0.5 - Math.random()).slice(0, 4);
  
                randomMovies.forEach(function(movie) {
                    if (movie.poster_path) {
                        // Map movie genres
                        let movieGenres = movie.genre_ids.map(id => genres[id]).join(', ');

                        // Create HTML structure for each random movie
                        $('#poster').append(
                            `<div>
                                <img src="http://image.tmdb.org/t/p/w500/${movie.poster_path}" class="img-responsive" alt="${movie.title}" />
                                <p><strong>${movie.title}</strong></p>
                            </div>`
                        );
                    }
                });
            } else {
                $('#poster').html('<div class="alert"><p>No movies found.</p></div>');
            }
        });
    });
});
