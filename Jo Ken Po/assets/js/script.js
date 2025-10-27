let result_ref = document.getElementById("result");
let [computer_score,user_score]=[0,0];
let choices_object = {
    'pedra': {
        'pedra' : 'empatou',
        'tesoura': 'ganhou',
        'papel' : 'perdeu'
    },
    'tesoura': {
        'pedra' : 'perdeu',
        'tesoura': 'empatou',
        'papel' : 'ganhou'
    },
    'papel': {
        'pedra' : 'ganhou',
        'tesoura': 'perdeu',
        'papel' : 'empatou'
    }
}

function checker(input){
    var choices = ["pedra", "papel", "tesoura"];
    var num = Math.floor(Math.random()*3);

    document.getElementById("comp_choice").
    innerHTML =
    ` O Computador escolheu <span>${choices[num].
    toUpperCase()}</span>`;

    document.getElementById("user_choice").
    innerHTML = 
    `Você escolheu <span> ${input.toUpperCase()} </span>`;

    let computer_choice = choices[num];

    switch(choices_object[input] [computer_choice]) {
        case 'ganhou':
        result_ref.style.cssText =
        "background-color: #cefdce; color: #689f38";
        result_ref.innerHTML = "GANHOU !";
        user_score++;
        break;

        case 'perdeu':
        result_ref.style.cssText =
        "background-color: #ffdde0; color: #d32f2f";
        result_ref.innerHTML = "PERDEU !";
        computer_score++;
        break;

        default:
        result_ref.style.cssText = "background-color: #e5e5e5; color: #808080";
        result_ref.innerHTML = "EMPATOU !";
        break;
    }
    document.getElementById("computer_score").innerHTML = computer_score;
    document.getElementById("user_score").innerHTML = user_score;
}