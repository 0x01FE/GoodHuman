function saveProps(elm, props) {
    if(elm.properityModifyQue == undefined) {
        elm.properityModifyQue = [];
    }
    
    cached_props = {};
    for(const p of Object.keys(props)) cached_props[p] = elm.style[p];
    elm.properityModifyQue.push(cached_props);
    
    for(const [p, v] of Object.entries(props)) elm.style[p] = v;
    
    return () => {
        const props = elm.properityModifyQue.pop();
        for(const [p, v] of Object.entries(props)) {
            elm.style[p] = v;
        }
    };
}
function makeElementMad(elm) {
    setTimeout(saveProps(elm, {
        "border-style": "solid",
        "border-color": "#F00",
        "border-width": "5px"
    }), 1000);
}
function checkWarnTextVal(elm) {
    const val = elm.value;
    if(!val) {
        makeElementMad(elm);
        return false;
    }
    return true;
}
function goToPage(page) {
    window.location.href=`${window.location.protocol}//${window.location.host}/${page}`;
}

var swappableElements = {};
var swapList = [];
function swapElements(nodeA, nodeB) { // https://htmldom.dev/swap-two-nodes/
    const parentA = nodeA.parentNode;
    const siblingA = nodeA.nextSibling === nodeB ? nodeA : nodeA.nextSibling;
    nodeB.parentNode.insertBefore(nodeA, nodeB);
    parentA.insertBefore(nodeB, siblingA);
};
function indexSwapableElements() {
    for(const elm of document.querySelectorAll(".swappable")) {
        swappableElements[elm.id] = elm;
    }
}
function swap(a, b, doNotAdd=false) {
    e_a = document.getElementById(a);
    e_b = document.getElementById(b);
    swapElements(e_a, e_b);
    
    if(e_a.classList.contains("HIDDEN")) {
        e_a.classList.remove("HIDDEN");
        e_b.classList.add("HIDDEN");
    }else if(e_b.classList.contains("HIDDEN")) {
        e_a.classList.add("HIDDEN");
        e_b.classList.remove("HIDDEN");
    }
    
    if(!doNotAdd) swapList.push([a, b]);
}
function reset_swaps() {
    while(swapList.length) {
        const [a, b] = swapList.pop();
        swap(a, b, true);
    }
}

let prev = window.onload();
window.onload = () => {
    prev && prev();
    indexSwapableElements();
}