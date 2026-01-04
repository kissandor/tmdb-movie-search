const searchInput = document.querySelector(".search-input");
const searchBtn = document.querySelector(".search-btn");
const resultList = document.querySelector(".result-list");
const loader = document.querySelector(".loader");

searchBtn.addEventListener("click", handleClick);


const state = {
    loading: false,
    errors: null,
    movies: []
};


async function handleClick() {

    const querry = searchInput.value.trim();
    if (!querry) return;

    setState({ loading: true, errors: null, movies: [] });

    try {
        await delay(3000);
        const moviesData = await getMovieDetails(querry);
        setState({ loading: false, errors: null, movies: moviesData.results });
    } catch (err) {
        setState({ loading: false, errors: err });
    }

    clearInput(searchInput);
}

function render() {
    loader.style.display = state.loading ? "block" : "none";

    resultList.replaceChildren();

    if (state.errors) {
        const errorMsg = document.createElement("p");
        errorMsg.textContent = state.errors;
        resultList.appendChild(errorMsg);
        return;
    }
    state.movies.forEach(movie => displayMovieDetails(movie));
}


(async () => {
    setState({ loading: true })
    try {
        await delay(3000);
        const movies = await getPopularFilmsData();
        setState({ loading: false, movies: movies.results });
    } catch (err) {
        setState({ errors: err })
    }
})();


function setState(newState) {
    Object.assign(state, newState);
    render();
}

function clearInput(inputForm) {
    inputForm.value = "";
}

function createMovieCard() {
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

function fillMovieCard(movieCard, movie) {

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

function displayMovieDetails(movie) {

    const card = createMovieCard();
    fillMovieCard(card, movie);

    resultList.appendChild(card);
}



function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}