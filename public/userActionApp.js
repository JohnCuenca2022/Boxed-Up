import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-app.js";
import { getAuth, onAuthStateChanged, connectAuthEmulator, GoogleAuthProvider, FacebookAuthProvider, 
  isSignInWithEmailLink, signInWithEmailLink, updatePassword, verifyPasswordResetCode, confirmPasswordReset, signOut} from 'https://www.gstatic.com/firebasejs/9.6.7/firebase-auth.js';
import { doc, setDoc, getDoc, getFirestore, connectFirestoreEmulator, updateDoc, increment  } from 'https://www.gstatic.com/firebasejs/9.6.7/firebase-firestore.js'; 

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
  url: 'https://fir-boxedupph-hosting.web.app/verify.html',
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

var user = auth.currentUser;

googleProvider.setCustomParameters({
  prompt: 'select_account'
});

function getParameterByName(name) {
    var url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

document.getElementById("signUp").style.display = "block";
document.getElementById("resetPassword").style.display = "none";

document.addEventListener('DOMContentLoaded', () => {
    // TODO: Implement getParameterByName()
  
    // Get the action to complete.
    const mode = getParameterByName('mode');
    // Get the one-time code from the query parameter.
    const actionCode = getParameterByName('oobCode');
    // (Optional) Get the continue URL from the query parameter if available.
    const continueUrl = getParameterByName('continueUrl');
    // (Optional) Get the language code if available.
    const lang = getParameterByName('lang') || 'en';
  
    // Handle the user management action.
    switch (mode) {
        case 'signIn':
            document.getElementById("signUp").style.display = "block";
            document.getElementById("resetPassword").style.display = "none";
            document.getElementById('docTitle').innerHTML = 'Sign Up';
            document.getElementById('topheader').innerHTML = 'COMPLETE ACCOUNT CREATION';
            handleSignIn(actionCode, continueUrl, lang);
            break;
        case 'resetPassword':
            document.getElementById("signUp").style.display = "none";
            document.getElementById("resetPassword").style.display = "block";
            document.getElementById("emailInputContainer").style.display = "none";
            document.getElementById('docTitle').innerHTML = 'Password Reset';
            document.getElementById('topheader').innerHTML = 'CHANGE PASSWORD';
            handleResetPassword(actionCode, continueUrl, lang);
            break;
        default:
            errorRedirectPopUp('Invalid Session', 'Redirecting to Home Page');
            setTimeout(function(){document.location.href = "index.html"},500);
    }
}, false);

function handleSignIn(actionCode, continueUrl, lang){
    if (!isSignInWithEmailLink(auth, window.location.href)) {
        errorRedirectPopUp('Invalid Session', 'Redirecting to Home Page');
        setTimeout(function(){document.location.href = "index.html"},500);
    }
    var email = window.localStorage.getItem('emailForSignIn'); //get email
    document.getElementById('email').value = email; //display email
}

function handleResetPassword(actionCode){
    //check if code is valid
    verifyPasswordResetCode(auth, actionCode)
    .then(function(){
        //valid code
    })
    .catch(function(){
        errorRedirectPopUp('Invalid Session', 'Redirecting to Home Page');
        setTimeout(function(){document.location.href = "index.html"},500);
    })
}

//check if valid email
function validateEmail (emailAdress){
    let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (emailAdress.match(regexEmail)) {
        return true;
    } else {
        return false;
    }
}

async function incrementTotalUsersStats(){
    const userStatsRef = doc(db, "stats", "userStats");
    await updateDoc(userStatsRef, {
        totalUsers: increment(1)
    });
}

//Email Sign Up
document.getElementById("signUp").addEventListener('click', (e) => {
    var email = document.getElementById('email').value;
    var password = document.getElementById("id_password").value;
    var passwordConfirm = document.getElementById("id_password2").value;
    var decimal=  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,128}$/; //password complexity

    if (email==="" || email===null){
        errorOkPopUp('Invalid Email', 'Email cannot be empty');
    }
    else if (!validateEmail(email)){
        errorOkPopUp('Invalid Email', 'Please enter a valid email');
    }
    else if (password === null || passwordConfirm === null || password === "" || passwordConfirm === ""){
        errorOkPopUp('Invalid Password', 'Password cannot be empty');
    }
    else if (password != passwordConfirm){
        errorOkPopUp('Password Mismatch', 'Passwords must match');
    }
    else if(!password.match(decimal)){
        errorOkPopUp('Invalid Password', 'Password must be 8-128 characters long, have at least 1 uppercase, 1 lowercase, 1 numerical, and 1 special character.');
    }
    else{
        if (isSignInWithEmailLink(auth, window.location.href)) {
            //create account
            signInWithEmailLink(auth, email, window.location.href)
            .then((result) => {
                user = auth.currentUser;
                //add user data
                console.log(user.uid);
                getDoc(doc(db, "users", user.uid)).then(docSnap => {
                if (docSnap.exists()) {
                    console.log('exists');
                    window.localStorage.removeItem('emailForSignIn');
                    signOut(auth).then(() => {
                        console.log("signed out");
                    }).catch((error) => {
                    });
                    errorOkPopUp('Account Creation Error', 'Email has already been used');
                } else {
                    console.log('new user');
                    const userDBRef = doc(db, "users", user.uid);
                    setDoc(userDBRef, {
                        city:"",
                        contact:"",
                        firstname:"",
                        lastname:"",
                        province:"",
                        role:"user",
                        street:"",
                        email:user.email,
                        image:"",
                        activeOrder:"",
                    });
                    // Clear email from storage.
                    window.localStorage.removeItem('emailForSignIn');

                    //add password
                    
                    updatePassword(user, password).then(() => {
                        console.log('new pass added');
                    }).catch((error) => {
                        const errorCode = error.code;
                        console.log(errorCode);
                        errorOkPopUp('Account Creation Error', 'There has been an error in creating your account');
                    });

                    //return role for navbar
                    getDoc(doc(db, "users", user.uid)).then(docSnap => {
                        if (docSnap.exists()) {
                            const info =  docSnap.data()
                            role = info.role;
                        } else {
                            console.log("No such document!");
                        }
                    })

                    //redirect if successful
                    SuccessRedirectPopUp('Account Creation Successful', 'Welcome to Boxed Up!')
                    incrementTotalUsersStats();
                    setTimeout(function(){document.location.href = "index.html"},1000);
                }
                }).catch((error) => {
                    const errorCode = error.code;
                    console.log(errorCode);
                    if (errorCode === "auth/email-already-in-use"){
                        errorOkPopUp('Account Creation Error', 'Email has already been used');
                    } else {
                        errorOkPopUp('Account Creation Error', 'There has been an error in creating your account');
                    }
                });

            }).catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode);
                console.log(errorMessage);
                if (errorCode === "auth/invalid-email"){
                    errorOkPopUp('Account Creation Error', 'Email does not match registered email');
                }
                else if (errorCode === "auth/invalid-action-code"){
                    errorOkPopUp('Invalid Session', 'Link has expired');
                }
                else{
                    console.log(errorCode);
                    errorOkPopUp('Account Creation Error', 'There has been an error in creating your account');
                }
            });
        } else {
            errorRedirectPopUp('Invalid Session', 'Redirecting to Home Page');
            setTimeout(function(){document.location.href = "index.html"},500);
        }
    }
});

//Password Reset
document.getElementById("resetPassword").addEventListener('click', (e) => {
    const actionCode = getParameterByName('oobCode');
    var password = document.getElementById("id_password").value;
    var passwordConfirm = document.getElementById("id_password2").value;
    var decimal=  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,128}$/; //password complexity
    
    if (password === null || passwordConfirm === null || password === "" || passwordConfirm === ""){
        errorOkPopUp('Invalid Password', 'Password cannot be empty');
    }
    else if (password != passwordConfirm){
        errorOkPopUp('Password Mismatch', 'Passwords must match');
    }
    else if(!password.match(decimal)){
        errorOkPopUp('Invalid Password', 'Password must be 8-128 characters long, have at least 1 uppercase, 1 lowercase, 1 numerical, and 1 special character.');
    }
    else{
        confirmPasswordReset(auth, actionCode, password)
        .then(function() {
            SuccessRedirectPopUp('Password Reset Successful', 'Redirecting to Login Page')
            setTimeout(function(){document.location.href = "index.html"},500);
        })
        .catch(function() {
            const errorCode = error.code;
            if (errorCode === "auth/expired-action-code"){
                errorOkPopUp('Error Changing Password', 'Code Has Expired');
            }
            else if (errorCode === "auth/invalid-action-code"){
                errorOkPopUp('Error Changing Password', 'Invalid Code');
            }
            else if (errorCode === "auth/user-disabled"){
                errorOkPopUp('Error Changing Password', 'User not found');
            }
            else if (errorCode === "auth/user-not-found"){
                errorOkPopUp('Error Changing Password', 'User not found');
            }
            else{
                errorOkPopUp('Error Changing Password', 'Please try again');
            }
        })
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
        console.log("hello world")
    } else {
        window.location.href = "sign-in.html";
        console.log("hello world123")
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