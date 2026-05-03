const result_ref = document.getElementById("result");
const comp_choice_ref = document.getElementById("comp_choice");
const user_choice_ref = document.getElementById("user_choice");
const comp_score_ref = document.getElementById("computer_score");
const user_score_ref = document.getElementById("user_score");

const btn_pedra = document.getElementById("pedra");
const btn_papel = document.getElementById("papel");
const btn_tesoura = document.getElementById("tesoura");

const allButtons = [btn_pedra, btn_papel, btn_tesoura];

const userHand = document.querySelector(".user-hand");
const compHand = document.querySelector(".computer-hand");
const userHandIcon = document.querySelector(".user-hand i");
const compHandIcon = document.querySelector(".computer-hand i");

const iconClasses = {
    'pedra': 'fas fa-hand-rock',
    'papel': 'fas fa-hand-paper',
    'tesoura': 'fas fa-hand-scissors'
};

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let [computer_score, user_score] = [0, 0];
const choices_object = {
    'pedra': { 'pedra': 'empatou', 'tesoura': 'ganhou', 'papel': 'perdeu' },
    'tesoura': { 'pedra': 'perdeu', 'tesoura': 'empatou', 'papel': 'ganhou' },
    'papel': { 'pedra': 'ganhou', 'tesoura': 'perdeu', 'papel': 'empatou' }
};

function checker(input, computer_choice) {
    const result = choices_object[input][computer_choice];
    
    result_ref.classList.remove('ganhou', 'perdeu', 'empatou');

    switch(result) {
        case 'ganhou':
            result_ref.classList.add('ganhou');
            result_ref.innerHTML = "GANHOU !";
            user_score++;
            break;
        case 'perdeu':
            result_ref.classList.add('perdeu');
            result_ref.innerHTML = "PERDEU !";
            computer_score++;
            break;
        default:
            result_ref.classList.add('empatou');
            result_ref.innerHTML = "EMPATOU !";
            break;
    }

    comp_score_ref.innerHTML = computer_score;
    user_score_ref.innerHTML = user_score;
}

async function playRound(userInput) {
    allButtons.forEach(btn => btn.disabled = true);

    result_ref.innerHTML = "";
    comp_choice_ref.innerHTML = "";
    user_choice_ref.innerHTML = "";
    result_ref.classList.remove('ganhou', 'perdeu', 'empatou');

    userHandIcon.className = iconClasses['pedra'];
    compHandIcon.className = iconClasses['pedra'];

    const choices = ["pedra", "papel", "tesoura"];
    const num = Math.floor(Math.random() * 3);
    const computerChoice = choices[num];

    userHand.classList.add("shake-user");
    compHand.classList.add("shake-computer");

    allButtons.forEach(btn => {
        const btnId = btn.id;
        if (btnId === userInput) btn.classList.add('selected');
        if (btnId === computerChoice) btn.classList.add('computer-choice');
        if (btnId !== userInput && btnId !== computerChoice) btn.classList.add('inactive');
    });

    await wait(1200);

    userHand.classList.remove("shake-user");
    compHand.classList.remove("shake-computer");
    
    userHandIcon.className = iconClasses[userInput];
    compHandIcon.className = iconClasses[computerChoice];

    comp_choice_ref.innerHTML = `O Computador escolheu <span>${computerChoice.toUpperCase()}</span>`;
    user_choice_ref.innerHTML = `Você escolheu <span>${userInput.toUpperCase()}</span>`;
    checker(userInput, computerChoice); 

    await wait(1500); 

    allButtons.forEach(btn => {
        btn.disabled = false;
        btn.classList.remove('selected', 'computer-choice', 'inactive');
    });
}

btn_pedra.addEventListener("click", () => playRound("pedra"));
btn_papel.addEventListener("click", () => playRound("papel"));
btn_tesoura.addEventListener("click", () => playRound("tesoura"));