const bgm = document.getElementById('bgm');
const clearbgm = document.getElementById('clear-bgm');
const blockSound = document.getElementById('block-sound');
const jumpSound = document.getElementById('jump-sound');
const collisionSound = document.getElementById('collision-sound');
const jumpBlockSound = document.getElementById('jump-block-sound');
const orinSound = document.getElementById('orin-sound');

const scoreDisplayTop = document.getElementById('score-display-top');
const startScreen = document.getElementById('start-screen'); 
const gameContainer = document.getElementById('game-container');
const character = document.getElementById('character');
const gameOverScreen = document.getElementById('game-over');
const scoreDisplay = document.getElementById('score-display');
const restartButton = document.getElementById('restart-button');
const jumpButton = document.getElementById('jump-button');
const clearScreen = document.getElementById('clear-screen');
const restartButtonClear = document.getElementById('restart-button-clear');
const clearScoreDisplay = document.getElementById('clear-score-display');
let positionY = 0;
let velocityY = 20; 
let isJumping = false;
const gravity = 0.5;
let blocks = [];
let score = 0;
let blockInterval = 2000;
let blockCount = 1;
let gameActive = false;
let blockGenerator;
const normalImage = 'テレクサラimage/通常カナ.png';
const jumpImage = 'テレクサラimage/ジャンプカナ.png';
let jumpHeight = 13; 

function getRandomSpeed() {
    return Math.floor(Math.random() * 29) + 3;
}

function createBlock() {
    const block = document.createElement('div');
    block.classList.add('block');
    block.style.left = gameContainer.offsetWidth + 'px';
    if (blockCount < 2) {
        block.speed = 7;
    } else {
        block.speed = getRandomSpeed();
    }

    if (Math.random() < 1/7) {
        block.classList.remove('block');
        block.classList.add('jump-block');
        block.isJumpBlock = true;
        block.jumpHeight = 200; 
        block.jumpVelocity = 5; 
        block.currentJumpHeight = 0;
        block.jumpStart = gameContainer.offsetWidth - 1600; 
    }

    gameContainer.appendChild(block);
    blocks.push(block);
    blockCount++;
    if (blockCount === 1) {
        blockSound.currentTime = 0;
        blockSound.play();
    } else {
        setTimeout(() => {
            blockSound.currentTime = 0;
            blockSound.play();
        }, 100);
    }
}

function update() {
    if (!gameActive) return;

    if (isJumping) {
        positionY += velocityY;
        velocityY -= gravity;
        if (positionY <= 0) { 
            positionY = 0;
            isJumping = false;
            changeCharacterImage(false); 
        }
    }
    character.style.bottom = positionY + 'px';

    for (let i = 0; i < blocks.length; i++) {
        const block = blocks[i];
        let blockLeft = parseInt(block.style.left);
        blockLeft -= block.speed;
        block.style.left = blockLeft + 'px';

        if (block.isJumpBlock) {
            if (blockLeft < block.jumpStart && block.currentJumpHeight < block.jumpHeight) {
                block.style.bottom = block.currentJumpHeight + 'px';
                block.currentJumpHeight += block.jumpVelocity;
                if (block.currentJumpHeight === block.jumpVelocity) {
                    jumpBlockSound.currentTime = 0;
                    jumpBlockSound.play();
                }
            } else if (block.currentJumpHeight > 0) {
                block.style.bottom = block.currentJumpHeight + 'px';
                block.currentJumpHeight -= block.jumpVelocity;
            } else {
                block.style.bottom = '0px';
            }
        }

        if (blockLeft < -80) {
            block.remove();
            blocks.splice(i, 1);
            i--;
            score++;
            scoreDisplayTop.textContent = '回避した回数: ' + score;
        }

        if (checkCollision(character, block)) {
            gameOver();
            return;
        }
    }
    
    //ゲームクリア条件を変更
    if (score >= 20) { 
        gameClear();
        return;
    }
    
    requestAnimationFrame(update);
}

function checkCollision(character, block) {
    const charRect = character.getBoundingClientRect();
    const blockRect = block.getBoundingClientRect();
    return !(
        charRect.right < blockRect.left ||
        charRect.left > blockRect.right ||
        charRect.bottom < blockRect.top ||
        charRect.top > blockRect.bottom
    );
}

function gameOver() {
    gameOverScreen.style.display = 'block';
    scoreDisplayTop.style.display = 'none';
    collisionSound.currentTime = 0;
    collisionSound.play();
    orinSound.play();
    blockSound.pause();
    jumpSound.pause();
    gameActive = false;
    clearInterval(blockGenerator);
    
    bgm.pause(); 
    if (navigator.vibrate) {
        navigator.vibrate(50);
    }
}

function gameClear() {
    clearScreen.style.display = 'block';
    scoreDisplayTop.style.display = 'none';
    clearbgm.currentTime = 0;
    clearbgm.play();
    gameActive = false;
    clearInterval(blockGenerator);
    bgm.pause(); 
}

restartButton.addEventListener('click', () => {
    location.reload();
});

restartButtonClear.addEventListener('click', () => {
    location.reload();
});

document.getElementById('start-button').addEventListener('click', () => {
    document.getElementById('start-screen').style.display = 'none';
    gameActive = true; 
    blockGenerator = setInterval(createBlock, blockInterval);
    bgm.volume = 0.5;
    bgm.play();
    update(); 
});


// const isMobile = /Android|iPhone|BlackBerry|Windows Phone/i.test(navigator.userAgent);
//const jumpButton = document.getElementById("jump-button");
const isMobile = ('ontouchstart' in window || navigator.maxTouchPoints > 0);
function jump() {
    if (!isJumping && gameActive) {
        velocityY = jumpHeight;
        isJumping = true;
        jumpSound.currentTime = 0;
        jumpSound.play();
        changeCharacterImage(true);
    }
}

// if (isMobile) {
//     // モバイルはボタン非表示
//     jumpButton.style.display = 'none';

//     // 画面タップでジャンプ
//     document.addEventListener('touchstart', () => {
//         jump();
//     });

// } else {
//     // PCはキー入力
//     document.addEventListener('keydown', (event) => {
//         if ((event.code === 'ArrowUp' || event.code === 'KeyW') && !isJumping && gameActive) {
//             jump();
//         }
//     });
// }



if (isMobile) {
    // ボタンを表示
    jumpButton.style.display = 'block';

    // ボタンタップでジャンプ
    jumpButton.addEventListener('touchstart', (e) => {
        e.preventDefault();
        jump();
    });

} else {
    document.addEventListener('keydown', (event) => {
        if ((event.code === 'ArrowUp' || event.code === 'KeyW') && gameActive) {
            jump();
        }
    });
}




// const isMobile = /Android|iPhone|BlackBerry|Windows Phone/i.test(navigator.userAgent);
// if (isMobile) {
//     jumpButton.style.display = 'none';
//     jumpButton.addEventListener('click', () => {
//         if (!isJumping && gameActive) {
//             velocityY = jumpHeight; 
//             isJumping = true;
//             jumpSound.currentTime = 0;
//             jumpSound.play();
//             changeCharacterImage(true); 
//         }
//     });
// } else {
//     document.addEventListener('keydown', (event) => {
//         if (event.code === 'ArrowUp' && !isJumping && gameActive) {
//             velocityY = jumpHeight; 
//             jumpHeight = 17;
//             isJumping = true;
//             jumpSound.currentTime = 0;
//             jumpSound.play();
//             changeCharacterImage(true); 
//         }
//         else if(event.code === 'KeyW' && !isJumping && gameActive) {
//             velocityY = jumpHeight; 
//             jumpHeight = 17;
//             isJumping = true;
//             jumpSound.currentTime = 0;
//             jumpSound.play();
//             changeCharacterImage(true); 
//         }
//     });
// }
function createBlock() {
    const block = document.createElement('div');
    block.classList.add('block');
    block.style.left = gameContainer.offsetWidth + 'px';
    if (blockCount < 2) {
        block.speed = isMobile ? 8 : 5; 
    } else {
        block.speed = isMobile ? getRandomSpeed() + 3 : getRandomSpeed(); 
    }

    if (Math.random() < 1/7) {
        block.classList.remove('block');
        block.classList.add('jump-block');
        block.isJumpBlock = true;
        block.jumpHeight = 200; 
        block.jumpVelocity = 10; 
        block.currentJumpHeight = 0;
        block.jumpStart = gameContainer.offsetWidth - 200; 
    }

    gameContainer.appendChild(block);
    blocks.push(block);
    blockCount++;
    if (blockCount === 1) {
        blockSound.currentTime = 0;
        blockSound.play();
    } else {
        setTimeout(() => {
            blockSound.currentTime = 0;
            blockSound.play();
        }, 100);
    }
}

function changeCharacterImage(isJumping) {
    character.style.backgroundImage = isJumping ? `url('./テレクサラ/テレクサラimage/ジャンプカナ.png')` : `url('./テレクサラ/テレクサラimage/通常カナ.png')`;
}

document.addEventListener('keydown', (event) => {
    if (event.code === 'KeyE' && startScreen.style.display !== 'none') {
        startScreen.style.display = 'none';
        gameActive = true;
        blockGenerator = setInterval(createBlock, blockInterval);
        bgm.volume = 0.5;
        bgm.play();
        update();
    }
});

document.addEventListener('keydown', (event) => {
    if (event.code === 'KeyR' && gameOverScreen.style.display !== 'none') {
        location.reload();
    }
});
