let currentLang = 'ua';
let mode = 'BOT';
let difficulty = 'medium';
let score1 = 0, score2 = 0;
let attempts = 0;
let phase = 'GK';
let savedGkChoice = '';

const translations = {
    ua: {
        bot: "ГРАТИ ПРОТИ БОТА", pvp: "ГРАТИ 1 НА 1 (PvP)", diff: "ОБЕРИ СКЛАДНІСТЬ:",
        easy: "ЛЕГКО", medium: "СЕРЕДНЬО", hard: "ЛЕГЕНДА", player1: "ГРАВЕЦЬ 1", 
        player2: "ГРАВЕЦЬ 2", bot_name: "БОТ", left: "ВЛІВО", center: "ЦЕНТР", 
        right: "ВПРАВО", before_kick: "ДО УДАРУ", ready: "ГОТОВИЙ", your_kick: "ВАШ УДАР!",
        gk_choice: "ГРАВЕЦЬ 1: ОБЕРИ КУТ", striker_choice: "ГРАВЕЦЬ 2: КУДИ Б’ЄШ?",
        win: "ПЕРЕМОГА!", lose: "ПОРАЗКА", menu: "В МЕНЮ"
    },
    en: {
        bot: "PLAY AGAINST BOT", pvp: "PLAY 1 VS 1 (PvP)", diff: "CHOOSE DIFFICULTY:",
        easy: "EASY", medium: "MEDIUM", hard: "LEGEND", player1: "PLAYER 1", 
        player2: "PLAYER 2", bot_name: "BOT", left: "LEFT", center: "CENTER", 
        right: "RIGHT", before_kick: "BEFORE KICK", ready: "READY", your_kick: "YOUR KICK!",
        gk_choice: "PLAYER 1: CHOOSE ANGLE", striker_choice: "PLAYER 2: WHERE TO KICK?",
        win: "VICTORY!", lose: "DEFEAT", menu: "TO MENU"
    }
};

function setLanguage(l) {
    currentLang = l;
    const t = translations[l];
    // Оновлюємо текст у меню
    document.getElementById('btn-bot').innerText = t.bot;
    document.getElementById('btn-pvp').innerText = t.pvp;
    document.getElementById('txt-diff').innerText = t.diff;
    document.getElementById('btn-easy').innerText = t.easy;
    document.getElementById('btn-medium').innerText = t.medium;
    document.getElementById('btn-hard').innerText = t.hard;
    document.getElementById('btn-restart').innerText = t.menu;
    document.getElementById('txt-pass').innerText = t.before_kick;
    document.getElementById('btn-ready').innerText = t.ready;
    document.getElementById('btn-left').innerText = t.left;
    document.getElementById('btn-center').innerText = t.center;
    document.getElementById('btn-right').innerText = t.right;

    document.getElementById('language-box').style.display = 'none';
    document.getElementById('menu-initial').style.display = 'block';
}

function showBotDifficulty() {
    document.getElementById('menu-initial').style.display = 'none';
    document.getElementById('difficulty-box').style.display = 'block';
}

function startBot(diff) {
    mode = 'BOT';
    difficulty = diff;
    document.getElementById('p1-name').innerText = translations[currentLang].player1;
    document.getElementById('p2-name').innerText = translations[currentLang].bot_name;
    startGame();
}

function startPvP() {
    mode = 'PvP';
    document.getElementById('p1-name').innerText = translations[currentLang].player1;
    document.getElementById('p2-name').innerText = translations[currentLang].player2;
    startGame();
}

// ... далі йде функція startGame та інші, які ми писали раніше ...
// Але в них ми замінюємо текст на змінні з перекладом:

function startGame() {
    document.getElementById('main-menu').style.display = 'none';
    document.getElementById('game-ui').style.display = 'block';
    initDots();
    resetRound();
}

function initDots() {
    const bar = document.getElementById('attempts-bar');
    bar.innerHTML = '';
    for(let i=0; i<5; i++) {
        let d = document.createElement('div');
        d.className = 'dot'; d.id = 'dot-' + i;
        bar.appendChild(d);
    }
}

function handleChoice(choice) {
    if (mode === 'PvP' && phase === 'GK') {
        savedGkChoice = choice;
        phase = 'STRIKER';
        document.getElementById('controls').style.display = 'none';
        document.getElementById('pass-screen').style.display = 'block';
        document.getElementById('turn-instruction').innerText = translations[currentLang].before_kick;
    } else {
        const strikerChoice = choice;
        let finalGkChoice = '';
        if (mode === 'BOT') {
            const chances = {'easy': 0.25, 'medium': 0.45, 'hard': 0.75};
            if (Math.random() < chances[difficulty]) finalGkChoice = strikerChoice;
            else {
                const opts = ['left', 'center', 'right'].filter(o => o !== strikerChoice);
                finalGkChoice = opts[Math.floor(Math.random() * opts.length)];
            }
        } else {
            finalGkChoice = savedGkChoice;
        }
        animateShot(strikerChoice, finalGkChoice);
    }
}

function confirmReady() {
    document.getElementById('pass-screen').style.display = 'none';
    document.getElementById('controls').style.display = 'block';
    document.getElementById('turn-instruction').innerText = translations[currentLang].striker_choice;
}

function animateShot(sChoice, gChoice) {
    document.getElementById('controls').style.display = 'none';
    const gk = document.getElementById('goalkeeper');
    const ball = document.getElementById('ball');

    if (gChoice === 'left') gk.style.transform = 'translateX(-100px) rotate(-20deg)';
    else if (gChoice === 'right') gk.style.transform = 'translateX(60px) rotate(20deg)';
    else gk.style.transform = 'translateX(-50%) translateY(-20px)';

    ball.style.bottom = '65%';
    if (sChoice === 'left') ball.style.left = '35%';
    else if (sChoice === 'right') ball.style.left = '65%';
    else ball.style.left = '50%';
    ball.style.transform = 'translateX(-50%) scale(0.5)';

    setTimeout(() => {
        const isGoal = sChoice !== gChoice;
        const dot = document.getElementById('dot-' + attempts);
        if (isGoal) { score1++; dot.classList.add('hit'); }
        else { score2++; dot.classList.add('miss'); }
        
        document.getElementById('score1').innerText = score1;
        document.getElementById('score2').innerText = score2;
        attempts++;

        if (attempts >= 5) {
            const t = translations[currentLang];
            showEnd(score1 > score2 ? t.win : t.lose);
        } else {
            setTimeout(resetRound, 1200);
        }
    }, 600);
}

function resetRound() {
    phase = 'GK';
    const ball = document.getElementById('ball');
    const gk = document.getElementById('goalkeeper');
    ball.style.bottom = '25%'; ball.style.left = '50%'; ball.style.transform = 'translateX(-50%) scale(1)';
    gk.style.transform = 'translateX(-50%)';
    document.getElementById('controls').style.display = 'block';
    const t = translations[currentLang];
    document.getElementById('turn-instruction').innerText = mode === 'PvP' ? t.gk_choice : t.your_kick;
}

function showEnd(msg) {
    document.getElementById('overlay').style.display = 'flex';
    document.getElementById('winner-msg').innerText = msg;
}
