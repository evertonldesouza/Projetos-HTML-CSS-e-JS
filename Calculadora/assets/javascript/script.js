let str = "";
let res = 0;

function calc(elem) {
    if (document.querySelector("#containerResult").innerHTML === "Erro") {
        str = "";
    }

    if (elem.innerHTML === "×") {
        str += "*";
    } else if (elem.innerHTML === "÷") {
        str += "/";
    } else if (elem.innerHTML === ",") {
        str += ".";
    } else {
        str += elem.innerHTML;
    }
    
    document.querySelector("#containerResult").innerHTML = str;
}

function enjoy() {
    if (str.trim() === "") return;

    try {
        res = new Function('return ' + str)();
        
        if (!isFinite(res)) {
            throw new Error("Divisão Inválida");
        }

        const formattedRes = Number.isInteger(res) ? res : parseFloat(res.toFixed(5));

        document.querySelector("#containerResult").innerHTML = formattedRes;
        
        str = formattedRes.toString(); 

    } catch (error) {
        document.querySelector("#containerResult").innerHTML = "Erro";
        str = "";
    }
}

function reset() {
    document.querySelector("#containerResult").innerHTML = "";
    str = "";
}