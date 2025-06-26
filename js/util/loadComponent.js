export async function loadComponent(name, selector = body, position = beforeend) {
    try {
        //Load the HTML text into a position in the DOM
        const res = await fetch(`./html/${name}.html`);
        if (!res.ok) throw new Error(`HTML component not found: ${name}`);

        const html = await res.text();
        const container = document.querySelector(selector);

        if (!container) {
            console.warn(`${container} was not found in the DOM`);
            return;
        }

        container.insertAdjacentHTML(position, html);

        //Add link tag for CSS file relating to component
        const existing = document.querySelector(`link[data-component="${name}"]`);
        if (!existing) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = `./css/${name}.css`;
            link.dataset.component = name;
            document.head.appendChild(link);
        }

    } catch (err) {
        console.error(`loadComponent error: ${err.message}`);
    }
};