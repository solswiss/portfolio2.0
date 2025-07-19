import { data } from './data.js';


// create a filter by, dropdown? or radio.. radio could be fun!
const projects = data.projects;
const keys = Object.keys(projects);
const webdev = projects.webdev;
const gamedev = projects.gamedev;
const general = projects.general;
const electronics = projects.electronics;
const misc = null; // nothing yet
const project_counts = {};
let project_count = 0;
let cur_genre = "webdev";
let cur_idx = 0;
let cur_pid = cur_genre+cur_idx;

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

const page = document.querySelector("#project-page");

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

document.querySelector("#close-page").addEventListener('click', e => {
    $("#project-page").addClass("hidden");
    $("#project-page").removeClass("full-overlay");
})

function showPage() {
    $("#project-page").addClass("full-overlay");
    $("#project-page").removeClass("hidden");
}

document.querySelector("#prev-page").addEventListener('click', e => {
    if (cur_idx-1 < 0) {
        // switch genres
        const prev_genre = keys.at(keys.indexOf(cur_genre)-1);
        if (prev_genre) {
            cur_genre = prev_genre;
        } else {
            // go to end
            cur_genre = keys.at(projects.length);
        }
        cur_idx = projects[cur_genre].length-1;
    } else {
        cur_idx--;
    }
    cur_pid = cur_genre+cur_idx;
    loadPage();
})

document.querySelector("#next-page").addEventListener('click', e => {
    if (projects[cur_genre].length <= cur_idx+1) {
        // switch genres
        const next_genre = keys.at(keys.indexOf(cur_genre)+1);
        if (next_genre) {
            cur_genre = next_genre;
        } else {
            // go back to start
            cur_genre = "webdev";
        }
        cur_idx = 0;
    } else {
        cur_idx++;
    }
    cur_pid = cur_genre+cur_idx;
    loadPage();
})

function loadPage() {
    const project = projects[cur_genre][cur_idx];
    let title = document.createElement('div');
    title.id = "project-title";
    //title.classList.add('') //?
    title.textContent = project.name;
    let status = document.createElement('span'); // might change
    status.classList.add('project-status');
    switch (project.status) {
        case "fin":
            status.textContent = "concluded oh, this long ago";
            status.id = "status-fin";
            status.classList.add('fin-glow');
            break;
        case "wip":
            status.textContent = "ongoing";
            status.id = "status-wip";
            status.classList.add('wip-glow');
            break;
        case "hiatus":
            status.textContent = "paused";
            status.id = "status-hiatus";
            status.classList.add('hiatus-glow');
            break;
        case "quit":
            status.textContent = "terminated";
            status.id = "status-fin";
            status.classList.add('fin-glow');
            break;
    }
    let face = document.querySelector("div.project-face");
    $(face).empty();
    face.classList = "project-face";
    if (Object.keys(project).includes("spotlight")) {
        face.classList.add("spotlight");
        let spotlight = document.createElement('div');
        spotlight.classList.add("page-spotlight");
        let img = document.createElement('img');
        img.src = project.spotlight;
        spotlight.appendChild(img);
        let text = document.createElement('div');
        text.classList.add('face-text');
        text.appendChild(title);
        text.appendChild(status);
        face.appendChild(spotlight);
        face.appendChild(text);
    } else {
        face.appendChild(title);
        face.appendChild(status);
    }
    page.insertBefore(face, document.querySelector("#project-desc"));
    document.querySelector("#project-desc > p.project-desc").innerHTML = project.desc;
    document.querySelector("#project-type > span.project-type").textContent = "???"; // project.type
    
    let duration_text = "-- / --";
    let source, live;
    let externals = document.querySelector(".project-externals");
    $(externals).empty();
    if (Object.keys(project).includes("related")) {
        const related = project.related;

        if (Object.keys(related).includes("docr")) {
            duration_text = related.docr;
        } else if (Object.keys(related).includes("year")) {
            if (Object.keys(related).includes("season")) {
                duration_text = related.season + " " + related.year;
            } else {
                duration_text = related.year;
            }
        } else {
            duration_text = "??"
        }
        if (Object.keys(related).includes("doco")) {
            duration_text += " / "+related.doco;
        } else if (Object.keys(related).includes("updd")) {
            duration_text += "..."+related.updd;
        }
        else {
            duration_text += " / --";
        }
        // needs changing
        if (Object.keys(related).includes("source")) {
            source = document.createElement('a');
            source.classList.add('project-source');
            source.href = related.source;
            source.textContent = "source";
            const li = document.createElement('li');
            li.appendChild(source);
            externals.appendChild(li);
        }
        if (Object.keys(related).includes("live")) {
            live = document.createElement('a');
            live.classList.add('project-live');
            live.href = related.live;
            live.textContent = "live";
            const li = document.createElement('li');
            li.appendChild(live);
            externals.appendChild(li);
        }        
    }
    document.querySelector("#project-age > span.project-age").textContent = duration_text;
    // needs changing
    const badges = document.querySelector("#project-badges > div.project-badges");
    $(badges).empty();
    for (let b of project.badges) {
        const badge = document.createElement('span');
        b = b.replace(/[\s]/g,'-');
        badge.classList.add('project-badge', b+"-badge");
        badge.textContent = b;
        badges.appendChild(badge);
    }
}


document.addEventListener("DOMContentLoaded", () => {
    /**<div class="projects-listed-item col">
                    <img src="assets/sharkboo.png" alt="placeholder">
                    <div class="project-title label">title</div>
                    <p class="project-desc">description</p>
                </div> */
    for (const [genre, arr] of Object.entries(projects)) {
        let uid = 0;
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
            div.id = genre+uid++;
            projects_listed_container.appendChild(div);
        })
    }

    $(".projects-listed-item").click(function(){
        const id = $(this).attr('id');
        const genre = id.replace(/[^A-Za-z]/g, '');
        const idx = id.replace(/[A-Za-z]/g, '');
        cur_genre = genre;
        cur_idx = idx;
        cur_pid = genre+idx;

        loadPage();
        showPage();
    });
})

