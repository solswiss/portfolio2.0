import { data } from './data.js';


// create a filter by, dropdown? or radio.. radio could be fun!
const projects = data.projects;
const webdev = projects.webdev;
const gamedev = projects.gamedev;
const general = projects.general;
const electronics = projects.electronics;
const misc = null; // nothing yet
const project_counts = {};
let project_count = 0;

//console.log(Object.keys(projects))
// may change project_counts to be a general stats container
project_counts.webdev = Object.keys(webdev).length;
project_counts.gamedev = Object.keys(gamedev).length;
project_counts.general = Object.keys(general).length;
project_counts.electronics = Object.keys(electronics).length;
Object.values(project_counts).forEach((e) => project_count += e);

/** projects */
const projects_toggle_list_view = document.getElementById("projects-toggle-list-view");
const projects_toggle_grid_view = document.getElementById("projects-toggle-grid-view");
const projects_listed_container = document.getElementById("projects-listed");
const projects_all = document.getElementsByClassName("projects-listed-item");

projects_toggle_list_view.addEventListener('click', () => {
    for (const e of projects_all) {
        e.classList.add("hidden");
        setTimeout(() => {
            projects_listed_container.style.gridTemplateColumns = "100%";
            e.classList.remove("hidden");
        }, 500);
    }
});

projects_toggle_grid_view.addEventListener('click', () => {
    for (const e of projects_all) {
        e.classList.add("hidden");
        setTimeout(() => {
            projects_listed_container.style.gridTemplateColumns = "50% 50%";
            e.classList.remove("hidden");
        }, 500);
    }
});


/** for project pages, not fully implemented yet :p */
function fadeLoad(href) {
    const content = document.body;
    content.classList.add('page-hidden');
    setTimeout(() => {
        window.location.href = href;
    }, 500);
}

function fadeOut() {
    for (const e of projects_all) {
        e.classList.add("hidden");
        setTimeout(() => {
            e.classList.remove("hidden");
        }, 500);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    /**<div class="projects-listed-item col">
                    <img src="assets/sharkboo.png" alt="placeholder">
                    <div class="project-title label">title</div>
                    <p class="project-desc">description</p>
                </div> */
    for (const [genre, arr] of Object.entries(projects)) {
        arr.forEach((project) => {
            let div = document.createElement("div");
            div.classList.add("projects-listed-item", "col");
            if (Object.keys(project).includes("spotlight")) {
                let img = document.createElement("img");
                img.src = project.spotlight; //"assets/projects/"+project.preview-spotlight;
                div.appendChild(img); // no alt text :/
            }
            let text_div = document.createElement("div");
            text_div.classList = "preview-text";
            let title = document.createElement("div");
            title.classList.add("project-title", "label");
            title.textContent = project.name;
            let p = document.createElement("p");
            p.classList = "project-desc";
            p.innerHTML = project.desc;
            text_div.appendChild(title);
            text_div.appendChild(p);
            div.appendChild(text_div);
            projects_listed_container.appendChild(div);
        })
    }
})
/**
 * "projects": {
        "webdev": [],
        "gamedev": [
            {
                "name":"We're So Back (Almost)",
                "badges": ["java","metal"],
                "desc":"Roguelike 2D pixel platformer x dungeon-crawler with a necromancer theme! Co-developed entirely in Java for an end-of-year game jam. The final version was put through vigorous playtesting and received great reactions&mdash;most notably that it was considered one of the best games overall! <span class='emoji'><^^></span> Put on indefinite hiatus."
            },
        ],
        "general": [
            {
                "name":"Photomosiac Generator",
                "badges": ["python","pillow"],
                "desc":"tba"
            }
        ],
        "electronics": [
            {
                "name":"Merce macropad",
                "badges":["kicad","pcb"],
                "desc":"tba"
            },
            {
                "name":"Grais mini fidgetboard",
                "badges":["kicad","pcb"],
                "desc":"tba"
            }
        ]
    },
 */