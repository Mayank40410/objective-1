console.log("Secure Authentication Dashboard Loaded");


/* ===============================
 Backend URL
================================ */


const API_BASE_URL =
"https://objective-1-geu2.onrender.com";

const API_BASE_URL = "http://localhost:5000";

function getElement(id){

    return document.getElementById(id);

}



function showMessage(element,msg,color){

    if(element){

        element.style.color=color;

        element.innerText=msg;

    }

}


/* ===============================
 Modal Controls
================================ */


function openLoginModal(){

    getElement("loginModal").style.display="flex";

}


function closeLoginModal(){

    getElement("loginModal").style.display="none";

}



function openRegisterModal(){

    getElement("registerModal").style.display="flex";

}


function closeRegisterModal(){

    getElement("registerModal").style.display="none";

}



/* ===============================
 REGISTER USER
================================ */


const registerForm =
getElement("registerForm");


if(registerForm){


registerForm.addEventListener(
"submit",
async(e)=>{


e.preventDefault();


const name =
getElement("registerName").value;


const email =
getElement("registerEmail").value;


const password =
getElement("registerPassword").value;


const message =
getElement("registerMessage");



try{


const response =
await fetch(

`${API_BASE_URL}/api/auth/register`,

{

method:"POST",

headers:{

"Content-Type":"application/json"

},


body:JSON.stringify({

name,
email,
password

})

});



const data =
await response.json();



if(response.ok){


showMessage(

message,

"Registration Successful ✅",

"#22c55e"

);


registerForm.reset();


setTimeout(()=>{

closeRegisterModal();

openLoginModal();

},1000);


}

else{


showMessage(

message,

data.message || "Registration Failed ❌",

"red"

);


}



}catch(error){


console.log(error);


showMessage(

message,

"Backend Connection Failed ❌",

"red"

);


}


});

}



/* ===============================
 LOGIN USER
================================ */


const loginForm =
getElement("loginForm");



if(loginForm){


loginForm.addEventListener(

"submit",

async(e)=>{


e.preventDefault();



const email =
getElement("email").value;



const password =
getElement("password").value;



const message =
getElement("loginMessage");



try{


const response =
await fetch(

`${API_BASE_URL}/api/auth/login`,

{

method:"POST",

headers:{

"Content-Type":"application/json"

},


body:JSON.stringify({

email,
password

})


});



const data =
await response.json();



if(response.ok){



localStorage.setItem(

"jwtToken",

data.token

);



showMessage(

message,

"Login Successful ✅",

"#22c55e"

);



setTimeout(()=>{


closeLoginModal();


alert(
"Protected Session Started 🚀"
);


},1000);



}

else{


showMessage(

message,

data.message || "Invalid Login ❌",

"red"

);



}



}catch(error){



console.log(error);



showMessage(

message,

"Backend Not Connected ❌",

"red"

);



}



});


}




/* ===============================
 LOGOUT
================================ */


function logoutUser(){


localStorage.removeItem(
"jwtToken"
);


alert(
"Logout Successful"
);


}



/* ===============================
 AUTH CHECK
================================ */


function checkAuthentication(){


const token =
localStorage.getItem("jwtToken");



if(token){

console.log(
"JWT Active"
);

}

else{

console.log(
"No Login Session"
);

}


}



checkAuthentication();




/* ===============================
 PROJECT API
================================ */


async function getProjects(){


const response =
await fetch(

`${API_BASE_URL}/api/projects`

);


return response.json();


}



async function createProject(name){


const response =
await fetch(

`${API_BASE_URL}/api/projects`,

{

method:"POST",

headers:{

"Content-Type":"application/json"

},


body:JSON.stringify({

name

})

}

);



return response.json();


}




/* ===============================
 CHAT API
================================ */


async function askQuestion(question){


const response =
await fetch(

`${API_BASE_URL}/api/chat/ask`,

{

method:"POST",

headers:{

"Content-Type":"application/json"

},


body:JSON.stringify({

question

})

}


);



return response.json();


}




/* ===============================
 BUTTON EFFECTS
================================ */


document
.querySelectorAll(".feature-card")
.forEach(card=>{


card.addEventListener(
"mouseenter",
()=>{


card.style.transform =
"translateY(-10px) scale(1.03)";


});



card.addEventListener(
"mouseleave",
()=>{


card.style.transform =
"translateY(0) scale(1)";


});


});



function googleLogin(){

alert(
"Google OAuth setup pending"
);

}


function githubLogin(){

alert(
"GitHub OAuth setup pending"
);

}