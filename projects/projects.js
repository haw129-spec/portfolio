import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

// Fetch project data
const projects = await fetchJSON('../lib/projects.json');

const titleElement = document.querySelector('.projects-title');

titleElement.textContent = `Projects ${projects.length}`;

// Select container
const projectsContainer = document.querySelector('.projects');

let query = '';
let searchInput = document.querySelector('.searchBar');
let selectedIndex = -1;

function getFilteredProjects() {
  let filtered = projects.filter((project) => {
    let values = Object.values(project).join('\n').toLowerCase();
    return values.includes(query.toLowerCase());
  });

  if (selectedIndex !== -1) {
    let rolled = d3.rollups(
      filtered,
      (v) => v.length,
      (d) => d.year,
    );

    let data = rolled.map(([year, count]) => {
      return { value: count, label: year };
    });

    let selectedYear = data[selectedIndex]?.label;
    if (selectedYear) {
      filtered = filtered.filter((project) => project.year === selectedYear);
    }
  }

  return filtered;
}

// Render projects
renderProjects(projects, projectsContainer, 'h2');

function renderPieChart(projectsGiven) {
  let newRolledData = d3.rollups(
    projectsGiven,
    (v) => v.length,
    (d) => d.year,
  );

  let newData = newRolledData.map(([year, count]) => {
    return { value: count, label: year };
  });

  let newSliceGenerator = d3.pie().value((d) => d.value);
  let newArcData = newSliceGenerator(newData);

  let newArcGenerator = d3.arc().innerRadius(0).outerRadius(50);
  let newArcs = newArcData.map((d) => newArcGenerator(d));

  let newSVG = d3.select('svg');
  newSVG.selectAll('path').remove();

  let legend = d3.select('.legend');
  legend.selectAll('li').remove();

  let colors = d3.scaleOrdinal(d3.schemeTableau10);

  newArcs.forEach((arc, idx) => {
    newSVG
      .append('path')
      .attr('d', arc)
      .attr('fill', colors(idx))
      .attr('class', idx === selectedIndex ? 'selected' : '')
      .on('click', () => {
        selectedIndex = selectedIndex === idx ? -1 : idx;

        newSVG
          .selectAll('path')
          .attr('class', (_, i) => (i === selectedIndex ? 'selected' : ''));

        legend
          .selectAll('li')
          .attr('class', (_, i) =>
            i === selectedIndex ? 'legend-item selected' : 'legend-item'
          );

        let filteredProjects = getFilteredProjects();
        renderProjects(filteredProjects, projectsContainer, 'h2');
        renderPieChart(filteredProjects);
      });
  });

  newData.forEach((d, idx) => {
    legend
      .append('li')
      .attr('style', `--color:${colors(idx)}`)
      .attr('class', idx === selectedIndex ? 'legend-item selected' : 'legend-item')
      .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`);
  });
}

renderPieChart(projects);

searchInput.addEventListener('input', (event) => {
  query = event.target.value;

  let filteredProjects = getFilteredProjects();
  renderProjects(filteredProjects, projectsContainer, 'h2');
  renderPieChart(filteredProjects);
});