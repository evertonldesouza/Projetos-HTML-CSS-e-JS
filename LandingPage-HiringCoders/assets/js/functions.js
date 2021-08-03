window.onload = () => {
    const subscribeBtn = document.querySelector('#subscribeBtn');
    const closeBtn = document.querySelector('#closeBtn');

    const emailInput = document.querySelector('#emailInput');
    const mesageDisplay = document.querySelector('#mesage-display');
    
    const modal = document.querySelector('#modal');
    const body = document.querySelector('body');

    subscribeBtn.addEventListener('click', ()=> {
        const email = emailInput.value;

        if(email != "") {
            localStorage.setItem('tiotomEmail', email);
            emailInput.value = "";
            mesageDisplay.innerHTML = "";
            openModal();
        }else {
            mesageDisplay.innerHTML = "Preencha o campo com seu melhor E-mail!";
        }
    });

    closeBtn.addEventListener('click', ()=> {
        modal.style.display = "none";
        body.style.overflow = "visible";
    });

    const openModal = ()=> {
        modal.style.display = "flex";
        modal.style.transform = "translateY(0)";
        body.style.overflow = "hidden";
    }
};