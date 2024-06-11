let img = document.getElementById('img');
let ptag = document.querySelector('.image-container p');
let reset_btn = document.querySelector('.reset');
let apply_btn = document.querySelector('.apply-btn');
let toggle_btn = document.querySelector('.toggle-btn');
let upload_img = document.getElementById('Upload-btn');
let download_img = document.getElementById('Download-btn');
let flip_btns = document.querySelectorAll('.rotate-flip-options .flip-btns');
let rotate_btns = document.querySelectorAll('.rotate-flip-options .rotate-btns');
let input = document.getElementById('input');
let filters = document.querySelectorAll('.filter-container>button');
let activeFilter = "";
let display_btns = document.querySelectorAll('.display-property span');
let display_filter_type = document.querySelector('.display-property p');
let indicator = document.querySelector('.progress>input');
let indicatorValue = indicator.value;
let rotation = 0;
let flipH = 1;
let flipV = 1;
let imageSelected=false;
upload_img.addEventListener("focus", () => {
    input.click();
})

input.addEventListener('change', (e) => {
    imageSelected=true;
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (event) {
            img.src = event.target.result;
            img.style.display = 'block';
            ptag.style.display = 'none';
        }
        reader.readAsDataURL(file);
    }
})

//reset filters code

reset_btn.addEventListener('click', () => {
    img.style.filter = "";
    activeFilter = "";
    indicatorValue = 0;
    indicator.value = indicatorValue;
    display_btns[0].textContent = indicatorValue + "%";
    display_filter_type.textContent = "Select Filter";
})

indicator.addEventListener('change', (event) => {
    indicatorValue = event.target.value;
    display_btns[0].textContent = indicatorValue + "%";
})

//eventlistener for filter buttons
filters.forEach((item) => {
    item.addEventListener('click', changeFilter);
})

function changeFilter(event) {
    activeFilter = event.target.name;
    display_filter_type.innerText = activeFilter;
}

apply_btn.addEventListener('click', ApplyFilter);

function ApplyFilter() {
    if(!imageSelected){
        alert('please select any image to apply filter');
    }
    else updateImageProperty();
}

function updateImageProperty() {
    if (activeFilter !== "") {
        img.style.filter = activeFilter + "(" + indicatorValue + "%" + ")";
    }
}

// toggling modes

toggle_btn.addEventListener('click', () => {
    if (document.documentElement.getAttribute("data-theme") === "dark") {
        document.documentElement.setAttribute("data-theme", "light");
        toggle_btn.innerHTML = '&#x1F319';
    }
    else {
        document.documentElement.setAttribute("data-theme", "dark");
        toggle_btn.innerHTML = '&#x2600';
    }
})

//download button

download_img.addEventListener('click', () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext('2d');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(rotation * Math.PI / 180);
    ctx.scale(flipH, flipV);
    ctx.filter = img.style.filter;  // Apply filters
    ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);
    ctx.restore();

    const url = canvas.toDataURL("image/jpeg");
    const link = document.createElement("a");
    link.href = url;
    link.download = "edited_image_" + generateName() + ".jpg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
})

//file name generate function

function generateName() {
    const date = new Date();
    let name = date.getFullYear() + "-" + date.getDate() + "-" + (date.getMonth() + 1);
    return name;
}

// flip & rotate
rotate_btns[0].addEventListener('click', rotateLeft);
rotate_btns[1].addEventListener("click", rotateRight);

flip_btns[0].addEventListener('click', flipHorizontal);
flip_btns[1].addEventListener('click', flipVertical);

function rotateLeft() {
    rotation = (rotation - 90) % 360;
    updateTransform();
}

function rotateRight() {
    rotation = (rotation + 90) % 360;
    updateTransform();
}

function flipHorizontal() {
    flipH = flipH * -1;
    updateTransform();
}

function flipVertical() {
    flipV = flipV * -1;
    updateTransform();
}

function updateTransform() {
    const transform = `
        rotate(${rotation}deg)
        scale(${flipH}, ${flipV})
    `;
    img.style.transform = transform;
}