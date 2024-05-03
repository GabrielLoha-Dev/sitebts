document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");

    let width = window.innerWidth;
    let height = window.innerHeight;

    canvas.width = width;
    canvas.height = height;

    const birdImage = new Image();
    birdImage.src = "download.png";

    const bird = {
        x: 50,
        y: canvas.height / 2,
        width: 40,
        height: 30,
        velocity: 0,
        gravity: 0.5,
        jumpStrength: -10,
        alive: true,
    };

    const pipes = [];

    let score = 0;

    function drawBird() {
        ctx.drawImage(birdImage, bird.x, bird.y, bird.width, bird.height);
    }

    function drawPipes() {
        for (let i = 0; i < pipes.length; i++) {
            const pipe = pipes[i];
            ctx.fillStyle = "green";
            ctx.fillRect(pipe.x, 0, pipe.width, pipe.topHeight);
            ctx.fillRect(pipe.x, pipe.bottomY, pipe.width, canvas.height - pipe.bottomY);
        }
    }

    function updateBird() {
        if (!bird.alive) return;

        bird.velocity += bird.gravity;
        bird.y += bird.velocity;

        if (bird.y + bird.height > canvas.height || bird.y < 0) {
            gameOver();
        }
    }

    function updatePipes() {
        if (!bird.alive) return;

        for (let i = 0; i < pipes.length; i++) {
            const pipe = pipes[i];
            pipe.x -= 2;

            if (bird.x + bird.width > pipe.x &&
                bird.x < pipe.x + pipe.width &&
                (bird.y < pipe.topHeight || bird.y + bird.height > pipe.bottomY)
            ) {
                gameOver();
            }

            if (pipe.x + pipe.width < 0) {
                pipes.shift();
                score++;
            }
        }

        if (pipes.length < 2) {
            createPipe();
        }
    }

    function createPipe() {
        const pipeGap = 100;
        const minHeight = 20;
        const maxHeight = canvas.height - pipeGap - minHeight;
        const topHeight = Math.random() * (maxHeight - minHeight) + minHeight;
        const bottomY = topHeight + pipeGap;

        pipes.push({
            x: canvas.width,
            topHeight: topHeight,
            bottomY: bottomY,
            width: 30,
        });
    }

    function gameOver() {
        bird.alive = false;
        alert(`Game Over! Score: ${score}`);
        location.reload();
    }

    function drawScore() {
        ctx.font = "16px Arial";
        ctx.fillStyle = "black";
        ctx.fillText("Score: " + score, 10, 20);
    }

    function gameLoop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        updateBird();
        updatePipes();

        drawPipes();
        drawBird();
        drawScore();

        requestAnimationFrame(gameLoop);
    }

    document.addEventListener("keydown", (e) => {
        if (e.code === "Space" && bird.alive) {
            bird.velocity = bird.jumpStrength;
        }
    });

    canvas.addEventListener("touchstart", () => {
        if (bird.alive) {
            bird.velocity = bird.jumpStrength;
        }
    });

    createPipe();
    gameLoop();
});
