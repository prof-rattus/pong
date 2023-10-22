const state = {
    racketSpeed: 0.8,
    racket1: { move: 0, top: 0, height: 0, width: 0, left: 0 },
    racket2: { move: 0, top: 0, height: 0, width: 0, left: 0 },
    ball: { top: 0, left: 0, angle: 0, element: null, speed: 0.5, size: 0 },
    board: null,
    score1: { value: 0 },
    score2: { value: 0 },
    animate: true,
};

function move(element, x, y) {
    element.style.transform = `translate(${x}px, ${y}px)`;
}
function animate() {
    const now = Date.now();
    const dif = now - state.time;
    state.time = now;

    // Move the racket
    state.racket1.top = Math.min(
        Math.max(
            state.racket1.top + state.racket1.move * state.racketSpeed * dif,
            0
        ),
        state.board.clientHeight - state.racket1.height
    );
    state.racket2.top = Math.min(
        Math.max(
            state.racket2.top + state.racket2.move * state.racketSpeed * dif,
            0
        ),
        state.board.clientHeight - state.racket2.height
    );

    state.ball.top += dif * state.ball.speed * Math.sin(state.ball.angle);
    state.ball.left += dif * state.ball.speed * Math.cos(state.ball.angle);
    // Move the ball

    //If ball hits racket1
    if (
        state.ball.left < state.racket1.left + state.racket1.width &&
        state.ball.top + state.ball.size > state.racket1.top &&
        state.ball.top - state.ball.size <
            state.racket1.top + state.racket1.height
    ) {
        state.ball.angle = Math.PI - state.ball.angle;
        state.ball.top += dif * state.ball.speed * Math.sin(state.ball.angle);
        state.ball.left += dif * state.ball.speed * Math.cos(state.ball.angle);
    }

    //If ball hits racket2
    else if (
        state.ball.left + state.ball.size >= state.racket2.left &&
        state.ball.top + state.ball.size > state.racket2.top &&
        state.ball.top - state.ball.size <
            state.racket2.top + state.racket2.height
    ) {
        state.ball.angle = Math.PI - state.ball.angle;
        state.ball.top += dif * state.ball.speed * Math.sin(state.ball.angle);
        state.ball.left += dif * state.ball.speed * Math.cos(state.ball.angle);
    }

    //If ball hits upper wall
    else if (state.ball.top > 768 - 20) {
        state.ball.angle = 2 * Math.PI - state.ball.angle;
        state.ball.top += dif * state.ball.speed * Math.sin(state.ball.angle);
        state.ball.left += dif * state.ball.speed * Math.cos(state.ball.angle);
    }
    //If ball hits bottom wall
    else if (state.ball.top < 0) {
        state.ball.angle = 2 * Math.PI - state.ball.angle;
        state.ball.top += dif * state.ball.speed * Math.sin(state.ball.angle);
        state.ball.left += dif * state.ball.speed * Math.cos(state.ball.angle);
    } else if (state.ball.left > 1024 - 20) {
        state.notstart = false;
        state.score1.value++;
        restart();
    } else if (state.ball.left < 20) {
        state.score2.value++;
        restart();
    }
    if (state.score1.value === 11 || state.score2.value === 11) {
        state.score1.value = 0;
        state.score2.value = 0;
        restart();
    }

    // Display the change

    move(state.ball.element, state.ball.left, state.ball.top);
    //Display score
    state.score1.element.innerText = state.score1.value;
    state.score2.element.innerText = state.score2.value;

    move(state.racket1.element, 0, state.racket1.top);
    move(state.racket2.element, 0, state.racket2.top);
    if (state.animate) {
        window.requestAnimationFrame(animate);
    }
}

//
function onkeydown(e) {
    let handled = false;
    if (e.key === "w") {
        state.racket1.move = -1;
        handled = true;
    } else if (e.key === "s") {
        state.racket1.move = 1;
        handled = true;
    } else if (e.key === "ArrowUp") {
        state.racket2.move = -1;
        handled = true;
    } else if (e.key === "ArrowDown") {
        state.racket2.move = 1;
        handled = true;
    } else if (e.key === " ") {
        if (state.animate) {
            state.animate = false;
        } else {
            state.animate = true;
            state.time = Date.now();
            animate();
        }
        handled = true;
    }

    if (handled) {
        e.stopPropagation();
        e.preventDefault();
    }
}
function onkeyup(e) {
    let handled = false;
    if (e.key === "w") {
        state.racket1.move = 0;
        handled = true;
    } else if (e.key === "s") {
        state.racket1.move = 0;
        handled = true;
    } else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        state.racket2.move = 0;
        handled = true;
    }
    if (handled) { 
        e.stopPropagation();
        e.preventDefault();
    }
}
function restart() {
    state.ball.top = 0;
    state.ball.left =
        state.board.offsetWidth / 2 - state.ball.element.offsetWidth / 2;
    state.ball.angle =
        Math.random() > 0.5
            ? (10 + Math.random() * 70) * (Math.PI / 180)
            : (100 + Math.random() * 70) * (Math.PI / 180);

    move(state.ball.element, state.ball.left, state.ball.top);
    state.time = Date.now();
}
function main() {
    window.addEventListener("keydown", onkeydown);
    window.addEventListener("keyup", onkeyup);
    state.racket1.element = document.getElementById("p1");
    state.racket2.element = document.getElementById("p2");
    state.score1.element = document.getElementById("score1");
    state.score2.element = document.getElementById("score2");
    const board = document.getElementById("board");
    state.board = board;
    state.racket1.height = state.racket1.element.offsetHeight;
    state.racket2.height = state.racket2.element.offsetHeight;
    state.racket1.width = state.racket1.element.offsetWidth;
    state.racket2.width = state.racket2.element.offsetWidth;

    state.racket1.element.style.left = 10;
    state.racket1.left = parseInt(state.racket1.element.style.left);

    state.racket2.element.style.right = 10;
    state.racket2.left =
        board.offsetWidth - (parseInt(state.racket2.element.style.right) + state.racket2.width);

    // Initialize Ball
    const ball = document.getElementById("ball");
    state.ball.element = ball;
    state.ball.size = ball.offsetWidth;
    restart();
    window.requestAnimationFrame(animate);

    // Debug
    console.log("initial state:", state);
}
