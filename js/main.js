import { loadComponent } from "./util/loadComponent.js";
import { initBackgroundAnimation } from "./util/backgroundAnimation.js";

document.addEventListener('DOMContentLoaded', async () => {
    //await loadComponent('header', 'body', 'afterbegin');
    await loadComponent('home', '.portfolio__container--elements', 'beforeend');
    await loadComponent('aboutme', '.portfolio__container--elements', 'beforeend');
    await loadComponent('projects', '.portfolio__container--elements', 'beforeend');
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

    //Initialize canvas-based background animation for better performance
    initBackgroundAnimation();

    //Sets up active states for 'scroll' buttons
    const scrollItems = document.querySelectorAll('.portfolio__container--circle');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const id = entry.target.dataset.nav;
                document.querySelectorAll('.portfolio__container--circle').forEach((circle) => {
                    circle.classList.remove('active');
                    circle.setAttribute('aria-current', 'false');
                });

                const activeCircle = document.getElementById(id);
                if (activeCircle) {
                    activeCircle.classList.add('active');
                    activeCircle.setAttribute('aria-current', 'true');
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
                // Update aria-current for active navigation
                scrollItems.forEach((circle) => {
                    circle.setAttribute('aria-current', 'false');
                });
                e.target.setAttribute('aria-current', 'true');
            }

        });
        
        // Add keyboard support
        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const section = document.getElementById(`${e.target.id}-section`);
                if (section) {
                    section.scrollIntoView({ behavior: 'smooth' });
                    scrollItems.forEach((circle) => {
                        circle.setAttribute('aria-current', 'false');
                    });
                    e.target.setAttribute('aria-current', 'true');
                }
            }
        });
    });

    //Smooth scrolling for file downloads div
    const container = document.querySelector('.aboutme__downloads-cards');
    const leftArrow = document.querySelector('#leftarrowcontainer');
    const rightArrow = document.querySelector('#rightarrowcontainer');
    
    if (container && leftArrow && rightArrow) {
        const cardWidth = container.querySelector('.aboutme__downloads-button')?.offsetWidth || 0;

        const scrollLeft = () => {
            container.scrollBy({
                left: -cardWidth,
                behavior: 'smooth'
            });
        };

        const scrollRight = () => {
            container.scrollBy({
                left: cardWidth,
                behavior: 'smooth'
            });
        };

        leftArrow.addEventListener('click', scrollLeft);
        rightArrow.addEventListener('click', scrollRight);
        
        // Add keyboard support
        leftArrow.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                scrollLeft();
            }
        });
        
        rightArrow.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                scrollRight();
            }
        });
    }

    //Open file previews for CV and Certs downloads
    const downloadButtons = document.querySelectorAll('.aboutme__downloads-img-button');
    const previewContainer = document.querySelector('.aboutme__filepreview-container');
    const embed = document.querySelector('.aboutme__filepreview-embed');
    const closeBtn = document.querySelector('.aboutme__filepreview-close');
    const filePreviewTitle = document.getElementById('filepreview-title');

    if (downloadButtons && previewContainer && embed && closeBtn) {
        downloadButtons.forEach((button) => {
            button.addEventListener('click', (e) => {
                const img = button.querySelector('img');
                if (!img) return;
                
                let filePath = '';
                let fileName = '';

                if (img.id === 'cv') {
                    filePath = './assets/Harry CV - 2025 (Harvard).pdf';
                    fileName = 'Harry CV - 2025 (Harvard).pdf';
                }

                if (img.id === 'codecademy') {
                    filePath = './assets/harry_codecademy_certificate.pdf';
                    fileName = 'harry_codecademy_certificate.pdf';
                }

                if (filePath) {
                    // Store which button opened the preview for focus return
                    previewContainer.dataset.lastFocusedButton = button.id;
                    embed.src = filePath;
                    embed.setAttribute('aria-label', `Preview of ${fileName}`);
                    if (filePreviewTitle) {
                        filePreviewTitle.textContent = `Preview: ${fileName}`;
                    }
                    previewContainer.classList.remove('hidden');
                    previewContainer.setAttribute('aria-hidden', 'false');
                    // Prevent body scroll when dialog is open
                    document.body.style.overflow = 'hidden';
                    // Focus the close button for keyboard users
                    setTimeout(() => closeBtn.focus(), 100);
                }
            });
        });

        const closePreview = () => {
            previewContainer.classList.add('hidden');
            previewContainer.setAttribute('aria-hidden', 'true');
            // Restore body scroll
            document.body.style.overflow = '';
            // Return focus to the button that opened the preview
            const lastFocusedButton = previewContainer.dataset.lastFocusedButton;
            if (lastFocusedButton) {
                const button = document.querySelector(`#${lastFocusedButton}`);
                if (button) button.focus();
            }
        };

        closeBtn.addEventListener('click', closePreview);
        
        // Close on Escape key and trap focus within dialog
        previewContainer.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closePreview();
            }
            // Trap focus within dialog (Tab key handling)
            if (e.key === 'Tab') {
                const focusableElements = previewContainer.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];
                
                if (e.shiftKey && document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                } else if (!e.shiftKey && document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        });
    }


    //Projects
    const projectPage = document.getElementById('projects-section');
    const projWrapper = document.querySelector('.projects__cards-wrapper');


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
        project3: {
            name: "Classic Snake",
            description: "The classic game 'Snake', designed to look 8-bit. The app implements canvas, localStorage and game mechanic functions.",
            skills: ['JavaScript', 'HTML5', 'CSS3', 'Canvas', 'Netlify', 'GitHub'],
            image: './assets/snakeapp.png'
        }
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
        cardImg.alt = `Screenshot of ${project.name} project`;
        cardImg.loading = 'lazy';
        cardImg.width = 800;
        cardImg.height = 600;

        cardImg.setAttribute('id', project.name);
        projectCardImg.setAttribute('role', 'button');
        projectCardImg.setAttribute('tabindex', '0');
        projectCardImg.setAttribute('aria-label', `View ${project.name} project`);

        projectCardText.appendChild(cardTitle);
        projectCardText.appendChild(cardDesc);
        projectCardText.appendChild(projectCardSkills);
        projectCardImg.appendChild(cardImg);

        projectCard.appendChild(projectCardText);
        projectCard.appendChild(projectCardImg);

        projWrapper.appendChild(projectCard);
    });

    document.querySelectorAll('.projects__card-imgcontainer').forEach(proj => {
        const openProject = (e) => {
            const img = proj.querySelector('img');
            if (!img) return;
            
            switch (img.id) {
                case 'ToDoApp':
                    window.open("https://harry-todo.netlify.app/", "_blank", "noopener,noreferrer");
                    break;
                case 'DevNest':
                    window.open("https://devnest-frontend.onrender.com/", "_blank", "noopener,noreferrer");
                    break;
                case 'Classic Snake':
                    window.open("https://harrycw-snake-game.netlify.app/", "_blank", "noopener,noreferrer");
                    break;
            }
        };
        
        proj.addEventListener('click', openProject);
        
        // Add keyboard support
        proj.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openProject(e);
            }
        });
    })

    const cards = Array.from(projWrapper.querySelectorAll('.projects__card'));

    const INTERVAL_MS = 3000;
    const SCROLL_BEHAVIOUR = 'smooth';

    let currentIndex = 0;
    let timerId = null;
    let userInteracting = false;

    const io = new IntersectionObserver((entries) => {
        const visible = entries
            .filter(e => e.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) {
            currentIndex = cards.indexOf(visible.target);
        }
    }, { root: projWrapper, threshold: Array.from({ length: 11 }, (_, i) => i / 10) });

    cards.forEach(card => io.observe(card));

    function goTo(index) {
        const i = (index + cards.length) % cards.length;
        projWrapper.scrollTo({ left: cards[i].offsetLeft, behavior: SCROLL_BEHAVIOUR });
        currentIndex = i;
    }

    function next() {
        goTo(currentIndex + 1);
    }

    function start() {
        if (timerId || userInteracting) return;
        timerId = setInterval(next, INTERVAL_MS);
    }

    function stop() {
        clearInterval(timerId);
        timerId = null;
    }

    projWrapper.addEventListener('mouseenter', () => { userInteracting = true; stop(); });
    projWrapper.addEventListener('mouseleave', () => { userInteracting = false; start(); });
    projWrapper.addEventListener('touchstart', () => { userInteracting = true; stop(); }, { passive: true });
    projWrapper.addEventListener('touchend', () => { userInteracting = false; start(); });

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) stop(); else start();
    });

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!prefersReduced.matches) start();

});