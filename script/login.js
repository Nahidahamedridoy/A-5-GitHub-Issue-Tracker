document.getElementById('login-btn')
.addEventListener('click', function () {
    // mobile number
    const numberInput = document.getElementById('input-number');
    const contactNumber = numberInput.value;
    // console.log(contactNumber);
    //pin input
    const inputPin = document.getElementById('input-pin');
    const pin = inputPin.value;
    // console.log(pin);
    // 3: match pin & mobile number 
    if(contactNumber == "admin" && pin== "admin123"){
        //true:::>> alert> homepage 
        alert("login success");

        window,location.assign("./home.html");

    }else{
        //false:::>> alert> return 
        alert("login Failed");
        return;
    };
});