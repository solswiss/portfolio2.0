const cursor_menu = document.getElementById("csr-select");
const csr_default = document.querySelector("#csr-default");
const csr0 = document.querySelector("#csr0");
const csr1 = document.querySelector("#csr1");

csr_default.addEventListener('click', e => $("body, input, label, iframe").css("cursor","auto"));
csr0.addEventListener('click', e => set_csr(0));
csr1.addEventListener('click', e => set_csr(1));

function set_csr(value) {
    console.log(value);
    switch (value) {
        case 0:
            $("body, input, label, iframe").css("cursor","url('https://www.rw-designer.com/cursor-view/229089.png'),auto");
            break;
        case 1:
            $("body, input, label, iframe").css("cursor","url(https://ani.cursors-4u.net/cursors/cur-12/cur1103.ani), url(https://ani.cursors-4u.net/cursors/cur-12/cur1103.png), auto")
    }
}
