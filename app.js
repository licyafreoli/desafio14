const apiKey = 'aa3b21ced9c7c324107a9247802ceaec';
const baseUrl = 'https://api.themoviedb.org/3';

document.addEventListener('DOMContentLoaded', () => {
    fetchPopularMovies();
    document.getElementById('search-bar').addEventListener('input', searchMovies);
    document.getElementById('back-button').addEventListener('click', () => {
        document.getElementById('movie-details').style.display = 'none';
        document.getElementById('popular-movies').style.display = 'block';
    });
});

function fetchPopularMovies() {
    fetch(`${baseUrl}/movie/popular?api_key=${apiKey}`)
        .then(response => response.json())
        .then(data => displayMovies(data.results))
        .catch(error => console.error('Error fetching popular movies:', error));
}

function searchMovies(event) {
    const query = event.target.value;
    if (query.length > 2) {
        fetch(`${baseUrl}/search/movie?api_key=${apiKey}&query=${query}`)
            .then(response => response.json())
            .then(data => displayMovies(data.results))
            .catch(error => console.error('Error searching movies:', error));
    } else {
        fetchPopularMovies();
    }
}

function displayMovies(movies) {
    const movieList = document.getElementById('movie-list');
    movieList.innerHTML = '';
    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.className = 'movie-card';
        movieCard.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
            <h3>${movie.title}</h3>
            <p>${movie.release_date}</p>
            <button onclick="showDetails(${movie.id})">Ver Detalhes</button>
        `;
        movieList.appendChild(movieCard);
    });
}

function showDetails(movieId) {
    fetch(`${baseUrl}/movie/${movieId}?api_key=${apiKey}&append_to_response=credits`)
        .then(response => response.json())
        .then(data => {
            const detailsSection = document.getElementById('movie-details');
            const movieDetails = document.getElementById('details');
            movieDetails.innerHTML = `
                <h2>${data.title}</h2>
                <p>${data.overview}</p>
                <h3>Elenco:</h3>
                <ul>
                    ${data.credits.cast.map(cast => `<li>${cast.name} como ${cast.character}</li>`).join('')}
                </ul>
                <img src="https://image.tmdb.org/t/p/w500${data.poster_path}" alt="${data.title}">
            `;
            document.getElementById('popular-movies').style.display = 'none';
            detailsSection.style.display = 'block';
        })
        .catch(error => console.error('Error fetching movie details:', error));
}
