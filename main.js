const searchInput = document.querySelector(".search-input");
const searchBtn = document.querySelector(".search-btn");
const resultList = document.querySelector(".result-list");
const loader = document.querySelector(".loader");
const loadMoreBtn = document.querySelector(".load-more-btn");

searchBtn.addEventListener("click", handleClick);

loadMoreBtn.addEventListener("click", handleLoadMoreClick);


const state = {
    loading: false,
    errors: null,
    movies: [],
    query: "",
    page: 1,
    totalPages: 0
};

async function handleClick() {

    const querry = searchInput.value.trim();
    if (!querry) return;

    setState({ loading: true, errors: null, movies: [], query: querry, page: 1 });

    try {
        await delay(1500);
        const moviesData = await getMovieDetails(querry);
        setState({ loading: false, errors: null, movies: moviesData.results, totalPages: moviesData.total_pages });
    } catch (err) {
        setState({ loading: false, errors: err });
    }

    clearInput(searchInput);
}

async function handleLoadMoreClick() {
    setState({ loading: true, page: state.page + 1 });
    try {
        const moviesData = await getMovieDetails(state.query, state.page);
        setState({ loading: false, errors: null, movies: state.movies.concat(moviesData.results) });
        console.log(state);
    } catch (err) {
        setState({ loading: false, errors: err });
    }
}

function render() {
    loader.style.display = state.loading ? "block" : "none";
    
    resultList.replaceChildren();
    console.log(state);
    if (state.loading || state.page >= state.totalPages) {
        loadMoreBtn.style.display = "none";
    } else {
        loadMoreBtn.style.display = "block";
    }
    

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
        await delay(1500);
        const movies = await getPopularFilmsData();
        // console.log(movies);
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