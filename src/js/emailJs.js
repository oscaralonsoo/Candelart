function enablePopUp() {
    let popUp = document.querySelector(".pop-up");
    popUp.classList.add("enabled");
    popUp.addEventListener("click", function(){
        popUp.classList.remove("enabled");
    });
}

function sendMail() {
    let parms = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        subject: document.getElementById("subject").value,
        message: document.getElementById("message").value
    }

    if (parms.name === "" || parms.email === "" || parms.subject === "" || parms.message === "") {
        return;
    }
    
    emailjs.send("service_g3jdgow", "template_40wau9d", parms)
        .then(() => {
            enablePopUp();
        });
}