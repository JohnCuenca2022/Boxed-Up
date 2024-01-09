import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-app.js";
import { getAuth, onAuthStateChanged, connectAuthEmulator, GoogleAuthProvider, FacebookAuthProvider, 
  createUserWithEmailAndPassword, sendSignInLinkToEmail, sendPasswordResetEmail, RecaptchaVerifier } from 'https://www.gstatic.com/firebasejs/9.6.7/firebase-auth.js';
import { doc, setDoc, getDoc, getFirestore, connectFirestoreEmulator  } from 'https://www.gstatic.com/firebasejs/9.6.7/firebase-firestore.js'; 

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

const actionCodeSettings = {
  // URL you want to redirect back to. The domain (www.example.com) for this
  // URL must be in the authorized domains list in the Firebase Console.
  url: 'https://fir-boxedupph-hosting.web.app/resetpassword.html',
  // This must be true.
  handleCodeInApp: true,
  // iOS: {
  //   bundleId: 'https://fir-boxedupph-hosting.web.app/verify.html'
  // },
  // android: {
  //   packageName: 'https://fir-boxedupph-hosting.web.app/verify',
  //   installApp: true,
  //   minimumVersion: '12'
  // },
  // dynamicLinkDomain: 'https://fir-boxedupph-hosting.web.app/links/?link=https://fir-boxedupph-hosting.web.app/verify.html'
};

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

function SuccessOkPopUp(titleText, text) {
  Swal.fire({
      title: titleText,
      text: text,
      confirmButtonText: 'OK',
      confirmButtonColor: '#BC875E',
      background: '#F6EED4',
      icon: "success",

      customClass: {
          popup: 'popup-style',
          confirmButton: 'button-width',
          htmlContainer: 'htmlContainer-italicize'
      }
  })
}

//error message before redirects
function errorRedirectPopUp(titleText, text) {
  Swal.fire({
      title: titleText,
      text: text,
      iconHtml: '<img src="assets/popup_warning.png">',
      confirmButtonText: 'OK',
      confirmButtonColor: '#BC875E',
      background: '#F6EED4',
      showConfirmButton: false,

      customClass: {
          popup: 'popup-style',
          icon: 'icon-style',
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const auth = getAuth();
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

//emulator things
const auth = getAuth();
//connectAuthEmulator(auth, "http://localhost:9099");

const db = getFirestore();
//connectFirestoreEmulator(db, 'localhost', 8080);
//emulator things

googleProvider.setCustomParameters({
  prompt: 'select_account'
});

function validateEmail (emailAdress)
{
  let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (emailAdress.match(regexEmail)) {
    return true; 
  } else {
    return false; 
  }
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
window.recaptchaVerifier.render();

//Send Email 
document.getElementById("signup").addEventListener('click', (e) => {
    let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    var email = document.getElementById("email").value;
    if (email==="" || email===null){
      errorOkPopUp('Invalid Email', 'Email cannot be empty');
    }
    else if (!validateEmail(email)){
      errorOkPopUp('Invalid Email', 'Please enter a valid email');
    }
    else {
      if (isCaptchaVerified){
        sendPasswordResetEmail(auth, email, actionCodeSettings)
          .then(() => {
            SuccessOkPopUp('Email for Password Reset Sent', 'Please check your email to proceed');
          })
          .catch((error) => {
              const errorCode = error.code;
              if (errorCode === "auth/invalid-email"){
                errorOkPopUp('Email Failed to Send', 'Email address is not valid');
              }
              else{
                errorOkPopUp('Email Failed to Send', 'An error has occured in sending your email. An account with this email address may not have been registered yet.');
              }
          });
        isCaptchaVerified = false;
        grecaptcha.reset(window.recaptchaVerifier);
      }else{
        errorOkPopUp('Email Failed to Send', 'Please complete the reCAPTCHA verification');
      }
    };
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