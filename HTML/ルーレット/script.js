const slot1 = document.getElementById('slot1');
const slot2 = document.getElementById('slot2');
const slot3 = document.getElementById('slot3');
const result = document.getElementById('result');
const spinButton = document.getElementById('spin');
const resetButton = document.getElementById('reset');
const spinSound = document.getElementById('spin-sound');
const winSound = document.getElementById('win-sound');
const loseSound = document.getElementById('lose-sound');

const slots = document.querySelectorAll('.slot');
const items = Array.from(slots).map(slot => `<img src="${slot.dataset.img}">`);

let random1, random2, random3;
let isSpinning = false;
let stopCount = 0;

// スロットのアイテムを作成
const createSlotItems = (slot) => {
    for (let i = 0; i < 50; i++) {
        const item = document.createElement('div');
        item.className = 'slot-item';
        item.innerHTML = items[Math.floor(Math.random() * items.length)];
        slot.appendChild(item);
    }
};

createSlotItems(slot1);
createSlotItems(slot2);
createSlotItems(slot3);

// スピンボタンの処理
spinButton.addEventListener('click', () => {
    if (isSpinning) return;
    isSpinning = true;
    spinButton.style.display = 'none';
    resetButton.style.display = 'inline-block';
    stopCount = 0;

    spinSound.currentTime = 0;
    spinSound.play();

    random1 = Math.floor(Math.random() * 50) * 150;
    random2 = Math.floor(Math.random() * 50) * 150;
    random3 = Math.floor(Math.random() * 50) * 150;

    const duration = 2;
    slot1.style.transition = `transform ${duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
    slot2.style.transition = `transform ${duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
    slot3.style.transition = `transform ${duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94)`;

    slot1.style.transform = `translateY(-${random1}px)`;
    slot2.style.transform = `translateY(-${random2}px)`;
    slot3.style.transform = `translateY(-${random3}px)`;

    const stopSlot = (slot, random) => {
        slot.addEventListener('transitionend', () => {
            slot.style.transition = 'none';
            slot.style.transform = `translateY(-${random}px)`;
            stopCount++;
            if (stopCount === 3) {
                checkResult();
            }
        }, { once: true });
    };

    stopSlot(slot1, random1);
    stopSlot(slot2, random2);
    stopSlot(slot3, random3);
});

// 結果判定
const checkResult = () => {
    const item1 = items[Math.floor(random1 / 150) % items.length];
    const item2 = items[Math.floor(random2 / 150) % items.length];
    const item3 = items[Math.floor(random3 / 150) % items.length];

    if (item1 === item2 && item2 === item3) {
        result.textContent = 'お前に運がある';
        winSound.currentTime = 0;
        winSound.play();
    } else {
        result.textContent = 'お前には運がない';
        loseSound.currentTime = 0;
        loseSound.play();
    }
    isSpinning = false;
};

// リセットボタンの処理
resetButton.addEventListener('click', () => {
    slot1.style.transition = 'none';
    slot2.style.transition = 'none';
    slot3.style.transition = 'none';
    slot1.style.transform = 'translateY(0)';
    slot2.style.transform = 'translateY(0)';
    slot3.style.transform = 'translateY(0)';
    result.textContent = '';
    spinButton.style.display = 'inline-block';
    resetButton.style.display = 'none';
});