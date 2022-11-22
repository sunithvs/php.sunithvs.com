document.addEventListener('DOMContentLoaded', function () {

    const carousels = document.querySelectorAll('.carousel');
    carousels.forEach(function (carousel) {

        const ele = carousel.querySelector('ul');
        const amountvisible = Math.round(ele.offsetWidth / ele.querySelector('li:nth-child(1)').offsetWidth);
        const bullets = carousel.querySelectorAll('ol li');
        const slides = carousel.querySelectorAll('ul li');
        const nextarrow = carousel.querySelector('.next');
        const prevarrow = carousel.querySelector('.prev');

        // Initialize the carousel
        nextarrow.style.display = 'block';
        prevarrow.style.display = 'block';
        ele.scrollLeft = 0;
        bullets[0].classList.add('selected');
        slides[0].classList.add('selected');
        if (amountvisible > 1) {
            var removeels = carousel.querySelectorAll('ol li:nth-last-child(-n + ' + (amountvisible - 1) + ')');
            removeels.forEach(function (removeel) {
                removeel.remove();
            });
        }

        const setSelected = function () {
            bullets.forEach(function (bullet) {
                bullet.classList.remove('selected');
            });
            slides.forEach(function (slide) {
                slide.classList.remove('selected');
            });
            const scrolllength = carousel.querySelector('ul li:nth-child(2)').offsetLeft - carousel.querySelector('ul li:nth-child(1)').offsetLeft;
            const nthchild = (Math.round((ele.scrollLeft / scrolllength) + 1));
            carousel.querySelector('ol li:nth-child(' + nthchild + ')').classList.add('selected');
            carousel.querySelector('ul li:nth-child(' + nthchild + ')').classList.add('selected');
            if (carousel.parentElement.parentElement.querySelector('.dynamictitle')) {
                const title = carousel.querySelector('ul li:nth-child(' + nthchild + ') img').getAttribute('title');
                if (title) carousel.parentElement.parentElement.querySelector('.dynamictitle').innerHTML = title;
            }
        }

        const scrollTo = function (event) {
            event.preventDefault();
            ele.scrollLeft = ele.querySelector(this.getAttribute('href')).offsetLeft;
        }

        const nextSlide = function () {
            if (!carousel.querySelector('ol li:last-child').classList.contains('selected')) {
                carousel.querySelector('ol li.selected').nextElementSibling.querySelector('a').click();
            } else {
                carousel.querySelector('ol li:first-child a').click();
            }
        }

        const prevSlide = function () {
            if (!carousel.querySelector('ol li:first-child').classList.contains('selected')) {
                carousel.querySelector('ol li.selected').previousElementSibling.querySelector('a').click();
            } else {
                carousel.querySelector('ol li:last-child a').click();
            }
        }

        const setInteracted = function () {
            ele.classList.add('interacted');
        }

        // Attach the handlers
        ele.addEventListener("scroll", debounce(setSelected));
        ele.addEventListener("touchstart", setInteracted);
        ele.addEventListener('keydown', function (e) {
            if (e.key === 'ArrowLeft') ele.classList.add('interacted');
            if (e.key === 'ArrowRight') ele.classList.add('interacted');
        });

        nextarrow.addEventListener("click", nextSlide);
        nextarrow.addEventListener("mousedown", setInteracted);
        nextarrow.addEventListener("touchstart", setInteracted);

        prevarrow.addEventListener("click", prevSlide);
        prevarrow.addEventListener("mousedown", setInteracted);
        prevarrow.addEventListener("touchstart", setInteracted);

        bullets.forEach(function (bullet) {
            bullet.querySelector('a').addEventListener('click', scrollTo);
            bullet.addEventListener("mousedown", setInteracted);
            bullet.addEventListener("touchstart", setInteracted);
        });

        //setInterval for autoplay
        if (carousel.getAttribute('duration')) {
            setInterval(function () {
                if (ele !== document.querySelector(".carousel:hover ul") && ele.classList.contains('interacted') === false) {
                    nextarrow.click();
                }
            }, carousel.getAttribute('duration'));
        }


    }); //end foreach

}); //end onload


/**
 * Debounce functions for better performance
 * (c) 2021 Chris Ferdinandi, MIT License, https://gomakethings.com
 * @param  {Function} fn The function to debounce
 */
function debounce(fn) {
// Setup a timer
    let timeout;
// Return a function to run debounced
    return function () {
        // Setup the arguments
        let context = this;
        let args = arguments;
        // If there's a timer, cancel it
        if (timeout) {
            window.cancelAnimationFrame(timeout);
        }
        // Setup the new requestAnimationFrame()
        timeout = window.requestAnimationFrame(function () {
            fn.apply(context, args);
        });
    };
}


class Windows95 {
    cursorDragPos = null;
    errorDragging = null;
    errorLimit = 1000;
    errors = [];
    sound = {
        chord: new Howl({
            src: ["https://assets.codepen.io/416221/chord.wav"],
            autoplay: false,
            loop: false,
            volume: 1.0
        })
    };

    constructor(el) {
        this.el = document.querySelector(el);
        this.el?.addEventListener("click", this.errorLoop.bind(this));
        this.el?.addEventListener("keyup", this.errorLoop.bind(this));
        // down
        this.el?.addEventListener("mousedown", this.dragErrorStart.bind(this));
        this.el?.addEventListener("touchstart", this.dragErrorStart.bind(this));
        // move
        this.el?.addEventListener("mousemove", this.dragError.bind(this));
        this.el?.addEventListener("touchmove", this.dragError.bind(this));
        // up
        this.el?.addEventListener("mouseup", this.dragErrorEnd.bind(this));
        this.el?.addEventListener("mouseleave", this.dragErrorEnd.bind(this));
        this.el?.addEventListener("contextmenu", this.dragErrorEnd.bind(this));
        this.el?.addEventListener("touchend", this.dragErrorEnd.bind(this));

        this.spawnError(0, 0, true);
    }

    async errorLoop(e) {
        const {code, target} = e;

        if (code === "Enter" || code === "NumpadEnter" || (!code && target?.hasAttribute("data-ok"))) {
            const activeError = this.errors.find(error => error.id === target?.getAttribute("data-ok") || error.active);

            if (activeError) {
                // kill the error if active, filter out the active
                activeError.close();
                this.errors = this.errors.filter(error => !error.isClosing);
                // reactivate the last
                this.errors[this.errors.length - 1]?.activate();
                // spawn new errors by chance
                let spawns = Utils.randomInt(this.errors.length ? 0 : 1, 5);
                let overLimit = (this.errors.length + spawns) - this.errorLimit;
                // adjust the spawns to not exceed the limit
                if (overLimit > 0) spawns = this.errorLimit - this.errors.length;

                for (let s = 0; s < spawns; ++s) {
                    await new Promise((res) => setTimeout(res, 100));
                    if (this.errors.length) this.spawnError();
                    else this.spawnError(0, 0);
                }
            }
        } else if (!code) {
            this.switchError(e);
        }
    }

    dragError(e) {
        if (this.errorDragging) {
            let moveX = 0;
            let moveY = 0;

            if (e.touches?.length) {
                // touchscreen
                const [touch] = e.touches;

                moveX = touch.clientX - this.cursorDragPos.x;
                moveY = touch.clientY - this.cursorDragPos.y;

                this.errorDragging.moveBy(moveX, moveY);
                this.cursorDragPos.x = touch.clientX;
                this.cursorDragPos.y = touch.clientY;

            } else {
                // mouse
                moveX = e.clientX - this.cursorDragPos.x;
                moveY = e.clientY - this.cursorDragPos.y;

                this.errorDragging.moveBy(moveX, moveY);
                this.cursorDragPos.x = e.clientX;
                this.cursorDragPos.y = e.clientY;
            }
        }
    }

    dragErrorStart(e) {
        let {target} = e;

        if (target?.nodeName !== "BUTTON") {
            // ensure it’s the header or anything in it that’s not a button
            let headerFound = false;

            do {
                headerFound = target?.hasAttribute("data-header");
                target = target?.parentElement;
            } while (target && !headerFound)

            if (headerFound) {
                // make the error being dragged active
                this.errorDragging = this.errors.find(error => error.el.id === target.id);
                this.switchError(e);

                if (e.touches?.length) {
                    // touchscreen
                    const [touch] = e.touches;

                    this.cursorDragPos = {x: touch.clientX, y: touch.clientY};
                } else {
                    // mouse
                    this.cursorDragPos = {x: e.clientX, y: e.clientY};
                }
            }
        }
    }

    dragErrorEnd() {
        this.cursorDragPos = null;
        this.errorDragging = null;
    }

    spawnError(x, y, muted) {
        this.errors.forEach(error => {
            error.deactivate();
        });
        this.errors.push(new Windows95Error(this.el, x, y));
        // chord sound
        if (!muted) this.sound.chord.play();
    }

    switchError(e) {
        this.errors.find(error => error.active)?.deactivate();

        let {target} = e;

        do {
            target = target?.parentElement;
        } while (target && !target?.hasAttribute("data-window"))

        if (target) {
            // get the window by element ID and make active
            const errorFound = this.errors.find(error => error.el.id === target.id);

            if (errorFound) {
                this.errors.push(this.errors.splice(this.errors.indexOf(errorFound), 1)[0]);
                this.errors[this.errors.length - 1]?.activate();
            }
        }
    }
}

class Windows95Error {
    activeClass = "window--active";
    active = false;
    el = null;
    id = Utils.randomInt().toString(16);
    isClosing = false;
    x = 0;
    y = 0;

    constructor(parentEl, x, y) {
        this.parent = parentEl;
        const windowEls = Array.from(this.parent.querySelectorAll("[data-window]"));
        const windowNew = windowEls[windowEls.length - 1]?.cloneNode(true);

        if (this.parent && windowNew) {
            this.el = windowNew;
            this.parent.appendChild(windowNew);
            windowNew.id = `error-${this.id}`;
            windowNew.hidden = false;
            windowNew.querySelector("[data-desc]").textContent = this.errorMessage;

            // configuration start
            const halfElWidth = Math.round(this.parent.offsetWidth / 2);
            const halfElHeight = Math.round(this.parent.offsetHeight / 2);
            const halfWinWidth = Math.round(windowNew.offsetWidth / 2);
            const halfWinHeight = Math.round(windowNew.offsetHeight / 2);
            // x-position
            if (x === undefined) this.x = Utils.randomInt(-halfElWidth + halfWinWidth, halfElWidth - halfWinWidth);
            else this.x = x;
            // y-position
            if (y === undefined) this.y = Utils.randomInt(-halfElHeight + halfWinHeight, halfElHeight - halfWinHeight);
            else this.y = y;
            // wire up all the parts
            const label = `error-label-${this.id}`;
            const desc = `error-desc-${this.id}`;

            windowNew.setAttribute("aria-labelledby", label);
            windowNew.setAttribute("aria-describedby", desc);
            windowNew.querySelector("[data-label]").id = label;
            windowNew.querySelector("[data-desc]").id = desc;
            windowNew.querySelector("[data-ok]").setAttribute("data-ok", this.id);
            windowNew.style.left = `calc(50% - ${halfWinWidth}px)`;
            windowNew.style.transform = `translate(${this.x}px,${this.y}px)`;

            this.activate();
        }
    }

    get errorMessage() {
        const errorList = [
            "A fatal error has occurred.",
            "Access is denied.",
            "An error occurred while displaying the previous error.",
            "Application performed an illegal action.",
            "Click OK to fix the error.",
            "Critical error",
            "Nope.",
            "Something terrible happened.",
            "Sorry. No can do.",
            "That action is out of order.",
            "The operation completed successfully.",
            "The operation failed badly.",
            "This is illegal you know.",
            "Unknown error",
            "You don’t have permission to do that. Contact an administrator if you want it."
        ];
        return errorList[Utils.randomInt(0, errorList.length - 1)];
    }

    activate() {
        this.el.classList.add(this.activeClass);
        this.el.setAttribute("aria-hidden", false);
        this.active = true;
        this.parent.appendChild(this.el);
    }

    deactivate() {
        this.el.classList.remove(this.activeClass);
        this.el.setAttribute("aria-hidden", true);
        this.active = false;
    }

    close() {
        this.deactivate();
        this.parent.removeChild(this.el);
        this.isClosing = true;
    }
    moveBy(x, y) {
        this.x += x;
        this.y += y;
        this.el.style.transform = `translate(${this.x}px,${this.y}px)`;
    }
}

class Utils {
    static randomInt(min = 0, max = 4) {
        const percent = crypto.getRandomValues(new Uint32Array(1))[0] / 2 ** 32;
        const relativeValue = (max - min) * percent;

        return min + Math.round(relativeValue);
    }
}

function alert_hi() {
    const system = new Windows95("body");
}

