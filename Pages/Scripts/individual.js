// Scripts/individual.js

$(document).ready(function() {
    const apiKey = '165da49bc464981d104d3ca429f44d75'; 
    const apiBaseUrl = 'https://api.themoviedb.org/3';
    const imageBaseUrl = 'https://image.tmdb.org/t/p/w500';
    const youtubeBaseUrl = 'https://www.youtube.com/embed/';

    // Function to get URL parameters
    function getUrlParameter(name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
        const results = regex.exec(location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    }

    const movieId = getUrlParameter('movieId');

    if (!movieId) {
        // Insert error message into the top of the movie-desc-container
        $('.movie-desc-container').prepend('<div class="alert alert-danger">No movie ID provided.</div>');
        return;
    }

    // Function to fetch movie details
    function fetchMovieDetails(movieId) {
        const movieDetailsUrl = `${apiBaseUrl}/movie/${movieId}?api_key=${apiKey}&language=en-US&append_to_response=credits,videos`;

        $.getJSON(movieDetailsUrl, function(details) {
            displayMovieDetails(details);
            loadRelatedMovies(details.genres.map(genre => genre.id).join(','));
        }).fail(function(jqXHR, textStatus, errorThrown) {
            console.error('Failed to fetch movie details:', textStatus, errorThrown);
            $('.movie-desc-container').prepend('<div class="alert alert-danger">Failed to load movie details.</div>');
        });
    }

    // Function to display movie details in the DOM
    function displayMovieDetails(details) {
        // Populate the title
        $('#movie-title').text(details.title || 'Title Not Available');

        // Populate the genre
        const genres = details.genres.map(genre => genre.name).join(', ');
        $('#genre').text(genres || 'Genre Not Available');

        // Populate the rating
        $('#rating').text(details.vote_average ? `${details.vote_average} / 10` : 'Rating Not Available');

        // Populate the duration
        $('#duration').text(details.runtime ? `${details.runtime} min` : 'Duration Not Available');

        // Populate the release date
        $('#release-date').text(details.release_date || 'Release Date Not Available');

        // Populate the description
        $('#description').text(details.overview || 'Description Not Available');

        // Populate the director
        const director = details.credits.crew.find(member => member.job === 'Director');
        $('#director-p').text(director ? director.name : 'Director Not Available');

        // Populate the cast (limit to top 5)
        const cast = details.credits.cast.slice(0, 5).map(member => member.name).join(', ');
        $('#cast-p').text(cast || 'Cast Not Available');

        // Populate the trailer
        const trailer = details.videos.results.find(video => video.type === 'Trailer' && video.site === 'YouTube');
        if (trailer) {
            $('#trailer').attr('src', `${youtubeBaseUrl}${trailer.key}`);
        } else {
            $('#trailer').replaceWith('<p>No trailer available.</p>');
        }

        // Handle "My List" button state
        const bookmarks = getBookmarks();
        if (bookmarks.includes(movieId)) {
            $('#myList').addClass('btn-success').removeClass('btn-secondary').html('<i class="fas fa-bookmark" style="margin-right: 8px;"></i> Bookmarked');
        } else {
            $('#myList').addClass('btn-secondary').removeClass('btn-success').html('<i class="fas fa-bookmark" style="margin-right: 8px;"></i> My List');
        }
    }

    // Function to fetch and display related movies
    function loadRelatedMovies(genreIds) {
        // Ensure genreIds is not empty
        if (!genreIds) {
            $('#poster-20').html('<div class="alert alert-warning">No genres available to fetch related movies.</div>');
            return;
        }

        const relatedMoviesUrl = `${apiBaseUrl}/discover/movie?api_key=${apiKey}&with_genres=${genreIds}&sort_by=popularity.desc&exclude_movie_ids=${movieId}&page=1`;

        $.getJSON(relatedMoviesUrl, function(response) {
            console.log('Fetched related movies:', response); // Debugging
            const movies = response.results.slice(0, 20); // Get top 20 related movies
            if (movies.length === 0) {
                $('#poster-20').html('<div class="alert alert-info">No related movies found.</div>');
                return;
            }
            displayRelatedMovies(movies);
        }).fail(function(jqXHR, textStatus, errorThrown) {
            console.error('Failed to fetch related movies:', textStatus, errorThrown);
            $('#poster-20').html('<div class="alert alert-danger">Failed to load related movies.</div>');
        });
    }

    // Function to display related movies
    function displayRelatedMovies(movies) {
        let moviesHtml = '';
        movies.forEach(movie => {
            if (movie.poster_path) {
                moviesHtml += `
                    <div class="movie-card" data-movie-id="${movie.id}">
                        <img src="${imageBaseUrl}${movie.poster_path}" alt="${movie.title}">
                        <p>
                            <strong>${movie.title}</strong>
                        </p>
                    </div>
                `;
            }
        });
        $('#poster-20').html(moviesHtml);

        // Add click event to related movie cards
        $('.movie-card').on('click', function() {
            const relatedMovieId = $(this).data('movie-id');
            console.log('Navigating to related movie ID:', relatedMovieId); // Debugging
            window.location.href = `individual.html?movieId=${relatedMovieId}`;
        });
    }

    // Function to get bookmarks from localStorage
    function getBookmarks() {
        const bookmarks = localStorage.getItem('bookmarks');
        return bookmarks ? JSON.parse(bookmarks) : [];
    }

    // Function to add a bookmark
    function addBookmark(movieId) {
        let bookmarks = getBookmarks();
        if (!bookmarks.includes(movieId)) {
            bookmarks.push(movieId);
            localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
            return true;
        }
        return false;
    }

    // Function to remove a bookmark
    function removeBookmark(movieId) {
        let bookmarks = getBookmarks();
        if (bookmarks.includes(movieId)) {
            bookmarks = bookmarks.filter(id => id !== movieId);
            localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
            return true;
        }
        return false;
    }

    // Event listener for "My List" button
    $('#myList').on('click', function() {
        const bookmarks = getBookmarks();
        if (bookmarks.includes(movieId)) {
            // Remove from bookmarks
            if (removeBookmark(movieId)) {
                $(this).addClass('btn-secondary').removeClass('btn-success').html('<i class="fas fa-bookmark" style="margin-right: 8px;"></i> My List');
                alert('Removed from My List.');
            }
        } else {
            // Add to bookmarks
            if (addBookmark(movieId)) {
                $(this).addClass('btn-success').removeClass('btn-secondary').html('<i class="fas fa-bookmark" style="margin-right: 8px;"></i> Bookmarked');
                alert('Added to My List.');
            }
        }
    });

    // Event listener for "Play" button
    $('#play').on('click', function() {
        // Redirect to the trailer if available
        const trailerSrc = $('#trailer').attr('src');
        if (trailerSrc) {
            window.open(trailerSrc, '_blank');
        } else {
            alert('Trailer not available.');
        }
    });

    // Event listener for "Tick" button (assuming it's for confirmation or similar)
    $('#tick').on('click', function() {
        alert('Action confirmed.');
    });

    // Initiate fetching movie details
    fetchMovieDetails(movieId);
});
