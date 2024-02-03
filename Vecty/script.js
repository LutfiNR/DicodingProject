const burgerMenu = document.getElementById("burger-menu");
let burgerNav = document.getElementById("burger-nav");
let click = 0;
burgerMenu.addEventListener("click", () => {
    if (click == 0) {
        burgerNav.classList.remove("hide");
        click += 1;
    } else {
        burgerNav.classList.add("hide");
        click -= 1;
    }
})

let pos = 0;
let slides = document.querySelectorAll(".item-slide");
const btnPrev = document.getElementById('prev');
const btnNext = document.getElementById('next');

function show(index) {
    slides[index].style.display = "block";
}

show(pos);

btnPrev.addEventListener("click", () => {
    if (pos > 0) {
        slides[pos].style.display = "none";
        show(pos - 1);
        pos -= 1;
    }
});

btnNext.addEventListener("click", () => {
    if (pos < slides.length - 1) {
        slides[pos].style.display = "none";
        show(pos + 1);
        pos += 1;
    }
});

