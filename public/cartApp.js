import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-app.js";
import { getAuth, onAuthStateChanged, connectAuthEmulator, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider, 
  signInWithEmailAndPassword} from 'https://www.gstatic.com/firebasejs/9.6.7/firebase-auth.js';
import { doc, setDoc, getDoc, getFirestore, connectFirestoreEmulator, collection, getDocs, updateDoc, increment, 
    arrayUnion, query, where, onSnapshot } from 'https://www.gstatic.com/firebasejs/9.6.7/firebase-firestore.js';

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

function display(value){
    var qty = value.quantity;
    var specIns = value.specInstruc;
    var producID = value.productId;
    getDoc(doc(db, "products", producID)).then(docSnap => {
        if (docSnap.exists()) {
            const info =  docSnap.data()

            var prodImage = info.image;
            var prodName = info.productname;
            var prodPrice = info.price;

            var htmlstring = `
            <div class="orderBox">
                <div style="margin:auto;display:grid;grid-template-columns:repeat(11, 1fr);text-align:left;width:94%;">
                    <div class="orderImage">
                        <img src="`+prodImage+`" alt="">
                    </div>
                    <div class="orderName">
                        <div class="labelContainer" style="display:block">
                            <h3>`+prodName+`</h3>
                    </div>
                    </div>
                    <div class="orderInstructions">
                        <textarea class="ordertxtbox" id="orderInstruc" placeholder="Any special instructions?">`+specIns+`</textarea>
                    </div>
                    <div class="orderQuantity">
                        <button class="subtractBtn" style="text-align:right;margin-top:1rem;height:2rem;width:1.5rem;grid-column:2/3"><b>-</b></button>
                        <input type="number" value="`+qty+`" class="orderqtytxtbox" id="quantity"/>
                        <button class="addBtn"style="text-align:left;margin-top:1rem;height:2rem;width:1.5rem;grid-column:4/5"><b>+</b></button>
                    </div>
                    <div class="orderPrice">
                        <div class="labelContainer" style="display:block; text-align: center;">
                            <h3 class=`+prodPrice+`>₱`+prodPrice*qty+`.00</h3>
                        </div>
                    </div>
                    <div class="orderCancel">
                        <button id="orderCancelButton" style="margin-top:-3rem;width:1.5rem;">
                            <i class="fa-solid fa-xmark"></i>
                        </button>
                    </div>
                </div>
            </div>
            `
            document.getElementById('orderContainer').innerHTML += htmlstring;
            addFunctionality();
        };
    });
};

//userdata
function changeInfo(){
    onAuthStateChanged(auth, (user) => {
        if (user) {
            var orderid;
            getDoc(doc(db, "users", user.uid)).then(docSnap => {
                document.getElementById('orderContainer').innerHTML = ``;
                if (docSnap.exists()) {
                    const info =  docSnap.data()
                    document.getElementById("firstname").value = info.firstname;
                    document.getElementById("lastname").value = info.lastname;
                    document.getElementById("contact").value = info.contact;
                    document.getElementById("street").value = info.street;
                    document.getElementById("city").value = info.city;
                    document.getElementById("province").value = info.province;
                    document.getElementById('email').value = info.email;
                    orderid = info.activeOrder;
                    var dataArray;
                    getDoc(doc(db, "orders", orderid)).then(docSnap => {
                        if (docSnap.exists()) {
                            const info =  docSnap.data();
                            dataArray = info.cartItems;
                            dataArray.forEach(display);
                            var status = info.status;
                            if (status==="accepted"){
                                Swal.fire({
                                    title: orderid,
                                    text: '',
                                    //confirmButtonText: 'OK',
                                    confirmButtonColor: '#BC875E',
                                    background: '#F6EED4',
                                    icon: "success",
                                    html:
                                        '<h3 style="text-align:center;">Your order was accepted!</h3>' + 
                                        '<p>Click <a href="https://www.facebook.com/BoxedupPH/">HERE</a> and message Boxed Up on Facebook</p>' + 
                                        '<p>Send the Order ID above for further details regarding your order</p>'+
                                        '<p><u>Important: After sending your Order ID to BoxedUP Facebook page, please wait for your order to be confimed BEFORE sending payment through GCash</u></p>'+
                                        '<img src="assets/gcashqr.jpg" alt="gcash QR" style="width:90%;border-radius:20px">',
                                
                                    customClass: {
                                        popup: 'popup-style',
                                        confirmButton: 'button-width',
                                        htmlContainer: 'htmlContainer-italicize'
                                    }
                                })
                            }
                            else if(status==="declined"){
                                const orderDBRef = doc(db, "orders", orderid); 
                                setDoc(orderDBRef, {
                                    status:"inCart",
                                    total:0,
                                }, {merge:true});
                                const statsRef = doc(db, "stats", "userStats");
                                updateDoc(statsRef, {
                                    totalOrders: increment(-1)
                                });
                                errorOkPopUp('Order request has been declined', 
                                'Reasons for an order to be declined can be seen at the FAQ page');
                            }
                            else if(status==="completed"){
                                Swal.fire({  
                                    title: 'Order Complete',
                                    text: 'Thank you for ordering at Boxed Up!',
                                    showCancelButton: false,  
                                    confirmButtonText: `Confirm`,
                                    confirmButtonColor: '#BC875E',
                                    cancelButtonColor: '#BC875E',
                                    background: '#F6EED4',
                                    customClass: {
                                        popup: 'popup-style',
                                        icon: 'icon-style',
                                        confirmButton: 'button-width2',
                                        cancelButton: 'button-width2',
                                        htmlContainer: 'htmlContainer-italicize'
                                    }
                              
                                }).then((result) => {  
                                    if (result.isConfirmed) {
                                        const userDBRef = doc(db, "users", user.uid); 
                                        setDoc(userDBRef, {
                                            activeOrder:"",
                                        }, {merge:true});
                                        setTimeout(function(){document.location.href = "index.html"},3000);
                                        const statsRef = doc(db, "stats", "userStats");
                                        updateDoc(statsRef, {
                                            totalCompletedOrders: increment(1)
                                        });
                                    }
                                });                                
                            }
                        } else {
                            console.log("No such document!");
                        }
                    })
                    
                } else {
                    console.log("No such document!");
                }
            });
        } else {
             //window.location.href = "index.html";
        }
    });
}

changeInfo();

var unsub;
onAuthStateChanged(auth, (user) => {
    if(user){
        var orderid;
        getDoc(doc(db, "users", user.uid)).then(docSnap => {
            if (docSnap.exists()) {
                const info =  docSnap.data()
                orderid = info.activeOrder;
                unsub = onSnapshot(doc(db, "orders", orderid), (doc) => {
                    changeInfo();
                });
            }
        });
    }
});



//remove scroll function for number textbox
document.addEventListener("wheel", function(event){
    if(document.activeElement.type === "number"){
        document.activeElement.blur();
    }
});

function addFunctionality(){
    updateTotal();

    //get order document
    var userActiveOrder;
    var user = auth.currentUser;
    getDoc(doc(db, "users", user.uid)).then(docSnap => {
        if (docSnap.exists()) {
            const info =  docSnap.data()
            userActiveOrder = info.activeOrder;
        } else {
            console.log("No such document!");
        }
    });

    //qty textboxes
    const qty = document.querySelectorAll('#quantity');
    qty.forEach(element => {
        //default value changer
        var newval;
        element.addEventListener('focusout', () => {
            if (element.value.replace(/\s+/g, '') === ""){
                element.value = '1';
                newval = 1;
            }
            else if (element.value === '0'){
                element.value = '1';
                newval = 1;
            }
            else {
                newval = element.value;
            }

            //change visible total price
            const parent = $(element).parent();
            const sibling = $(parent).siblings(".orderPrice");
            const child1 = $(sibling).children(".labelContainer");
            const price = $(child1).children("h3").attr('class');
            var newTotalPrice = newval * price;
            $(child1).children("h3").html('₱'+newTotalPrice+`.00`);
            updateTotal();
        });

        //allows only numerical input
        element.addEventListener("keypress", function (evt) {
            if (evt.which < 48 || evt.which > 57){
                evt.preventDefault();
            }
        });
    });

    //subtract buttons
    const subtract = document.querySelectorAll('.subtractBtn');
    var subquan_index = 0;
    subtract.forEach(element => {
        element.setAttribute("data-index", subquan_index); 
        element.addEventListener('click', (e) => {
            var i = element.getAttribute('data-index');
            var val = $(element).siblings("#quantity").val();
            var newval;
            if (val>1){
                $(element).siblings("#quantity").val(val-1);
                newval = val-1;
            }
            else{
                newval = val;
            }

            //change visible total price
            const parent = $(element).parent();
            const sibling = $(parent).siblings(".orderPrice");
            const child1 = $(sibling).children(".labelContainer");
            const price = $(child1).children("h3").attr('class');
            var newTotalPrice = newval * price;
            $(child1).children("h3").html('₱'+newTotalPrice+`.00`);

            updateOrderQty(i, newval, userActiveOrder);
            updateTotal();
        });
        subquan_index += 1;
    });

    //add buttons
    const add = document.querySelectorAll('.addBtn');
    var addquan_index = 0;
    add.forEach(element => {
        element.setAttribute("data-index", addquan_index); 
        element.addEventListener('click', (e) => {
            var i = element.getAttribute('data-index');
            var val = $(element).siblings("#quantity").val();
            var valnum = parseInt(val);
            var newval = valnum + 1
            $(element).siblings("#quantity").val(newval);

            //change visible total price
            const parent = $(element).parent();
            const sibling = $(parent).siblings(".orderPrice");
            const child1 = $(sibling).children(".labelContainer");
            const price = $(child1).children("h3").attr('class');
            var newTotalPrice = newval * price;
            $(child1).children("h3").html('₱'+newTotalPrice+`.00`);

            updateOrderQty(i, newval, userActiveOrder);
            updateTotal();
        });
        addquan_index += 1;
    });

    //update order document instruc
    const specIns = document.querySelectorAll('#orderInstruc');
    var index = 0;
    specIns.forEach(element => {
        element.setAttribute("data-index", index); 
        element.addEventListener('focusout', () => {
            var i = element.getAttribute('data-index');
            var newText = element.value;

            updateOrderInstruc(i, newText, userActiveOrder);
            updateTotal();
        });
        index += 1;
    });

    //update order document qty
    const quan = document.querySelectorAll('#quantity');
    var quan_index = 0;
    quan.forEach(element => {
        element.setAttribute("data-index", quan_index); 
        element.addEventListener('focusout', () => {
            var i = element.getAttribute('data-index');
            var newText = element.value;

            updateOrderQty(i, newText, userActiveOrder)
            updateTotal();
        });
        quan_index += 1;
    });
    
    //remove an order
    const remove = document.querySelectorAll('#orderCancelButton');
    var remove_index = 0;
    remove.forEach(element => {
        element.setAttribute("data-index", remove_index); 
        element.addEventListener('click', () => {
            var i = element.getAttribute('data-index');
            const parent = $(element).parent();
            const parent2 = $(parent).parent();
            const parent3 = $(parent2).parent();
            parent3.fadeOut("fast","swing");

            removeOrder(i, userActiveOrder);
            updateTotal();
        });
        remove_index += 1;
    });
}

//update visual Total on page
function updateTotal(){
    const qty = document.querySelectorAll('#quantity');
    var TotalPrice = 0;
    qty.forEach(element => {
        var quant = element.value;
        const parent = $(element).parent();
        const sibling = $(parent).siblings(".orderPrice");
        const child1 = $(sibling).children(".labelContainer");
        const price = $(child1).children("h3").attr('class');
        var newTotalPrice = quant * price;
        TotalPrice += newTotalPrice;
    });
    document.getElementById('subtotal').innerHTML = '₱'+TotalPrice+'.00';
    document.getElementById('subtotal').setAttribute("data-total", (parseInt(TotalPrice))); 
    // document.getElementById('total').innerHTML = '₱'+(parseInt(TotalPrice)+50)+'.00';
    // document.getElementById('total').setAttribute("data-total", (parseInt(TotalPrice)+50)); 
}

//update instructions
function updateOrderInstruc(index, newValue, userActiveOrder){
    const orderDBRef = doc(db, "orders", userActiveOrder); 
    var dataArray = [];
    getDoc(doc(db, "orders", userActiveOrder)).then(docSnap => {
        for (let i = 0; i < docSnap.data().cartItems.length; i++) {
            if (index == i){
                dataArray.push({productId:docSnap.data().cartItems[i].productId,
                    quantity:docSnap.data().cartItems[i].quantity,
                    specInstruc:newValue});
            }else{
                dataArray.push(docSnap.data().cartItems[i]);
            }
        }
        setDoc(orderDBRef, {
            cartItems:dataArray,
        }, {merge:true});
    });
}

//update quantity
function updateOrderQty(index, newValue, userActiveOrder){
    const orderDBRef = doc(db, "orders", userActiveOrder); 
    var dataArray = [];
    getDoc(doc(db, "orders", userActiveOrder)).then(docSnap => {
        for (let i = 0; i < docSnap.data().cartItems.length; i++) {
            if (index == i){
                dataArray.push({productId:docSnap.data().cartItems[i].productId,
                    quantity:newValue,
                    specInstruc:docSnap.data().cartItems[i].specInstruc});
            }else{
                dataArray.push(docSnap.data().cartItems[i]);
            }
        }
        setDoc(orderDBRef, {
            cartItems:dataArray,
        }, {merge:true});
    });
}

function removeOrder(index, userActiveOrder){
    const orderDBRef = doc(db, "orders", userActiveOrder); 
    var dataArray = [];
    getDoc(doc(db, "orders", userActiveOrder)).then(docSnap => {
        for (let i = 0; i < docSnap.data().cartItems.length; i++) {
            if (index != i){
                dataArray.push(docSnap.data().cartItems[i]);
            }
        }
        setDoc(orderDBRef, {
            cartItems:dataArray,
        }, {merge:true});
    });
}

document.getElementById("placeOrderButton").addEventListener('click', (e) => {
    var fname = document.getElementById("firstname").value;
    var lname = document.getElementById("lastname").value;
    var contact = document.getElementById("contact").value;
    var street = document.getElementById("street").value;
    var city = document.getElementById("city").value;
    var province = document.getElementById("province").value;
    if (fname == null || fname == ""){
        errorOkPopUp('Please complete Shipping Information', 
        'Firstname cannot be empty');
        document.getElementById("firstname").focus();
    }
    else if (lname == null || lname == ""){
        errorOkPopUp('Please complete Shipping Information', 
        'Lastname cannot be empty');
        document.getElementById("lastname").focus();
    }
    else if (contact == null || contact == ""){
        errorOkPopUp('Please complete Shipping Information', 
        'Contact cannot be empty');
        document.getElementById("contact").focus();
    }
    else if (street == null || street == ""){
        errorOkPopUp('Please complete Shipping Information', 
        'Street cannot be empty');
        document.getElementById("street").focus();
    }
    else if (city == null || city == ""){
        errorOkPopUp('Please complete Shipping Information', 
        'City cannot be empty');
        document.getElementById("city").focus();
    }
    else if (province == null || province == ""){
        errorOkPopUp('Please complete Shipping Information', 
        'Province cannot be empty');
        document.getElementById("province").focus();
    }
    else{
        var user = auth.currentUser;
        const userInfoRef = doc(db, "users", user.uid);
        setDoc(userInfoRef, {
            firstname:fname,
            lastname:lname,
            contact:contact,
            street: street,
            city: city,
            province: province,
        }, {merge:true});

        Swal.fire({  
            title: 'Confirm Place Order',  
            showCancelButton: true,  
            confirmButtonText: `Confirm`,
            confirmButtonColor: '#BC875E',
            cancelButtonColor: '#BC875E',
            background: '#F6EED4',
            customClass: {
                popup: 'popup-style',
                icon: 'icon-style',
                confirmButton: 'button-width2',
                cancelButton: 'button-width2',
                htmlContainer: 'htmlContainer-italicize'
            }
    
        }).then((result) => {  
            if (result.isConfirmed) {
                var user = auth.currentUser;
                getDoc(doc(db, "users", user.uid)).then(docSnap => {
                    if (docSnap.exists()) {
                        const info =  docSnap.data()
                        var userActiveOrder = info.activeOrder;
                        getDoc(doc(db, "orders", userActiveOrder)).then(docSnap => {
                            if (docSnap.exists()) {
                                const info =  docSnap.data()
                                var userActiveOrderStatus = info.status;
                                const orderDBRef = doc(db, "orders", userActiveOrder); 
                            if (userActiveOrderStatus === "inCart"){
                                var totalprice = document.getElementById('subtotal').getAttribute("data-total");
                                var isWilling = document.getElementById('deliveryConsent').checked;
                                totalprice = parseInt(totalprice);
                                var now = new Date();   
                                setDoc(orderDBRef, {
                                    payment:"Gcash",
                                    status:"pending",
                                    total:totalprice,
                                    isWilling:isWilling,
                                    date: now,
                                }, {merge:true});
                                const statsRef = doc(db, "stats", "userStats");
                                updateDoc(statsRef, {
                                    totalOrders: increment(1)
                                });
                                SuccessOkPopUp('Order request is being processed', 
                                'Please wait for a confirmation message. The page may need to be refreshed.');
                            }
                            else if (userActiveOrderStatus === "pending"){
                                SuccessOkPopUp('Order request is being processed', 
                                'Please wait for a confirmation message. The page may need to be refreshed.');
                            }
                            else if (userActiveOrderStatus === "accepted"){
                                SuccessRedirectPopUp('Order request has been accepted', 'The page will now refresh');
                                setTimeout(function(){document.location.href = "cart.html"},3000);
                            }
                            else if (userActiveOrderStatus === "declined"){
                                setDoc(orderDBRef, {
                                    status:"inCart",
                                    total:0,
                                }, {merge:true});
                                const statsRef = doc(db, "stats", "userStats");
                                updateDoc(statsRef, {
                                    totalOrders: increment(-1)
                                });
                                errorOkPopUp('Order request has been declined', 
                                'Reasons for an order to be declined can be seen at the FAQ page');
                            }
                            }
                        });
                    }
                });
                
                
                
            }
        });
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