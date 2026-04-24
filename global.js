export async function fetchJSON(url) {
  try {
    // Fetch the JSON file from the given URL
    const response = await fetch(url);
    console.log(response);

    // Check if the request was successful
    if (!response.ok) {
      throw new Error(`Failed to fetch projects: ${response.statusText}`);
    }

    // Parse the response as JSON
    const data = await response.json();

    return data;
  } catch (error) {
    console.error('Error fetching or parsing JSON data:', error);
  }
}


document.addEventListener("DOMContentLoaded", () => {
  console.log('IT’S ALIVE!');

  document.body.insertAdjacentHTML(

    'afterbegin',

    `

    <label class="color-scheme">

      Theme:

      <select>

        <option value="light dark">Automatic</option>

        <option value="light">Light</option>

        <option value="dark">Dark</option>

      </select>

    </label>`

  );

  let select = document.querySelector('.color-scheme select');

  if ("colorScheme" in localStorage) {
    document.documentElement.style.setProperty('color-scheme', localStorage.colorScheme);
    select.value = localStorage.colorScheme;
  }

  select.addEventListener('input', function (event) {
    console.log('color scheme changed to', event.target.value);
    document.documentElement.style.setProperty('color-scheme', event.target.value);
    localStorage.colorScheme = event.target.value;
  });




  // 3.1.1 Define pages
  const pages = [
    { url: "", title: "Home" },
    { url: "projects/", title: "Projects" },
    { url: "contacts/", title: "Contact" },
    { url: "resume/", title: "Resume" },
    { url: "https://github.com/haw129-spec/portfolio", title: "Github" }
  ];
  const BASE_PATH = (location.hostname === "localhost" || location.hostname === "127.0.0.1")
    ? "/"
    : "/portfolio/";

  let nav = document.createElement("nav");
  document.body.prepend(nav);
  for (let p of pages) {
    let url = p.url;
    let title = p.title;

    if (!url.startsWith('http')) {
      url = BASE_PATH + url;
    }

    let a = document.createElement('a');
    a.href = url;
    a.textContent = title;
    nav.append(a);

    a.classList.toggle(
      'current',
      a.host === location.host && a.pathname === location.pathname,
    );

    if (a.host !== location.host) {
      a.target = '_blank';
    }


  }

  
});




export function renderProjects(projects, containerElement, headingLevel = 'h2') {
  // Validate container
  if (!containerElement) {
    console.error('Container element not found');
    return;
  }

  // Validate heading level
  const validHeadings = ['h1','h2','h3','h4','h5','h6'];
  if (!validHeadings.includes(headingLevel)) {
    headingLevel = 'h2';
  }

  // Clear existing content
  containerElement.innerHTML = '';

  // Loop through projects
  for (let project of projects) {
    const article = document.createElement('article');

    article.innerHTML = `
      <${headingLevel}>${project.title || 'No Title'}</${headingLevel}>
      <img src="${project.image || ''}" alt="${project.title || 'Project image'}">
      <p>${project.description || 'No description available'}</p>
    `;

    containerElement.appendChild(article);
  }
}


export async function fetchGitHubData(username) {
  return fetchJSON(`https://api.github.com/users/${username}`);
}