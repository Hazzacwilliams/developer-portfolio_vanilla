//Smooth scrolling for file downloads div
    const container = document.querySelector('.aboutme__downloads-cards');
    const cardWidth = container.querySelector('.aboutme__downloads-button').offsetWidth;

    document.querySelector('#leftarrowcontainer').addEventListener('click', () => {
        container.scrollBy({
            left: -cardWidth,
            behavior: 'smooth'
        });
    });

    document.querySelector('#rightarrowcontainer').addEventListener('click', () => {
        container.scrollBy({
            left: cardWidth,
            behavior: 'smooth'
        });
    });