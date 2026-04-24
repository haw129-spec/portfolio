import { fetchJSON, renderProjects } from '../global.js';

// Fetch project data
const projects = await fetchJSON('../lib/projects.json');

const titleElement = document.querySelector('.projects-title');

titleElement.textContent = `Projects ${projects.length}`;

// Select container
const projectsContainer = document.querySelector('.projects');

// Render projects
renderProjects(projects, projectsContainer, 'h2');
