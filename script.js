import { data } from './data.js';


let achievements = []; // keeps track of achievements

/** trivial stuff */
const trivia = data.trivia.array;
let trivia_all = `<div>
            <ul class="indent-naked">`;
for (const e of trivia) {
    trivia_all = trivia_all.concat(`<li class="word-wrapper">${e}</li>`);
}
trivia_all = trivia_all.concat(`</ul></div>`);
let trivia_punchout = new Set(); // stores seen indices
let trivia_i0 = -1; // previous index
let trivia_clicks = 0;


const textScare = (selector, application) => {
    const containers = document.querySelectorAll(selector); // get all containers validated by selector filter

    containers.forEach((container) => {
        let elements = []; // individual words or letters
        let elementType = ""; // defines whether the elements are words or letters
        let fontSize = parseFloat(window.getComputedStyle(container).fontSize);
        
        if (application === "worten") {
            elements = container.textContent.trim().split(/\s+/);
            elementType = "wort";
        } else if (application === "chars") {
            const words = container.textContent.trim().split(/\s+/);
            words.forEach((word, i) => {
                for (let i=0; i<word.length; i++) {
                    elements.push(word[i]); // push each char
                }
                if (i<words.length-1 && container.textContent.includes(" ")) {
                    elements.push(" "); // maintain spaces
                }
            });
            elementType = "char";
        }
        container.textContent = "";

        const translatedElements = [];
        elements.forEach((element, i) => {
            if (application === "chars" && element === " ") {
                container.appendChild(document.createTextNode(" "));
                return;
            }
            const span = document.createElement("span");
            span.classList.add(elementType); // apply the corresponding css
            span.textContent = element;
            container.appendChild(span);

            if (application === "worten" && i < elements.length - 1) {
                container.appendChild(document.createTextNode(" "));
            }

            translatedElements.push({
                element:span,
                ri:0,r:0,rf:0,
                xi:0,yi:0,x:0,y:0,xf:0,yf:0,
            });
        });

        setTimeout(() => {
            translatedElements.forEach((e) => {
                const rect = e.element.getBoundingClientRect();
                e.xi = rect.left + rect.width/2; // center
                e.yi = rect.top + rect.height/2;
                e.x = e.y = e.xf = e.yf = 0;
            });
        }, 100);

        document.addEventListener("mousemove", (e) => {
            const mx = e.clientX; // capture
            const my = e.clientY;

            // textScare
            const r = Math.max(150, fontSize * 0.8); // radius of effect
            const mdeld = Math.sqrt(fontSize) * 350; // max displacement
            translatedElements.forEach((element) => {
                const xi = element.xi;
                const yi = element.yi;
                const dx = xi - mx;
                const dy = yi - my;
                const dist = Math.sqrt(dx*dx+dy*dy);
                if (dist < r) {
                    const force = (1 - dist / r) * mdeld; // effect intensity varies by distance
                    element.rf = (dx + dy) / 500 * force;
                    element.xf = dx/dist*force;
                    element.yf = dy/dist*force;
                } else {
                    element.rf = 0;
                    element.xf = 0; // return to original position xi,yi
                    element.yf = 0;
                }
            });
        });

        document.addEventListener("scroll", (e) => {
            translatedElements.forEach((e) => {
                const rect = e.element.getBoundingClientRect();
                e.xi = rect.left + rect.width/2; // center
                e.yi = rect.top + rect.height/2;
                e.x = e.y = e.xf = e.yf = 0; 
            })
        })

        // smooth animation
        const animate = () => {
            let lerp = 0.07; // move 10% to target position, gradual changes
            translatedElements.forEach((element) => {
                if (element.xf === 0 && element.yf === 0) lerp = 0.05;
                element.r = (element.rf - element.r) * lerp;
                element.x = (element.xf - element.x) * lerp;
                element.y = (element.yf - element.y) * lerp;

                element.element.style.transform = `translate(${element.x}px,${element.y}px) rotate(${element.r}deg)`
            });
            requestAnimationFrame(animate);
        };

        animate();
    });
}

function applyTextScare() {
    textScare(".char-wrapper", "chars");
    textScare(".word-wrapper", "worten");
}


document.addEventListener("DOMContentLoaded", () => {
    const trivia_fetcher = document.getElementById("trivia-fetcher");
    const trivia_container = document.getElementById("trivia-container");
    const trivia_toggle = document.getElementById("trivia-toggle-all");

    // this kind of function could be made into an obj if i put more of it in the site
    // fetch random trivia from array
    trivia_fetcher.addEventListener("click", function (e) {
        trivia_toggle.classList.remove("active"); // turn that off

        if (trivia_punchout.size >= trivia.length) {
            if (trivia_punchout.has(-1)) {
                // reset
                trivia_punchout = new Set(); // stores seen indices
                trivia_clicks = 0;
                trivia_container.innerHTML = `you're going again?? really??????`;
            } else {
                trivia_container.innerHTML = 
                `<span class='uppercase bold'>congrats!</span> 
                you've seen all the trivia!!! 
                and it only took <span class='bold'>${trivia_clicks}</span> clicks!!!!!!`;
                trivia_punchout.add(-1);

                if (trivia_toggle.classList.contains("locked")) {
                    trivia_toggle.classList.remove("locked");
                    trivia_toggle.removeAttribute("disabled");
                    trivia_toggle.classList.add("clear-btn");
                }
            }
        } else {
            trivia_clicks++;
            let i1;
            do {
                i1 = Math.floor(Math.random()*trivia.length);
            } while (i1 == trivia_i0); 
            trivia_i0 = i1; // ban repeat trivias
            trivia_punchout.add(i1);
            trivia_container.innerHTML = trivia[i1];
        }
        applyTextScare();
    });

    trivia_toggle.addEventListener("click", function (e) {
        // no need to check since when locked user cannot interact (hopefully)
        trivia_toggle.classList.toggle("active");
        if (trivia_toggle.classList.contains("active")) {
            trivia_container.innerHTML = trivia_all;
            applyTextScare();
        } else {
            trivia_container.innerHTML = "";
        }
    })

    textScare(".char-wrapper", "chars");
    textScare(".word-wrapper", "worten");
});

