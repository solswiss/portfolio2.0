let cursor = sessionStorage.getItem("cursor") ? sessionStorage.getItem("cursor") : "auto";

export function setCursor() {console.log("setting cursor to "+cursor);$("html").css("cursor",cursor);sessionStorage.setItem("cursor",cursor)}

const cursorRadios = document.getElementsByName('cursor');
for (const csr of cursorRadios) {
    csr.addEventListener('click',saveData);
}

function saveData() {
    const checkedCursor = $("input[type='radio']:checked").attr('id');
    if (checkedCursor !== null) {
        sessionStorage.setItem("checkedCursorID", checkedCursor);
    } else {
        sessionStorage.setItem("checkedCursorID", "csr-default");
    }
}

document.addEventListener('DOMContentLoaded', e => {
    console.log($("#"+sessionStorage.getItem("checkedCursorID")))
    $("#"+sessionStorage.getItem("checkedCursorID")).prop('checked',true);

    $("#csr-default").click(function(){cursor="auto"})
    $("#csr0").click(function(){cursor="url('https://www.rw-designer.com/cursor-view/229089.png'),auto";setCursor();})
    $("#csr1").click(function(){cursor="url('assets/cursors/dogwalk_csr.gif'),auto";setCursor();})
    $("#csr2").click(function(){cursor="url(http://cur.cursors-4u.net/symbols/sym-6/sym597.cur),auto";setCursor();})
    $("#csr3").click(function(){cursor="url('assets/cursors/woodduck_csr.gif'),auto";setCursor();})
})