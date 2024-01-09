import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-app.js";
import { getAuth, onAuthStateChanged, connectAuthEmulator, GoogleAuthProvider, FacebookAuthProvider, signOut}
from 'https://www.gstatic.com/firebasejs/9.6.7/firebase-auth.js';
import { doc, getDoc,  getFirestore,} from 'https://www.gstatic.com/firebasejs/9.6.7/firebase-firestore.js'; 

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

//ordernow
document.getElementById("ordernow").addEventListener('click', (e) => {
    window.location.href = "menu.html";
});