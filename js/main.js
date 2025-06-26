import { loadComponent } from "./util/loadComponent.js";

document.addEventListener('DOMContentLoaded', async () => {
    //await loadComponent('header', 'body', 'afterbegin');
    await loadComponent('home', '.portfolio__container--elements', 'beforeend');
    await loadComponent('aboutme', '.portfolio__container--elements', 'beforeend');
    await loadComponent('projects', '.portfolio__container--elements', 'beforeend');
    await loadComponent('skills', '.portfolio__container--elements', 'beforeend');
    await loadComponent('contact', '.portfolio__container--elements', 'beforeend');

    //Creates custom cursor
    const cursor = document.querySelector('.custom-cursor');
    const moveCursor = (e) => {
        const mousey = e.clientY;
        const mousex = e.clientX;

        cursor.style.left = `${mousex}px`;
        cursor.style.top = `${mousey}px`;
    };

    window.addEventListener('mousemove', moveCursor);

    //Creates a rain effect background for the portfolio
    function spawndot() {
        const dot = document.createElement('div');
        dot.classList.add('background-dot');

        const xPos = Math.random() * 100;
        dot.style.left = `${xPos}vw`;
        dot.style.top = '-10px';

        const duration = 8 + Math.random() * 4;
        dot.style.animationDuration = `${duration}s`;

        const randColor = [Math.random() * 255, Math.random() * 255, Math.random() * 255];
        dot.style.background = `rgb(${randColor[0]}, ${randColor[1]}, ${randColor[2]})`

        document.querySelector('.background-dot__wrapper').appendChild(dot);

        setTimeout(() => dot.remove(), duration * 1000);
    };

    setInterval(spawndot, 200);

    //Sets up active states for 'scroll' buttons
    const scrollItems = document.querySelectorAll('.portfolio__container--circle');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const id = entry.target.dataset.nav;
                document.querySelectorAll('.portfolio__container--circle').forEach((circle) => {
                    circle.classList.remove('active');
                });

                const activeCircle = document.getElementById(id);
                if (activeCircle) {
                    activeCircle.classList.add('active');
                };

                entry.target.classList.add('animate');

            } else {
                entry.target.classList.remove('animate');
            }
        });
    }, {
        root: null,
        threshold: 0.6
    });

    document.querySelectorAll('.section').forEach((section) => {
        observer.observe(section);
    });

    scrollItems.forEach((item) => {
        item.addEventListener('click', (e) => {
            const section = document.getElementById(`${e.target.id}-section`);
            if (section) {
                section.scrollIntoView({ behavior: 'smooth' });
            }

        })
    });

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

    //Open file previews for CV and Certs downloads
    const downloadFile = document.querySelectorAll('.aboutme__downloads-img');
    const previewContainer = document.querySelector('.aboutme__filepreview-container');
    const embed = document.querySelector('.aboutme__filepreview-embed');
    const closeBtn = document.querySelector('.aboutme__filepreview-close');

    downloadFile.forEach((download) => {
        download.addEventListener('click', (e) => {
            let filePath = '';
            let fileName = '';

            if (e.target.id === 'cv') {
                filePath = './assets/Harry CV - 2025 (Harvard).pdf';
                fileName = 'Harry CV - 2025 (Harvard).pdf';
            }

            if (e.target.id === 'codecademy') {
                filePath = './assets/harry_codecademy_certificate.pdf';
                fileName = 'harry_codecademy_certificate.pdf';
            }

            if (filePath) {
                embed.src = filePath;
                previewContainer.classList.remove('hidden');
            }
        });
    });

    closeBtn.addEventListener('click', () => {
        previewContainer.classList.add('hidden');
    });


    //Projects
    const projectPage = document.getElementById('projects-section');

    const projects = {
        project1: {
            name: "To-Do App",
            description: "A To-Do List App, implementing localStorage persistence, drag & drop functionality and animated feedback.",
            link: "https://harry-todo.netlify.app/"
        },
        project2: {
            name: "DevNest",
            description: "A Full-Stack app designed as a social media website; using React, Express and PostgreSQL.",
            link: "https://devnest-frontend.onrender.com/"
        },
    };

    Object.values(projects).forEach((project) => {
        const projectCard = document.createElement('div');
        projectCard.classList.add('projects__card');

        const cardTitle = document.createElement('h3');
        const cardDesc = document.createElement('p');
        const cardLink = document.createElement('a');

        cardTitle.innerHTML = project.name;
        cardDesc.innerHTML = project.description;
        cardLink.href = project.link;
        cardLink.innerHTML = "View Project →";
        cardLink.target = "_blank";

        projectCard.appendChild(cardTitle);
        projectCard.appendChild(cardDesc);
        projectCard.appendChild(cardLink);

        projectPage.appendChild(projectCard);
    })

});