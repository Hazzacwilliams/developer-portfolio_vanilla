import { loadComponent } from "./util/loadComponent.js";

document.addEventListener('DOMContentLoaded', async () => {
    //await loadComponent('header', 'body', 'afterbegin');
    await loadComponent('home', '.portfolio__container--elements', 'beforeend');
    await loadComponent('aboutme', '.portfolio__container--elements', 'beforeend');
    await loadComponent('projects', '.portfolio__container--elements', 'beforeend');
    //await loadComponent('skills', '.portfolio__container--elements', 'beforeend');
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

    const icons = document.querySelector('.contactbuttons__container');

    const iconObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                icons.classList.add('in-contact');
            } else {
                icons.classList.remove('in-contact');
            }
        });
    }, { threshold: 0.5 });

    iconObserver.observe(document.getElementById('contact-section'));

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
            name: "ToDoApp",
            description: "A To-Do List App, implementing localStorage persistence, drag & drop functionality and animated feedback.",
            skills: ['JavaScript', 'HTML5', 'CSS3', 'Netlify'],
            image: './assets/todoapp.png'
        },
        project2: {
            name: "DevNest",
            description: "A Full-Stack app designed as a social media website; using React, Express and PostgreSQL.",
            skills: ['React', 'Redux', 'JavaScript', 'CSS3', 'Component Based Architecture', 'Express.js', 'PostgreSQL', 'GitHub', 'Render'],
            image: './assets/devnest.png'
        },
    };

    Object.values(projects).forEach((project) => {
        const projectCard = document.createElement('div'); //Card that will hold all details of the project
        projectCard.classList.add('projects__card');

        const projectCardText = document.createElement('div'); //Div for holding text info on project
        projectCardText.classList.add('projects__card-textcontainer');
        const projectCardSkills = document.createElement('div');
        projectCardSkills.classList.add('projects__card-skillcontainer'); //Div for holding project skills
        const projectCardImg = document.createElement('div');
        projectCardImg.classList.add('projects__card-imgcontainer'); //Div for holding img of project

        const cardTitle = document.createElement('h3');
        const cardDesc = document.createElement('p');

        const cardImg = document.createElement('img');

        cardTitle.classList.add('projects__card-title');
        cardDesc.classList.add('projects__card-desc');
        cardImg.classList.add('projects__card-img');

        cardTitle.innerHTML = project.name;
        cardDesc.innerHTML = project.description;

        const track = document.createElement('div'); //Track for marquee animation
        track.classList.add('projects__card-skilltrack');

        project.skills.forEach(skill => {   //Appends all skills to the track
            const cardSkill = document.createElement('h4');
            cardSkill.classList.add('projects__card-skill');
            cardSkill.innerHTML = skill;
            track.appendChild(cardSkill);
        });

        track.innerHTML += track.innerHTML; //Duplicates skills for animation

        projectCardSkills.appendChild(track); //Appends the track to the skills div

        cardImg.src = project.image;
        cardImg.alt = `Screenshot of ${project.name}`;

        cardImg.setAttribute('id', project.name);

        projectCardText.appendChild(cardTitle);
        projectCardText.appendChild(cardDesc);
        projectCardText.appendChild(projectCardSkills);
        projectCardImg.appendChild(cardImg);

        projectCard.appendChild(projectCardText);
        projectCard.appendChild(projectCardImg);

        projectPage.appendChild(projectCard);
    });

    document.querySelectorAll('.projects__card-imgcontainer').forEach(proj => {
        proj.addEventListener('click', (e) => {
            switch (e.target.id) {
                case 'ToDoApp':
                    window.open("https://harry-todo.netlify.app/");
                    break;
                case 'DevNest':
                    window.open("https://devnest-frontend.onrender.com/");
                    break;
            }

        })
    })

    //Skills
    const skills = ['JavaScript', 'HTML5', 'CSS3', 'Node.js', 'Express', 'React', 'GitHub', 'PostgreSQL', 'AWS'];


});