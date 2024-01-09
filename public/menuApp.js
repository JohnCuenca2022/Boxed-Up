import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-app.js";
import { getAuth, onAuthStateChanged, connectAuthEmulator, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider, 
  signInWithEmailAndPassword} from 'https://www.gstatic.com/firebasejs/9.6.7/firebase-auth.js';
import { doc, setDoc, getDoc, getFirestore, connectFirestoreEmulator, collection, getDocs, updateDoc, increment, 
    arrayUnion, query, where} from 'https://www.gstatic.com/firebasejs/9.6.7/firebase-firestore.js';

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

const Toast = Swal.mixin({
    toast: true,
    position: 'top-right',
    iconColor: 'black',
    customClass: {
      popup: 'colored-toast'
    },
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true
})

//display menu items
const querySnapshot = await getDocs(query(collection(db, "products"), where("status", "==", "available"), where("quantity", ">", 0)));
querySnapshot.forEach((doc) => {
    document.getElementById("menuContainer").innerHTML +=`
        <div class="box" id="`+doc.data().productname+`">
            <img src="`+doc.data().image+`" alt="`+doc.data().productname+`">
            <h2>`+doc.data().productname+`</h2>
            <h2>₱ `+doc.data().price+`</h2>
        </div>
    `;
});

//menu item pop-up forms
querySnapshot.forEach((doc) => {
    document.getElementById(doc.data().productname).addEventListener('click', (e) => {
        openLoginForm(doc.data().productname,doc.data().price,doc.id,doc.data().description);
    });
});

//close pop-upform on outside click
document.getElementById("orderPopUp").addEventListener('click', (e) => {
    closeLoginForm();
});

//show PopUp Form
function openLoginForm(productname,productprice,productID,productDesc){
    var desc = "";
    if (productDesc != "" && productDesc != null){
        desc = `<h5 style="text-align:left;margin-top:0.3rem;font-family: Montserrat-Regular;"><i>`+productDesc+`</i></h5>`;
    }
    document.getElementById("popUpBox").innerHTML = `
        <div style="margin-left:2rem;margin-right:2rem;">
            <div style="display:grid;grid-template-columns:repeat(2, 1fr);">
                <h3 style="text-align:left;font-family: Montserrat-SemiBold;overflow-wrap:anywhere;margin-bottom:0">`+productname+`</h3>
                <h3 style="text-align:right;margin-bottom:0" id="displayPrice">₱`+productprice+`.00</h3>
            </div>
            `+desc+`
            <h4 style="text-align:left;margin-top:1rem;margin-bottom:0;font-family: Montserrat-Regular;">Quantity</h4>
            <div style="display:grid;grid-template-columns:repeat(5, 1fr);">
                <div class="orderQuantity" style="grid-column:1/1;">
                    <button id="subtractBtn" class="subtractBtn" style="text-align:right;margin-top:0.85rem;height:2rem;width:1.5rem;grid-column:2/3"><b>-</b></button>
                    <input type="number" value="1" oninput="this.value=this.value.slice(0,4)" class="orderqtytxtbox" id="quantity"/>
                    <button id="addBtn" class="addBtn"style="text-align:left;margin-top:0.85rem;height:2rem;width:1.5rem;grid-column:4/5"><b>+</b></button>
                </div>
            </div>
            <h4 style="text-align:left;margin-bottom:0.5rem;font-family: Montserrat-Regular;">Special Instructions</h4>
            <div class="orderInstructions">
                <textarea class="ordertxtbox" id="orderInstruc"></textarea>
            </div>
        </div>
        <div class="placeOrderContainer">
            <button class="placeOrderButton" id="placeOrderButton">Add to Cart</button> 
        </div>
    `;
    document.getElementById("orderPopUp").style.display = "block";
    document.getElementById("popUpBox").style.visibility = "visible";
    document.getElementById("popUpBox").style.opacity = "1";

    //default value changer
    document.getElementById("quantity").addEventListener('focusout', () => {
        var elem = document.getElementById("quantity");
        if (elem.value.replace(/\s+/g, '') === ""){
            elem.value = '1';
            var newval = document.getElementById("quantity").value;
            document.getElementById("displayPrice").innerHTML = `₱`+productprice*newval+`.00`
        }
        else if (elem.value.startsWith("0")){
            elem.value = '1';
            var newval = document.getElementById("quantity").value;
            document.getElementById("displayPrice").innerHTML = `₱`+productprice*newval+`.00`
        }
    });

    //change total for new input
    document.getElementById("quantity").addEventListener('input', function (evt) {
        var newval = document.getElementById("quantity").value;
        document.getElementById("displayPrice").innerHTML = `₱`+productprice*newval+`.00`
    });

    //allows only numerical input
    document.getElementById("quantity").addEventListener("keypress", function (evt) {
        if (evt.which < 48 || evt.which > 57){
            evt.preventDefault();
        }
    });

    //subtract
    document.getElementById("subtractBtn").addEventListener('click', (e) => {
        var val = document.getElementById("quantity").value;
        if (val>1){
            document.getElementById("quantity").value = val-1;
            var newval = document.getElementById("quantity").value;
            document.getElementById("displayPrice").innerHTML = `₱`+productprice*newval+`.00`
        }
    });

    //add
    document.getElementById("addBtn").addEventListener('click', (e) => {
        var val = document.getElementById("quantity").value;
        var valnum = parseInt(val);
        var newval = valnum + 1
        document.getElementById("quantity").value = newval;
        document.getElementById("displayPrice").innerHTML = `₱`+productprice*newval+`.00`
    });

    //order button
    document.getElementById("placeOrderButton").addEventListener('click', (e) => {
        var qty = document.getElementById("quantity").value;
        qty = parseInt(qty, 10);
        var instruc = document.getElementById("orderInstruc").value;
        var user = auth.currentUser;
        if (user) {
            getDoc(doc(db, "users", user.uid)).then(docSnap => {
                if (docSnap.exists()) {
                    const info = docSnap.data();
                    const actOrder = docSnap.data().activeOrder;
                    //create new active order if does not exist yet
                    if (actOrder==="" || actOrder===null){
                        //generate random order id
                        while(true){
                            var rString = randomString(6, '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ');
                            var exists;
                            //get order document with random id
                            getDoc(doc(db, "orders", rString)).then(docSnap => {
                                //check if order id has already been used
                                if (docSnap.exists()) {
                                    exists=true;
                                }else{
                                    //add order id to activeOrder field in user document
                                    const userDBRef = doc(db, "users", user.uid);
                                    setDoc(userDBRef, {
                                        activeOrder:rString,
                                    }, {merge:true});

                                    //create order document in orders collections
                                    const orderDBRef = doc(db, "orders", rString);
                                    setDoc(orderDBRef, {
                                        cartItems:[{quantity:qty,productId:productID,specInstruc:instruc}],
                                        payment:"",
                                        status:"inCart",
                                        total:0,
                                        userid:user.uid,
                                    });
                                    Toast.fire({
                                        icon: 'success',
                                        title: 'Item Added to Cart'
                                    })
                                    closeLoginForm();
                                }
                            }).catch((error) => {
                                    
                            });

                            if(exists){
                                continue;
                            }else{
                                break;
                            }
                        }
                    }
                    //append new order to activeOrder of user
                    else{
                        const orderDBRef = doc(db, "orders", actOrder);
                        updateOrderArray(actOrder,orderDBRef,qty,productID,instruc);
                        Toast.fire({
                            icon: 'success',
                            title: 'Item Added to Cart'
                        })
                        closeLoginForm();
                    }
                } else {
                    console.log("No such document!");
                }
            })
        } else {
            window.location.href = "sign-in.html";
        }
    });
}

async function arrayGenerator(actOrder,qty,productID,instruc){
    var duplicate = false;
    var dataArray = [];
    await getDoc(doc(db, "orders", actOrder)).then(docSnap => {
        for (let i = 0; i < docSnap.data().cartItems.length; i++) {
            if (docSnap.data().cartItems[i].productId === productID && docSnap.data().cartItems[i].specInstruc === instruc){
                duplicate = true;
                var oldQty = docSnap.data().cartItems[i].quantity
                var newQty = oldQty + qty;
                dataArray.push({productId:productID,quantity:newQty,specInstruc:instruc});
            }else{
                dataArray.push(docSnap.data().cartItems[i]);
            }
        } 
    });
    return [duplicate, dataArray];
}

async function updateOrderArray(actOrder,orderDBRef,qty,productID,instruc){
    var result = await arrayGenerator(actOrder,qty,productID,instruc);
    var duplicate = result[0];
    var newArray = result[1];
    if(duplicate){
        setDoc(orderDBRef, {
            cartItems:newArray,
        }, {merge:true});
    }else{
        await updateDoc(orderDBRef, {
            cartItems: arrayUnion({quantity:qty,productId:productID,specInstruc:instruc})
        }).catch((error) => {
            console.log(error.message);
        });
    }
}

//hide PopUp Form
function closeLoginForm(){
    document.getElementById("orderPopUp").style.display = "none";
    document.getElementById("popUpBox").style.visibility = "hidden";
    document.getElementById("popUpBox").style.opacity = "0";
}

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


//generate random key
function randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}
