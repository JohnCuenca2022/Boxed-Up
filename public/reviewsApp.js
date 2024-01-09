import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-app.js";
import { getAuth, onAuthStateChanged, connectAuthEmulator, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider, 
  signInWithEmailAndPassword} from 'https://www.gstatic.com/firebasejs/9.6.7/firebase-auth.js';
import { doc, setDoc, getDoc, getFirestore, connectFirestoreEmulator, collection, getDocs, query, orderBy, where } from 'https://www.gstatic.com/firebasejs/9.6.7/firebase-firestore.js';

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
//connectAuthEmulator(auth, "http://localhost:9099");

const db = getFirestore();
//connectFirestoreEmulator(db, 'localhost', 8080);

googleProvider.setCustomParameters({
  prompt: 'select_account'
});

const querySnapshot = await getDocs(query(collection(db, "reviews"), where("status","==","visible"), orderBy("reviewdate", "desc")));
querySnapshot.forEach((doc) => {
    var image = doc.data().image;
    var imageHTML = "";
    if (image != "" && image != null){
        imageHTML = '<img style="height:12rem;margin-top:1rem;" src="'+image+'">'
    }
    var rating = doc.data().rating;
    let stars = '<span class="fa fa-star checked"></span>\n';
    let multiStars = stars.repeat(rating);
    let nostar = '<span class="fa fa-star"></span>\n';
    let multiNoStar = nostar.repeat(5-rating);

    var options = { year: 'numeric', month: 'long', day: 'numeric' };
    var date  = doc.data().reviewdate;
    var realdate = date.toDate()
    document.getElementById("reviewsContainer").innerHTML +=`
        <div class="rcorners1">
            <div class="textcontainer">
                <div style="display: flex; margin-bottom:-1rem;">
                    <h2 style="display:inline;padding:0;">`+doc.data().fullname+`</h2>
                    <h3 style="display:inline;padding:0;margin-left: auto; margin-right: 0;
                    font-family: Montserrat-Thin;">`+realdate.toLocaleString("en-PH", options)+`</h3>
                </div>
                `+multiStars + multiNoStar+`<br>
                `+imageHTML+`
                <h3 style="font-family: Montserrat-Light;">`+doc.data().commentsnippet+`</h3>
            </div>
        </div>
    `;
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