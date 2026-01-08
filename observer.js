
const observerOption = {
    root: null,
    rootMargin: '0px',
    threshold: 0.5,
}


const sentinelObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            onSentinelVisible();
        }
    });
}, observerOption);


const cardImageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        } else {
            entry.target.classList.remove("visible");
        }
    });
}, observerOption);

