import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-app.js";
import { getAuth, onAuthStateChanged, connectAuthEmulator, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider, 
  signInWithEmailAndPassword, RecaptchaVerifier } from 'https://www.gstatic.com/firebasejs/9.6.7/firebase-auth.js';
  import { doc, setDoc, getDoc, getFirestore, connectFirestoreEmulator,updateDoc, increment } from 'https://www.gstatic.com/firebasejs/9.6.7/firebase-firestore.js';

const firebaseConfig = {

  apiKey: "AIzaSyA7JwKOgkig_3s0R9D12D0EBPVg1En7AP4",

  authDomain: "fir-boxedupph-hosting.firebaseapp.com",

  databaseURL: "https://fir-boxedupph-hosting-default-rtdb.asia-southeast1.firebasedatabase.app",

  projectId: "fir-boxedupph-hosting",

  storageBucket: "fir-boxedupph-hosting.appspot.com",

  messagingSenderId: "398374173611",

  appId: "1:398374173611:web:15cc999389157e0ef1f0ee",

  measurementId: "G-N7LYLDD627"

};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const auth = getAuth();
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

const auth = getAuth();
const db = getFirestore();
//connectAuthEmulator(auth, "http://localhost:9099");

//success message before redirects
function SuccessRedirectPopUp(titleText, text) {
  Swal.fire({
      title: titleText,
      text: text,
      confirmButtonText: 'OK',
      confirmButtonColor: '#BC875E',
      background: '#F6EED4',
      showConfirmButton: false,
      icon: "success",

      customClass: {
          popup: 'popup-style',
          confirmButton: 'button-width',
          htmlContainer: 'htmlContainer-italicize'
      }
  })
}

function errorOkPopUp(titleText, text) {
  Swal.fire({
      title: titleText,
      text: text,
      iconHtml: '<img src="assets/popup_warning.png">',
      confirmButtonText: 'OK',
      confirmButtonColor: '#BC875E',
      background: '#F6EED4',

      customClass: {
          popup: 'popup-style',
          icon: 'icon-style',
          confirmButton: 'button-width',
          htmlContainer: 'htmlContainer-italicize'
      }
  })
}

googleProvider.setCustomParameters({
  prompt: 'select_account'
});

//Google Sign In
document.getElementById("googleButton").addEventListener('click', (e) => {
  signInWithPopup(auth, googleProvider)
    .then(async (result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;

      const url = 'https://www.googleapis.com/oauth2/v3/userinfo';

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      console.log(data[0]);
      console.log("Google Sign In successfull");
      //relevant user info to put in the database
      console.log(data['email']);
      console.log(data['family_name']);
      console.log(data['given_name']);
      console.log(data['name']);
      console.log(data['uid']);
      console.log(data['picture']); //store pfp?
      console.log(user.uid);
      console.log("end");
      getDoc(doc(db, "users", user.uid)).then(docSnap => {
        if (docSnap.exists()) {
            console.log("user exists")
        } else {
          const userDBRef = doc(db, "users", user.uid);
          setDoc(userDBRef, {
              city: "",
              contact: "",
              firstname:data['given_name'],
              lastname:data['family_name'],
              province:"",
              role:"user",
              street:"",
              email:data['email'],
              image:data['picture'],
              activeOrder:"",
          });
          console.log("new user created")
          incrementTotalUsersStats();
        }
        SuccessRedirectPopUp('Login Successful', 'Welcome to Boxed Up!');
        setTimeout(function(){document.location.href = "index.html"},1000);
      });
      
    }).catch((error) => {
      errorOkPopUp('Unable to Login', 'Invalid Username or Password');
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
    });

});

//Facebook Sign In
document.getElementById("loginfacebook").addEventListener('click', (e) => {
    signInWithPopup(auth, facebookProvider)
    .then((result) => {
        // The signed-in user info.
        const user = result.user;

        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        const credential = FacebookAuthProvider.credentialFromResult(result);
        const accessToken = credential.accessToken;

        if(FB.getLoginStatus() != null) {
          FB.api('/me', function(response) {
            console.log(response.name);
          });
        }
        getDoc(doc(db, "users", user.uid)).then(docSnap => {
          if (docSnap.exists()) {
              console.log("user exists")
          } else {
            const userDBRef = doc(db, "users", user.uid);
            setDoc(userDBRef, {
                city: "",
                contact: "",
                firstname:"",
                lastname:"",
                province:"",
                role:"user",
                street:"",
                email:user.email,
                image:"",
                activeOrder:"",
            });
            console.log("new user created")
            incrementTotalUsersStats();
          }
          SuccessRedirectPopUp('Login Successful', 'Welcome to Boxed Up!');
          setTimeout(function(){document.location.href = "index.html"},1000);
        });
    }).catch((error) => {
      errorOkPopUp('Unable to Login', 'Invalid Username or Password');
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.email;
      // The AuthCredential type that was used.
      const credential = FacebookAuthProvider.credentialFromError(error);
    });
});

async function incrementTotalUsersStats(){
  const userStatsRef = doc(db, "stats", "userStats");
  await updateDoc(userStatsRef, {
      totalUsers: increment(1)
  });
}

function setCookie(cname,cvalue,exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

var myCookie = getCookie("failedLoginAttempts");
if (myCookie == null || myCookie == "") {
  setCookie("failedLoginAttempts",0,1);
}

//reCAPTCHA
var isCaptchaVerified = false;
window.recaptchaVerifier = new RecaptchaVerifier('recaptcha', {
  'size': 'normal',
  'callback': (response) => {
    // reCAPTCHA solved, allow signInWithPhoneNumber.
    // ...
    isCaptchaVerified = true;
  },
  'expired-callback': () => {
    // Response expired. Ask user to solve reCAPTCHA again.
    // ...
    isCaptchaVerified = false;
  }
}, auth);

//Email Sign in
document.getElementById("loginemail").addEventListener('click', (e) => {
    var logins = getCookie("failedLoginAttempts");
    var emailstr = document.getElementById("email").value;
    var passwordstr = document.getElementById("id_password").value;
    if(emailstr == "" || passwordstr == ""){
      errorOkPopUp('Unable to Login', 'Invalid Username or Password');
    }
    else{
      if (logins > 15){
        window.recaptchaVerifier.render();
        var myTimeCookie = getCookie("timeOutDuration");
        if (myTimeCookie == null || myTimeCookie == "") {
          // timeout in minutes
          var minutes = 20;
          //current timestamp
          var now = Date.parse(new Date());
          var timeout = new Date();
          timeout.setTime(timeout.getTime() + (minutes*60*1000));
          setCookie("timeOutDuration",timeout,1);
          var sec = ( timeout - now )/1000;
          errorOkPopUp('Too many failed attempts', 'Please wait for '+minutes+':00 minute/s then try again');
        }
        else if (new Date() - Date.parse(getCookie("timeOutDuration")) < 0){
          var sec = Math.floor(Math.abs(new Date() - Date.parse(getCookie("timeOutDuration"))) / 1000);
          var min = Math.floor(sec/60);
          var sec2 = sec % 60;
          var formattedSec2 = sec2.toLocaleString('en-US', {
            minimumIntegerDigits: 2,
            useGrouping: false
          })
          errorOkPopUp('Too many failed attempts', 'Please wait for '+ min + ':' + formattedSec2 +' minute/s then try again');
        }
        else{
          setCookie("failedLoginAttempts",7,1);
          document.cookie = "timeOutDuration=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"; 
          if (isCaptchaVerified){
            var email = document.getElementById("email").value;
            var password = document.getElementById("id_password").value;
            signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                SuccessRedirectPopUp('Login Successful', 'Welcome to Boxed Up!');
                document.cookie = "failedLoginAttempts=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                setTimeout(function(){document.location.href = "index.html"},1000);
            }).catch((error) => {
              errorOkPopUp('Unable to Login', 'Invalid Username or Password');
              var newlogins = parseInt(getCookie("failedLoginAttempts")) + 1;
              setCookie("failedLoginAttempts",newlogins,1);
            });
            isCaptchaVerified = false;
            grecaptcha.reset(window.recaptchaVerifier);
          }else{
            errorOkPopUp('Too many failed attempts', 'Please complete the reCAPTCHA verification');
          }
        }
      }
      else if (logins > 6){
        window.recaptchaVerifier.render();
        if (isCaptchaVerified){
          var email = document.getElementById("email").value;
          var password = document.getElementById("id_password").value;
          signInWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
              const user = userCredential.user;
              SuccessRedirectPopUp('Login Successful', 'Welcome to Boxed Up!');
              document.cookie = "failedLoginAttempts=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
              setTimeout(function(){document.location.href = "index.html"},1000);
          }).catch((error) => {
            errorOkPopUp('Unable to Login', 'Invalid Username or Password');
            var newlogins = parseInt(getCookie("failedLoginAttempts")) + 1;
            setCookie("failedLoginAttempts",newlogins,1);
          });
          isCaptchaVerified = false;
          grecaptcha.reset(window.recaptchaVerifier);
        }else{
          errorOkPopUp('Too many failed attempts', 'Please complete the reCAPTCHA verification');
        }
      } 
      else {
        var email = document.getElementById("email").value;
        var password = document.getElementById("id_password").value;
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            SuccessRedirectPopUp('Login Successful', 'Welcome to Boxed Up!');
            document.cookie = "failedLoginAttempts=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            setTimeout(function(){document.location.href = "index.html"},1000);
        }).catch((error) => {
          errorOkPopUp('Unable to Login', 'Invalid Username or Password');
          var newlogins = parseInt(getCookie("failedLoginAttempts")) + 1;
          setCookie("failedLoginAttempts",newlogins,1);
        });
      }
    }
});

//get user role
var role;
onAuthStateChanged(auth, (user) => {
    document.getElementById('userlogin').style.visibility = 'visible';
    if (user) {
        getDoc(doc(db, "users", user.uid)).then(docSnap => {
            if (docSnap.exists()) {
                const info =  docSnap.data();
                role = info.role;
                if (role!="admin"){
                    document.getElementById('usercart').style.visibility = 'visible';
                }
            } else {
                console.log("No such document!");
            }
        })
    }
});

//navbar
document.getElementById("userlogin").addEventListener('click', (e) => {
  var user = auth.currentUser;

  if (user) {
      if (role=="user"){
          window.location.href = "profile.html";
      }
      else if (role=="admin"){
          window.location.href = "admin.html";
      }
  } else {
      window.location.href = "sign-in.html";
  }
});
document.getElementById("usercart").addEventListener('click', (e) => {
  var user = auth.currentUser;

  if (user) {
      if (role=="user"){
          window.location.href = "cart.html";
      }
      else if (role=="admin"){
          window.location.href = "profile.html";
      }
  } else {
      window.location.href = "sign-in.html";
  }
});