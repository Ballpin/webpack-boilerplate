import './styles/tailwind.pcss'
export const helloWorld = 'Hello World';

const div = document.createElement('div');
div.className = 'container mx-auto';
div.innerHTML = helloWorld;

document.body.prepend(div);