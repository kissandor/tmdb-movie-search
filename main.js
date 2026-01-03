const searchInput = document.querySelector(".search-input");
const searchBtn = document.querySelector(".search-btn");
const result = document.querySelector(".result");

searchBtn.addEventListener("click", handleClick);

displayPopularMovies();

async function handleClick() {

    clearScreen(result)

    const querry = searchInput.value.trim();
    if (!querry) return;

    const movies = await getMovieDetails(querry);

    if (!movies || !movies.results || movies.results.length === 0) {
        console.log("error");
        return;
    }

    for (let i = 0; i < movies.results.length; i++) {
        const movie = movies.results[i];
        displayMovieDetails(movie);
    }

    clearInput(searchInput);
}

function displayMovieDetails(movie) {

    const resultContainer = createMovieCard();
    fillMovieCard(resultContainer, movie);

    result.appendChild(resultContainer);
}

function createMovieCard(){
    const wrapper = document.createElement("div");
    wrapper.classList.add("result-container");

    wrapper.innerHTML = `    
                    <div class="poster"><img>
                    </div>
                    <div class="details">
                        <p class="title"></p>
                        <p class="release-date"></p>
                        <p class="overview"></p>
                    </div>
    `;

    return wrapper;
}

function fillMovieCard(movieCard, movie){

    movieCard.querySelector("img").src = poster(movie);
    movieCard.querySelector("img").alt = movie.title;
    movieCard.querySelector(".title").textContent = movie.title;

    movieCard.querySelector(".release-date").textContent =
        movie.release_date || "Unknown";

    movieCard.querySelector(".overview").textContent =
        movie.overview || "No details available";
}

function poster(movie) {
    return movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "img/default_poster.png";
    }

function clearScreen(container) {
    container.replaceChildren();
}

function clearInput(inputForm) {
    inputForm.value = "";
}

async function displayPopularMovies(){

    const movies = await getPopularFilmsData();

    if (!movies || !movies.results || movies.results.length === 0) {
        console.log("error");
        return;
    }

    for (let i = 0; i < movies.results.length; i++) {
        const movie = movies.results[i];
        displayMovieDetails(movie);
    }
}