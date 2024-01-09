import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-app.js";
import { getAuth, onAuthStateChanged, connectAuthEmulator, GoogleAuthProvider, FacebookAuthProvider, signOut  } 
from 'https://www.gstatic.com/firebasejs/9.6.7/firebase-auth.js';
import { doc, setDoc, getDoc, getFirestore, connectFirestoreEmulator, collection, getDocs, query, orderBy, where, updateDoc, increment } from 'https://www.gstatic.com/firebasejs/9.6.7/firebase-firestore.js';
import { getStorage, ref as sRef, uploadBytesResumable, getDownloadURL } from 'https://www.gstatic.com/firebasejs/9.6.7/firebase-storage.js';

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
//emulator things

//Sweet aler toast notif
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

//decrement products
async function incrementTotalProducts(product, num){
    const userStatsRef = doc(db, "products", product);
    await updateDoc(userStatsRef, {
        quantity: increment(num)
    });
}

async function incrementTotalCompletedOrders(){
    const userStatsRef = doc(db, "stats", "userStats");
    await updateDoc(userStatsRef, {
        totalCompletedOrders: increment(1)
    });
}

async function incrementTotalOrders(){
    const userStatsRef = doc(db, "stats", "userStats");
    await updateDoc(userStatsRef, {
        totalOrders: increment(1)
    });
}
  

//userdata
onAuthStateChanged(auth, (user) => {
    if (user) {
        getDoc(doc(db, "users", user.uid)).then(docSnap => {
            if (docSnap.exists()) {
                const info =  docSnap.data()
                if (info.image!=""){
                    document.getElementById("profileImage").src=info.image;
                }else{
                    document.getElementById("profileImage").src="assets/default_profile.png";
                }
                let name = "";
                if (info.firstname != ""){
                    name = name + info.firstname;
                }
                if (info.lastname != ""){
                    name = name + " " + info.lastname;
                }
                if (name != ""){
                    document.getElementById("displayname").innerText = name;
                }
            } else {
                console.log("No such document!");
            }
          })
    } else {
        //window.location.href = "index.html";
    }
});

//navbar
document.getElementById("userlogin").addEventListener('click', (e) => {
  var user = auth.currentUser;
  if (user) {
      window.location.href = "profile.html";
      console.log("hello world")
  } else {
      window.location.href = "sign-in.html";
      console.log("hello world123")
  }
});

//logout
document.getElementById("logout").addEventListener('click', (e) => {
    const auth = getAuth();
    signOut(auth).then(() => {
        window.location.href = "index.html";
        console.log("signed out");
    }).catch((error) => {
        console.log("A Sign out error occured");
    });
});

//userstats dashboard data
async function userStats(){
    const docRef = doc(db, "stats", "userStats");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        document.getElementById("totalusers").innerText = docSnap.data().totalUsers;
        document.getElementById("totalorders").innerText = docSnap.data().totalOrders;
        document.getElementById("comporders").innerText = docSnap.data().totalCompletedOrders;
    } else {
    console.log("No such document!");
    }
}

//initialize dashboard data
userStats();
areaGraph();
pieGraph();

//orderslist data
async function ordersList(){
    document.getElementById("itemDisplayOrderscontent").innerHTML = ``;
    const querySnapshotOrders = await getDocs(query(collection(db, "orders"), where("status", "!=", "inCart"), orderBy("status"), orderBy("date", "desc")));
    var orderCounter = 0;
    querySnapshotOrders.forEach((docu) => {
        var orderDate = docu.data().date;
        var realdate = orderDate.toDate()
        var options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute:'numeric'};
        if(orderCounter%2===0){
            document.getElementById("itemDisplayOrderscontent").innerHTML +=`
            <div class="item">
                <div style="display:grid;grid-template-columns: repeat(9, 1fr)">
                    <h5 id="orderid"style="grid-column: 1 / 3">`+docu.id+`</h5>
                    <h5 style="grid-column: 3 / 5">`+docu.data().userid+`</h5>
                    <h5 style="grid-column: 5 / 7">`+realdate.toLocaleString("en-PH", options)+`</h5>
                    <h5 id="status" style="grid-column: 7 / 8"><u>`+docu.data().status+`</u></h5>
                    <h5 style="grid-column: 8 / 9">`+docu.data().payment+`</h5>
                    <h5 style="grid-column: 9 / 10">₱`+docu.data().total+`</h5>
                </div>
            </div>
        `;
        } else {
            document.getElementById("itemDisplayOrderscontent").innerHTML +=`
            <div class="itemColored">
                <div style="display:grid;grid-template-columns: repeat(9, 1fr)">
                    <h5 id="orderid" style="grid-column: 1 / 3">`+docu.id+`</h5>
                    <h5 style="grid-column: 3 / 5">`+docu.data().userid+`</h5>
                    <h5 style="grid-column: 5 / 7">`+realdate.toLocaleString("en-PH", options)+`</h5>
                    <h5 id="status" style="grid-column: 7 / 8"><u>`+docu.data().status+`</u></h5>
                    <h5 style="grid-column: 8 / 9">`+docu.data().payment+`</h5>
                    <h5 style="grid-column: 9 / 10">₱`+docu.data().total+`</h5>
                </div>
            </div>                       
        `;
        }
        orderCounter++;
    });
    addFunctionality();
}

//userslist data
async function usersList(){
    document.getElementById("itemDisplayUserscontent").innerHTML = ``;
    const querySnapshotUsers = await getDocs(collection(db, "users"));
    var userCounter = 0;
    querySnapshotUsers.forEach((doc) => {
        if(userCounter%2===0){
            document.getElementById("itemDisplayUserscontent").innerHTML +=`
            <div class="item">
                <div style="display:grid;grid-template-columns: repeat(6, 1fr)">
                    <h5>`+doc.id+`</h5>
                    <h5>`+doc.data().lastname+`</h5>
                    <h5>`+doc.data().firstname+`</h5>
                    <h5>`+doc.data().email+`</h5>
                    <h5>`+doc.data().role+`</h5>
                    <h5>`+doc.data().street+` `+doc.data().city+` `+doc.data().province+`</h5>
                </div>
            </div>                      
        `;
        } else {
            document.getElementById("itemDisplayUserscontent").innerHTML +=`
            <div class="itemColored">
                <div style="display:grid;grid-template-columns: repeat(6, 1fr)">
                    <h5>`+doc.id+`</h5>
                    <h5>`+doc.data().lastname+`</h5>
                    <h5>`+doc.data().firstname+`</h5>
                    <h5>`+doc.data().email+`</h5>
                    <h5>`+doc.data().role+`</h5>
                    <h5>`+doc.data().street+` `+doc.data().city+` `+doc.data().province+`</h5>
                </div>
            </div>                       
        `;
        }
        userCounter++;
    });
}

//productslist data
async function productsList(){
    document.getElementById("itemDisplayProductscontent").innerHTML = ``;
    const querySnapshotProducts = await getDocs(collection(db, "products"));
    var productsCounter = 0;
    querySnapshotProducts.forEach((doc) => {
        if(productsCounter%2===0){
            document.getElementById("itemDisplayProductscontent").innerHTML +=`
            <div class="item">
                <div style="display:grid;grid-template-columns: repeat(7, 1fr)">
                    <h5 id="productid">`+doc.id+`</h5>
                    <h5>`+doc.data().productname+`</h5>
                    <h5>₱`+doc.data().price+`</h5>
                    <h5>`+doc.data().quantity+`</h5>
                    <h5>`+doc.data().status+`</h5>
                    <img src="`+doc.data().image+`" alt="`+doc.data().productname+`">
                    <button class="editButton" id="productEditButton">Edit</button>
                </div>
            </div>                       
        `;
        } else {
            document.getElementById("itemDisplayProductscontent").innerHTML +=`
            <div class="itemColored">
                <div style="display:grid;grid-template-columns: repeat(7, 1fr)">
                    <h5 id="productid">`+doc.id+`</h5>
                    <h5>`+doc.data().productname+`</h5>
                    <h5>₱`+doc.data().price+`</h5>
                    <h5>`+doc.data().quantity+`</h5>
                    <h5>`+doc.data().status+`</h5>
                    <img src="`+doc.data().image+`" alt="`+doc.data().productname+`">
                    <button class="editButton" id="productEditButton">Edit</button>
                </div>
            </div>                       
        `;
        }
        productsCounter++;
    });
    addFunctionality();
}

//reviewslist data
async function reviewsList(){
    document.getElementById("itemDisplayReviewscontent").innerHTML = ``;
    const querySnapshotReviews = await getDocs(query(collection(db, "reviews"), orderBy("reviewdate", "desc")));
    var userCounter = 0;
    querySnapshotReviews.forEach((doc) => {
        var reviewDate = doc.data().reviewdate;
        var realdate = reviewDate.toDate()
        var options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute:'numeric'};
        if(userCounter%2===0){
            document.getElementById("itemDisplayReviewscontent").innerHTML +=`
            <div class="item">
                <div style="display:grid;grid-template-columns: repeat(7, 1fr)">
                    <h5 id="reviewid">`+doc.id+`</h5>
                    <h5>`+realdate.toLocaleString("en-PH", options)+`</h5>
                    <h5>`+doc.data().fullname+`</h5>
                    <h5>`+doc.id+`</h5>
                    <h5>`+doc.data().commentsnippet+`</h5>
                    <h5>`+doc.data().rating+`</h5>
                    <h5 id="status">`+doc.data().status+`</h5>
                </div>
            </div>                      
        `;
        } else {
            document.getElementById("itemDisplayReviewscontent").innerHTML +=`
            <div class="itemColored">
                <div style="display:grid;grid-template-columns: repeat(7, 1fr)">
                    <h5 id="reviewid">`+doc.id+`</h5>
                    <h5>`+realdate.toLocaleString("en-PH", options)+`</h5>
                    <h5>`+doc.data().fullname+`</h5>
                    <h5>`+doc.data().orderid+`</h5>
                    <h5>`+doc.data().commentsnippet+`</h5>
                    <h5>`+doc.data().rating+`</h5>
                    <h5 id="status">`+doc.data().status+`</h5>
                </div>
            </div>                        
        `;
        }
        userCounter++;
    });
    addFunctionality();
}

//changeslist data
async function changesList(){ 
    document.getElementById("itemDisplayChangescontent").innerHTML = ``;
    const q = query(collection(db, "edit-logs"), orderBy("date", 'desc'));
    //const querySnapshotChanges = await getDocs(collection(db, "edit-logs"));
    const querySnapshotChanges = await getDocs(q);
    var userCounter = 0;
    querySnapshotChanges.forEach((docu) => {
        var changeDate = docu.data().date;
        var userID = docu.data().editorid;
        var realdate = changeDate.toDate()
        var options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute:'numeric'};

        if(userCounter%2===0){
            document.getElementById("itemDisplayChangescontent").innerHTML +=`
            <div class="item">
                <div style="display:grid;grid-template-columns: repeat(10, 1fr)">
                    <h5 style="grid-column:1 / 4">`+realdate.toLocaleString("en-PH", options)+`</h5>
                    <h5 style="grid-column:4 / 6">`+docu.data().editorid+`)`+`</h5>
                    <h5 style="grid-column:6 / 7">`+docu.data().section+`</h5>
                    <h5 style="grid-column:7 / 11">`+docu.data().action+`</h5>
                </div>
            </div>                      
        `;
        } else {
            document.getElementById("itemDisplayChangescontent").innerHTML +=`
            <div class="itemColored">
                <div style="display:grid;grid-template-columns: repeat(10, 1fr)">
                    <h5 style="grid-column:1 / 4">`+realdate.toLocaleString("en-PH", options)+`</h5>
                    <h5 style="grid-column:4 / 6">`+docu.data().editorid+`</h5>
                    <h5 style="grid-column:6 / 7">`+docu.data().section+`</h5>
                    <h5 style="grid-column:7 / 11">`+docu.data().action+`</h5>
                </div>
            </div>                        
        `;
        }
        userCounter++;
    });
}

addFunctionality();

function addFunctionality(){
    //clickable status on orders
    const status = document.querySelectorAll('#status');
    status.forEach(element => {
        element.addEventListener('click', (e) => {
            var val = $(element).siblings("#orderid").html();
            getDoc(doc(db, "orders", val)).then(docSnap => {
                if (docSnap.exists()) {
                    const info =  docSnap.data()
                    var ordID = val;
                    var uid = info.userid;
                    var orderDate = info.date;
                    var realdate = orderDate.toDate();
                    var options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute:'numeric'};
                    var date = realdate.toLocaleString("en-PH", options);
                    var pay = info.payment;
                    var ttl = info.total;
                    var isWilling = info.isWilling;
                    openLoginForm(ordID,uid,date,pay,ttl,isWilling);
                    
                    var item = info.cartItems;
                    for (let index = 0; index < item.length; index++) {
                        getDoc(doc(db, "products", item[index].productId)).then(docSnap => {
                            const prodinfo = docSnap.data();
                            var prodName = prodinfo.productname;
                            document.getElementById('orderInstruc').value += prodName;
                            document.getElementById('orderInstruc').value += "("+item[index].quantity+")";
                            document.getElementById('orderInstruc').value += ":"+item[index].specInstruc+"\n";
                        });
                    }

                    const orderDBRef = doc(db, "orders", val); 
                    const userDBRef = doc(db, "users", uid); 

                    document.getElementById("accept").addEventListener('click', (e) => {
                        setDoc(orderDBRef, {
                            status:"accepted",
                        }, {merge:true});
                        Toast.fire({
                            icon: 'success',
                            title: 'Status Updated'
                        })
                        incrementTotalOrders();
                        closeLoginForm();
                    });
                
                    document.getElementById("complete").addEventListener('click', (e) => {
                        setDoc(orderDBRef, {
                            status:"completed",
                        }, {merge:true});
                        // setDoc(userDBRef, {
                        //     activeOrder:"",
                        // }, {merge:true});
                        Toast.fire({
                            icon: 'success',
                            title: 'Status Updated'
                        })
                        incrementTotalCompletedOrders();
                        for (let index = 0; index < item.length; index++) {
                            var prodID = item[index].productId;
                            var qty = item[index].quantity*-1;
                            incrementTotalProducts(prodID, qty)
                        }
                        closeLoginForm();
                    });
                
                    document.getElementById("decline").addEventListener('click', (e) => {
                        setDoc(orderDBRef, {
                            status:"declined",
                        }, {merge:true});
                        Toast.fire({
                            icon: 'success',
                            title: 'Status Updated'
                        })
                        closeLoginForm();
                    });
                }
            });
        });
    });

    //products
    const editProduct = document.querySelectorAll('#productEditButton');
    editProduct.forEach(element => {
        element.addEventListener('click', (e) => {
            var val = $(element).siblings("#productid").html();
            console.log(val);
            getDoc(doc(db, "products", val)).then(docSnap => {
                const info = docSnap.data();
                console.log(info);
                addItemPopUpForm(val,info.image,info.price,info.productname,info.quantity,info.status,info.description);
            });
        });
    });

    const addProduct = document.getElementById('addProductButton');
    addProduct.addEventListener('click', (e) => {
        addNewItemPopUpForm();
    });

    const priceBox = document.querySelectorAll('#priceBox');
    priceBox.forEach(element => {
        element.addEventListener("keypress", function (evt) {
            if (evt.which < 48 || evt.which > 57){
                evt.preventDefault();
            }
        });
    });

    const qtyBox = document.querySelectorAll('#qtyBox');
    qtyBox.forEach(element => {
        element.addEventListener("keypress", function (evt) {
            if (evt.which < 48 || evt.which > 57){
                evt.preventDefault();
            }
        });
    });

    const cancelButton = document.querySelectorAll('#cancelButton');
    cancelButton.forEach(element => {
        element.addEventListener('click', (e) => {
            closeLoginForm();
        });
    });

    const saveButton = document.querySelectorAll('#saveButton');
    saveButton.forEach(element => {
        element.addEventListener('click', (e) => {
            var id = document.getElementById("productID").value;
            var name = document.getElementById("productName").value;
            var price = document.getElementById("priceBox").value;
            var desc = document.getElementById("description").value;
            var qty = document.getElementById("qtyBox").value;
            qty = parseInt(qty);
            var vis = document.getElementById("visible").className;
            var status;
            if (vis==="hlighted"){
                status = "available"
            }
            else{
                status = "unavailable"
            }
            if($('.drag-area').hasClass('active')){
                ProductUpdateAndImageUpload(id,name,price,qty,status,desc);
            }
            else{
                const productsDBRef = doc(db, "products", id); 
                setDoc(productsDBRef, {
                    productname:name,
                    price:parseInt(price),
                    quantity:parseInt(qty),
                    description:desc.trim(),
                    status:status,
                }, {merge:true});
                Toast.fire({
                    icon: 'success',
                    title: id+' Updated'
                })
                closeLoginForm();
            }

            
        }) 
    });

    const reviewSaveButton = document.querySelectorAll('#reviewSaveButton');
    reviewSaveButton.forEach(element => {
        element.addEventListener('click', (e) => {
            var id = document.getElementById("productID").value;
            var vis = document.getElementById("visible").className;
            var status;
            if (vis==="hlighted"){
                status = "visible"
            }
            else{
                status = "hidden"
            }
            const reviewsDBRef = doc(db, "reviews", id); 
            setDoc(reviewsDBRef, {
                status:status,
            }, {merge:true});
            Toast.fire({
                icon: 'success',
                title: id+' Updated'
            })
            closeLoginForm();            
        }) 
    });

    //close pop-upform on outside click
    document.getElementById("orderPopUp").addEventListener('click', (e) => {
        closeLoginForm();
    });

    //reviews
    const reviewsStatus = document.querySelectorAll('#status');
    reviewsStatus.forEach(element => {
        element.addEventListener('click', (e) => {
            var val = $(element).siblings("#reviewid").html();
            getDoc(doc(db, "reviews", val)).then(docSnap => {
                const info = docSnap.data();
                var reviewDate = info.reviewdate;
                var realdate = reviewDate.toDate()
                var options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute:'numeric'};
                reviewStatusPopUpForm(val,info.fullname,info.rating,realdate.toLocaleString("en-PH", options),info.status,info.image,info.commentsnippet);
            });
        });
    });
}

//show PopUp Form
function openLoginForm(orderID,userid,date,payment,total,isWilling){
    var prompt = "";
    if (isWilling){
        prompt = '<p style="grid-column:1/5;font-family: Montserrat-ThinItalic;">This user is willing to shoulder long distance delivery fees</p>'
    }
    document.getElementById('addImageContainer').style.display = 'none';
    document.getElementById("popUpContent").innerHTML = `
    <div style="display:grid;grid-template-columns: repeat(4,1fr);">
        <h4 style="grid-column:1/2;">Order ID</h4>
        <input value="`+orderID+`" readonly="true" class="ordertxtbox" style="grid-column:2/5;">
        <h4 style="grid-column:1/2;">User ID</h4>
        <input value="`+userid+`" readonly="true" class="ordertxtbox" style="grid-column:2/5;">
        <h4 style="n
        grid-column:1/2;">Date</h4>
        <input value="`+date+`" readonly="true" class="ordertxtbox" style="grid-column:2/5;">
        <h4 style="grid-column:1/2;">Payment</h4>
        <input value="`+payment+`" readonly="true" class="ordertxtbox" style="grid-column:2/5;">
        <h4 style="grid-column:1/2;">Items</h4>
        <textarea readonly="true" class="ordertxtbox" id="orderInstruc" style="grid-column:2/5;"></textarea>
        <h4 style="grid-column:1/2;">Total</h4>
        <input value="`+total+`" readonly="true" class="ordertxtbox" style="grid-column:2/5;">
        `+prompt+`
        <h4 style="grid-column:1/2;">Status</h4>
        <button class="orderStatusButtons" id="accept">Accept</button>
        <button class="orderStatusButtons" id="complete">Complete</button>
        <button class="orderStatusButtons" id="decline">Decline</button>
    </div>    
    `
    document.getElementById("orderPopUp").style.display = "block";
    document.getElementById("popUpBox").style.visibility = "visible";
    document.getElementById("popUpBox").style.opacity = "1";
    document.getElementById("selbtn").style.display = "block";
    document.getElementById("imageid").style.display = "none";
}

//show addItem PopUp Form
function addItemPopUpForm(productid,image,price,productname,quantity,status,description){
    document.getElementById('addImageContainer').style.display = 'block';
    document.getElementById("selbtn").style.display = "block";
    document.getElementById("imageid").style.display = "block";
    document.getElementById("imageid").src = image; 
    var highlighted;
    if (status==="available"){
        highlighted= `
        <button class="hlighted" id="visible">Visible</button>
        <button class="light" id="hidden">Hidden</button>`;
    }
    else{
        highlighted= `
        <button class="light" id="visible">Visible</button>
        <button class="hlighted" id="hidden">Hidden</button>`;
    }

    document.getElementById("popUpContent").innerHTML = `
    <div class="dataContainer" style="margin-top:1rem;display:grid;grid-template-columns: repeat(3,1fr);">
    <h4 style="grid-column:1/2;">Product ID</h4>
    <input id="productID" value="`+productid+`" readonly="true" class="ordertxtbox" style="grid-column:2/4;">
    <h4 style="grid-column:1/2;">Name</h4>
    <input id="productName" value="`+productname+`" class="ordertxtbox" style="grid-column:2/4;">
    <h4 style="grid-column:1/2;">Description</h4>
    <textarea id="description" class="ordertxtbox" style="grid-column:2/4;">`+description+`</textarea>
    <h4 style="grid-column:1/2;">Price</h4>
    <input id="priceBox" value="`+price+`" class="ordertxtbox" style="grid-column:2/4;">
    <h4 style="grid-column:1/2;">Quantity</h4>
    <input id="qtyBox" value="`+quantity+`" class="ordertxtbox" style="grid-column:2/4;">
    <h4 style="grid-column:1/2;">Status</h4>`+
    highlighted+
    `
    </div>
    <div style="margin-left:auto;margin-right:auto;margin-top:1rem;display:grid;grid-template-columns: repeat(2,1fr);">
        <button class="saveButton" id="saveButton">Save</button>
        <button class="saveButton" id="cancelButton">Cancel</button>
    </div>`;

    document.getElementById("orderPopUp").style.display = "block";
    document.getElementById("popUpBox").style.visibility = "visible";
    document.getElementById("popUpBox").style.opacity = "1";
    addFunctionality();
    document.getElementById('visible').addEventListener('click', (e) => {
        document.getElementById('visible').className = 'hlighted';
        document.getElementById('hidden').className = 'light';
    });

    document.getElementById('hidden').addEventListener('click', (e) => {
        document.getElementById('hidden').className = 'hlighted';
        document.getElementById('visible').className = 'light';
    });
}

function reviewStatusPopUpForm(val,fullname,rating,reviewdate,status,image,commentsnippet){
    document.getElementById('addImageContainer').style.display = 'none';
    document.getElementById("selbtn").style.display = "none";
    document.getElementById("imageid").style.display = "none";
    var highlighted;
    if (status==="visible"){
        highlighted= `
        <button class="hlighted" id="visible">Visible</button>
        <button class="light" id="hidden">Hidden</button>`;
    }
    else{
        highlighted= `
        <button class="light" id="visible">Visible</button>
        <button class="hlighted" id="hidden">Hidden</button>`;
    }
    var imageHTML = "";
    if (image != "" && image != null){
        imageHTML = `
        <div class="reviewImageContainer">
            <img src="`+image+`" style="height:10rem;width:auto;">
        </div>
        `
    }
    document.getElementById("popUpContent").innerHTML = `
    `+imageHTML+`
    <div class="dataContainer" style="margin-top:1rem;display:grid;grid-template-columns: repeat(3,1fr);">
    <h4 style="grid-column:1/2;">Review ID</h4>
    <input id="productID" value="`+val+`" readonly="true" class="ordertxtbox" style="grid-column:2/4;">
    <h4 style="grid-column:1/2;">Name</h4>
    <input id="productName" value="`+fullname+`" readonly="true" class="ordertxtbox" style="grid-column:2/4;">
    <h4 style="grid-column:1/2;">Rating</h4>
    <input id="priceBox" value="`+rating+`" readonly="true" class="ordertxtbox" style="grid-column:2/4;">
    <h4 style="grid-column:1/2;">Comments</h4>
    <textarea readonly="true" class="ordertxtbox" style="grid-column:2/4;">`+commentsnippet+`</textarea>
    <h4 style="grid-column:1/2;">Date</h4>
    <input id="qtyBox" value="`+reviewdate+`" readonly="true" class="ordertxtbox" style="grid-column:2/4;">
    <h4 style="grid-column:1/2;">Status</h4>`+
    highlighted+
    `
    </div>
    <div style="margin-left:auto;margin-right:auto;margin-top:1rem;display:grid;grid-template-columns: repeat(2,1fr);">
        <button class="saveButton" id="reviewSaveButton">Save</button>
        <button class="saveButton" id="cancelButton">Cancel</button>
    </div>`;

    document.getElementById("orderPopUp").style.display = "block";
    document.getElementById("popUpBox").style.visibility = "visible";
    document.getElementById("popUpBox").style.opacity = "1";
    addFunctionality();
    document.getElementById('visible').addEventListener('click', (e) => {
        document.getElementById('visible').className = 'hlighted';
        document.getElementById('hidden').className = 'light';
    });

    document.getElementById('hidden').addEventListener('click', (e) => {
        document.getElementById('hidden').className = 'hlighted';
        document.getElementById('visible').className = 'light';
    });
}

//show addNewItem PopUp Form
function addNewItemPopUpForm(){
    document.getElementById('addImageContainer').style.display = 'block';
    document.getElementById("selbtn").style.display = "block";
    document.getElementById("imageid").style.display = "none";
    var highlighted = `
    <button class="hlighted" id="visible">Visible</button>
    <button class="light" id="hidden">Hidden</button>`;

    document.getElementById("popUpContent").innerHTML = `
    <div class="dataContainer" style="margin-top:1rem;display:grid;grid-template-columns: repeat(3,1fr);">
    <h4 style="grid-column:1/2;">Product ID</h4>
    <input id="productID" class="ordertxtbox" style="grid-column:2/4;">
    <h4 style="grid-column:1/2;">Name</h4>
    <input id="productName" class="ordertxtbox" style="grid-column:2/4;">
    <h4 style="grid-column:1/2;">Description</h4>
    <textarea id="description" class="ordertxtbox" style="grid-column:2/4;"></textarea>
    <h4 style="grid-column:1/2;">Price</h4>
    <input id="priceBox" class="ordertxtbox" style="grid-column:2/4;">
    <h4 style="grid-column:1/2;">Quantity</h4>
    <input id="qtyBox" class="ordertxtbox" style="grid-column:2/4;">
    <h4 style="grid-column:1/2;">Status</h4>`+
    highlighted+
    `
    </div>
    <div style="margin-left:auto;margin-right:auto;margin-top:1rem;display:grid;grid-template-columns: repeat(2,1fr);">
        <button class="saveButton" id="createNewProduct">Save</button>
        <button class="saveButton" id="cancelButton">Cancel</button>
    </div>`;

    document.getElementById("orderPopUp").style.display = "block";
    document.getElementById("popUpBox").style.visibility = "visible";
    document.getElementById("popUpBox").style.opacity = "1";
    addFunctionality();
    document.getElementById('visible').addEventListener('click', (e) => {
        document.getElementById('visible').className = 'hlighted';
        document.getElementById('hidden').className = 'light';
    });

    document.getElementById('hidden').addEventListener('click', (e) => {
        document.getElementById('hidden').className = 'hlighted';
        document.getElementById('visible').className = 'light';
    });

    const newProductButton = document.getElementById('createNewProduct');
    newProductButton.addEventListener('click', (e) => {
            var id = document.getElementById("productID").value;
            var name = document.getElementById("productName").value;
            var desc = document.getElementById("description").value;
            var price = document.getElementById("priceBox").value;
            var qty = document.getElementById("qtyBox").value;
            qty = parseInt(qty);
            var vis = document.getElementById("visible").className;
            var status;
            if (vis==="hlighted"){
                status = "available"
            }
            else{
                status = "unavailable"
            }
            getDoc(doc(db, "products", id)).then(docSnap => {
                if (docSnap.exists()) {
                    errorOkPopUp('Creation Failed', 'Please try again') 
                }else{
                    ProductUpdateAndImageUpload(id,name,price,qty,status,desc)
                    Toast.fire({
                        icon: 'success',
                        title: 'Item Added to Menu'
                    })
                    closeLoginForm();
                }
            });
    });
}

//hide PopUp Form
function closeLoginForm(){
    document.getElementById("orderPopUp").style.display = "none";
    document.getElementById("popUpBox").style.visibility = "hidden";
    document.getElementById("popUpBox").style.opacity = "0";
    document.getElementById("selbtn").style.display = "none";
    document.getElementById("imageid").style.display = "none";
    dropArea.classList.remove("active");
    files = [];
    reader = new FileReader ();
    extention = null;
    name = null;
    input = dropArea.querySelector("input");
    file = null; //this is a global variable and we'll use it inside multiple functions
    fileURL = null;
}

async function getSalesData(){
    const q = query(collection(db, "orders"), where("status", "==", "completed"));
    const querySnapshotSales = await getDocs(q);
    var totalMonthlySales = [];
    for (let index = 0; index < 12; index++) {
        //get dates
        var currentYear = new Date().getFullYear();
        var date = new Date(currentYear, index);
        var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        
        
        var totalSales = 0;
        querySnapshotSales.forEach((docu) => {
            var info = docu.data();
            if(firstDay<= info.date.toDate() && info.date.toDate() <= lastDay){
                totalSales += info.total;
            }
        });
        totalMonthlySales.push(totalSales/1000);
    }
    return totalMonthlySales;
}

function getDaysInCurrentMonth() {
    const date = new Date();
  
    return new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      0
    ).getDate();
}

async function getDailySalesData(){
    const q = query(collection(db, "orders"), where("status", "==", "completed"));
    const querySnapshotSales = await getDocs(q);
    var dayInCurrentMonth = getDaysInCurrentMonth();
    var totalWeeklySales = [];

    for (let index = 1; index <= dayInCurrentMonth; index++) {
        //get dates
        var date = new Date();
        var day = new Date(date.getFullYear(), date.getMonth(), index);
        
        var totalSales = 0;
        querySnapshotSales.forEach((docu) => {
            var info = docu.data();
            var infoDate = info.date.toDate()
            if(day.toDateString() == infoDate.toDateString()){
                totalSales += info.total;
            }
        });
        totalWeeklySales.push(totalSales/1000);
    }
    return totalWeeklySales;
}

const showReportsButton = document.getElementById('showReportsButton');
showReportsButton.addEventListener('click', (e) => {
    var buttonName = document.getElementById('showReportsButton').innerHTML;
    areaGraph(buttonName);
});

async function areaGraph(buttonName){
    if (buttonName == "Monthly Revenue"){
        document.getElementById('showReportsButton').innerHTML = 'Quarterly Revenue'
        const arrSales = await getDailySalesData();

        var weeklySales = []
        var monthlyTotal = 0;
        var total = 0;
        for (let index = 0; index < arrSales.length; index++) {
            total += arrSales[index];
            monthlyTotal += arrSales[index];
            if (index == 6 || index == 13 || index == 20){
                weeklySales.push(total);
                total = 0;
            }
            else if (index == arrSales.length-1){
                weeklySales.push(total);
                total = 0;
            }
        }

        CanvasJS.addColorSet("areacolor",
                    [//colorSet Array
                    "#F3B32B"       
                    ]);
        var chart = new CanvasJS.Chart("chartContainer", {
            animationEnabled: true,
            backgroundColor: null,
            axisX: {
                minimum: 1,
                maximum: 4,
                labelFormatter: function(){
                    return " ";
                },
            },
            colorSet: "areacolor",
            axisY: {
                titleFontColor: "#4F81BC",
                includeZero: true,
                suffix: "K",
                labelFontColor: "#A3A3A3",
                gridColor: "#F0F0F0",
            },
            data: [{
                indexLabelFontColor: "darkSlateGray",
                name: "views",
                type: "area",
                yValueFormatString: "#,##0.000K",
                dataPoints: [
                    { x: 1, y: weeklySales[0], label: "Q1" },
                    { x: 2, y: weeklySales[1], label: "Q2" },
                    { x: 3, y: weeklySales[2], label: "Q3" },
                    { x: 4, y: weeklySales[3], label: "Q4" },
                ]
            }]
        });
        chart.render();

        //header - this month's sales
        const d = new Date();
        let month = d.getMonth();
        document.getElementById("currentMonthSales").innerHTML = "₱" + Math.round(monthlyTotal * 100) / 100 + "K"

        document.getElementById("tableContainer").innerHTML = `
        <table style="padding-left: 1rem;padding-right: 1rem;color:#9A4B0D;opacity: 0.7;font-size: 0.8rem;" class="dot-table">
            <tr><td>Q1</td><td id="Q1">₱`+weeklySales[0]*1000+`</td></tr>
            <tr><td>Q2</td><td id="Q2">₱`+weeklySales[1]*1000+`</td></tr>
            <tr><td>Q3</td><td id="Q3">₱`+weeklySales[2]*1000+`</td></tr>
            <tr><td>Q4</td><td id="Q4">₱`+weeklySales[3]*1000+`</td></tr>
        </table>                
        `
        var removeStuff = document.querySelectorAll('.canvasjs-chart-credit');
        removeStuff.forEach(element => {
            element.innerHTML = "";
        });
        
    }
    else if (buttonName == "Quarterly Revenue"){
        document.getElementById('showReportsButton').innerHTML = 'Daily Revenue'
        const arrSales = await getDailySalesData();
        var date = new Date();
        var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        var dayInCurrentMonth = getDaysInCurrentMonth();

        const today = new Date()
        var dataArray = [];
        var total = 0;
        var displayHTML = ``;
        for (let index = 1; index <= dayInCurrentMonth; index++) {
            total += arrSales[index-1];
            var mString = today.toLocaleString('default', { month: 'short' }) + ' ' + index;
            dataArray.push({x: new Date(date.getFullYear(), date.getMonth(), index), 
                y: arrSales[index-1], label: mString})
            displayHTML += `
            <tr><td>`+mString+`</td><td>₱`+arrSales[index-1]*1000+`</td></tr>
            `
        }

        CanvasJS.addColorSet("areacolor",
                    [//colorSet Array
                    "#F3B32B"       
                    ]);
        var chart = new CanvasJS.Chart("chartContainer", {
            animationEnabled: true,
            backgroundColor: null,
            axisX: {
                minimum: firstDay,
                maximum: lastDay,
                labelFormatter: function(){
                    return " ";
                },
            },
            colorSet: "areacolor",
            axisY: {
                titleFontColor: "#4F81BC",
                includeZero: true,
                suffix: "K",
                labelFontColor: "#A3A3A3",
                gridColor: "#F0F0F0",
            },
            data: [{
                indexLabelFontColor: "darkSlateGray",
                name: "views",
                type: "area",
                yValueFormatString: "#,##0.000K",
                dataPoints: dataArray
            }]
        });
        chart.render();

        //header - this month's sales
        const d = new Date();
        document.getElementById("currentMonthSales").innerHTML = "₱" + Math.round(total * 100) / 100 + "K"

        document.getElementById("tableContainer").innerHTML = `
        <table style="padding-left: 1rem;padding-right: 1rem;color:#9A4B0D;opacity: 0.7;font-size: 0.8rem;" class="dot-table">
            `+displayHTML+`
        </table>                
        `
        var removeStuff = document.querySelectorAll('.canvasjs-chart-credit');
        removeStuff.forEach(element => {
            element.innerHTML = "";
        });
    }
    else{
        document.getElementById('showReportsButton').innerHTML = 'Monthly Revenue'
        const arrSales = await getSalesData();
        const currentYear = new Date().getFullYear();
        CanvasJS.addColorSet("areacolor",
                    [//colorSet Array
                    "#F3B32B"       
                    ]);
        var chart = new CanvasJS.Chart("chartContainer", {
            animationEnabled: true,
            backgroundColor: null,
            axisX: {
                minimum: new Date(currentYear, 0),
                maximum: new Date(currentYear, 11),
                labelFormatter: function(){
                    return " ";
                },
            },
            colorSet: "areacolor",
            axisY: {
                titleFontColor: "#4F81BC",
                includeZero: true,
                suffix: "K",
                labelFontColor: "#A3A3A3",
                gridColor: "#F0F0F0",
            },
            data: [{
                indexLabelFontColor: "darkSlateGray",
                name: "views",
                type: "area",
                yValueFormatString: "#,##0.000K",
                dataPoints: [
                    { x: new Date(2022, 0), y: arrSales[0], label: "Jan" },
                    { x: new Date(2022, 1), y: arrSales[1], label: "Feb" },
                    { x: new Date(2022, 2), y: arrSales[2], label: "Mar" },
                    { x: new Date(2022, 3), y: arrSales[3], label: "Apr" },
                    { x: new Date(2022, 4), y: arrSales[4], label: "May" },
                    { x: new Date(2022, 5), y: arrSales[5], label: "Jun" },
                    { x: new Date(2022, 6), y: arrSales[6], label: "Jul" },
                    { x: new Date(2022, 7), y: arrSales[7], label: "Aug" },
                    { x: new Date(2022, 8), y: arrSales[8], label: "Sep"},
                    { x: new Date(2022, 9), y: arrSales[9], label: "Oct" },
                    { x: new Date(2022, 10), y: arrSales[10], label: "Nov"},
                    { x: new Date(2022, 11), y: arrSales[11], label: "Dec" }
                ]
            }]
        });
        chart.render();

        //header - this month's sales
        const d = new Date();
        let month = d.getMonth();
        document.getElementById("currentMonthSales").innerHTML = "₱" + Math.round(arrSales[month] * 100) / 100 + "K"

        document.getElementById("tableContainer").innerHTML = `
        <table style="padding-left: 1rem;padding-right: 1rem;color:#9A4B0D;opacity: 0.7;font-size: 0.8rem;" class="dot-table">
            <tr><td>Jan</td><td id="Jan">₱`+arrSales[0]*1000+`</td></tr>
            <tr><td>Feb</td><td id="Feb">₱`+arrSales[1]*1000+`</td></tr>
            <tr><td>Mar</td><td id="Mar">₱`+arrSales[2]*1000+`</td></tr>
            <tr><td>Apr</td><td id="Apr">₱`+arrSales[3]*1000+`</td></tr>
            <tr><td>May</td><td id="May">₱`+arrSales[4]*1000+`</td></tr>
            <tr><td>Jun</td><td id="Jun">₱`+arrSales[5]*1000+`</td></tr>
            <tr><td>Jul</td><td id="Jul">₱`+arrSales[6]*1000+`</td></tr>
            <tr><td>Aug</td><td id="Aug">₱`+arrSales[7]*1000+`</td></tr>
            <tr><td>Sep</td><td id="Sep">₱`+arrSales[8]*1000+`</td></tr>
            <tr><td>Oct</td><td id="Oct">₱`+arrSales[9]*1000+`</td></tr>
            <tr><td>Nov</td><td id="Nov">₱`+arrSales[10]*1000+`</td></tr>
            <tr><td>Dec</td><td id="Dec">₱`+arrSales[11]*1000+`</td></tr>
        </table>                
        `
        // document.getElementById("Jan").innerHTML = "₱" + arrSales[0]*1000;
        // document.getElementById("Feb").innerHTML = "₱" + arrSales[1]*1000;
        // document.getElementById("Mar").innerHTML = "₱" + arrSales[2]*1000;
        // document.getElementById("Apr").innerHTML = "₱" + arrSales[3]*1000;
        // document.getElementById("May").innerHTML = "₱" + arrSales[4]*1000;
        // document.getElementById("Jun").innerHTML = "₱" + arrSales[5]*1000;
        // document.getElementById("Jul").innerHTML = "₱" + arrSales[6]*1000;
        // document.getElementById("Aug").innerHTML = "₱" + arrSales[7]*1000;
        // document.getElementById("Sep").innerHTML = "₱" + arrSales[8]*1000;
        // document.getElementById("Oct").innerHTML = "₱" + arrSales[9]*1000;
        // document.getElementById("Nov").innerHTML = "₱" + arrSales[10]*1000;
        // document.getElementById("Dec").innerHTML = "₱" + arrSales[11]*1000;

        var removeStuff = document.querySelectorAll('.canvasjs-chart-credit');
        removeStuff.forEach(element => {
            element.innerHTML = "";
        });
    }
}

async function getOrdersData(){
    const q = query(collection(db, "orders"), where("status", "==", "pending"));
    const queryPendingOrders = await getDocs(q);

    const q1 = query(collection(db, "orders"), where("status", "==", "accepted"));
    const queryAcceptedOrders = await getDocs(q1);

    const q2 = query(collection(db, "orders"), where("status", "==", "completed"));
    const queryCompletedOrders = await getDocs(q2);

    var pendingCount = 0;
    var acceptedCount = 0;
    var completedCount = 0;

    queryPendingOrders.forEach((docu) => {
        pendingCount += 1;
    });
    queryAcceptedOrders.forEach((docu) => {
        acceptedCount += 1;
    });
    queryCompletedOrders.forEach((docu) => {
        completedCount += 1;
    });

    document.getElementById('pendingHeader').innerHTML = pendingCount;
    document.getElementById('acceptedHeader').innerHTML = acceptedCount;
    document.getElementById('completedHeader').innerHTML = completedCount;

    return [pendingCount,acceptedCount,completedCount];
}

async function pieGraph(){
    var arrPieGraph = await getOrdersData();
    var total = arrPieGraph[0] + arrPieGraph[1] + arrPieGraph[2];
    CanvasJS.addColorSet("graphColor",
                [//colorSet Array
                "#E5C646",
                "#F4E9BD",
                "#F9F5E5"
                ]);

    var chart = new CanvasJS.Chart("graphChartContainer", {
        animationEnabled: true,
        backgroundColor: null,
        colorSet: "graphColor",
        data: [{
            type: "pie",
            startAngle: 270,
            yValueFormatString: "##0.00\"%\"",
            dataPoints: [
                {y: arrPieGraph[2]/total},
                {y: arrPieGraph[1]/total},
                {y: arrPieGraph[0]/total}
            ]
        }]
    });
    chart.render();
    var removeStuff = document.querySelectorAll('.canvasjs-chart-credit');
    removeStuff.forEach(element => {
        element.innerHTML = "";
    });
}

//show dashboard
document.getElementById("dashboardbutton").addEventListener('click', (e) => {
    document.getElementById('box2').style.display = "none";
    document.getElementById('dashboardlist').style.display = "grid";
    document.getElementById('orderslist').style.display = "none";
    document.getElementById('userslist').style.display = "none";
    document.getElementById('productslist').style.display = "none";
    document.getElementById('reviewslist').style.display = "none";
    document.getElementById('changeslist').style.display = "none";
    document.getElementById("dashboardbutton").className = "navbuttonselected";
    document.getElementById("ordersbutton").className = "navbutton";
    document.getElementById("usersbutton").className = "navbutton";
    document.getElementById("productsbutton").className = "navbutton";
    document.getElementById("reviewsbutton").className = "navbutton";
    document.getElementById("changesbutton").className = "navbutton";
    areaGraph();
    pieGraph();
});

//show orders
document.getElementById("ordersbutton").addEventListener('click', (e) => {
    ordersList();
    document.getElementById('box2').style.display = "block";
    document.getElementById('orderslist').style.display = "block";
    document.getElementById('dashboardlist').style.display = "none";
    document.getElementById('userslist').style.display = "none";
    document.getElementById('productslist').style.display = "none";
    document.getElementById('reviewslist').style.display = "none";
    document.getElementById('changeslist').style.display = "none";
    document.getElementById("ordersbutton").className = "navbuttonselected";
    document.getElementById("dashboardbutton").className = "navbutton";
    document.getElementById("usersbutton").className = "navbutton";
    document.getElementById("productsbutton").className = "navbutton";
    document.getElementById("reviewsbutton").className = "navbutton";
    document.getElementById("changesbutton").className = "navbutton";
});

//show users
document.getElementById("usersbutton").addEventListener('click', (e) => {
    usersList();
    document.getElementById('box2').style.display = "block";
    document.getElementById('userslist').style.display = "block";
    document.getElementById('dashboardlist').style.display = "none";
    document.getElementById('orderslist').style.display = "none";
    document.getElementById('productslist').style.display = "none";
    document.getElementById('reviewslist').style.display = "none";
    document.getElementById('changeslist').style.display = "none";
    document.getElementById("usersbutton").className = "navbuttonselected";
    document.getElementById("dashboardbutton").className = "navbutton";
    document.getElementById("ordersbutton").className = "navbutton";
    document.getElementById("productsbutton").className = "navbutton";
    document.getElementById("reviewsbutton").className = "navbutton";
    document.getElementById("changesbutton").className = "navbutton";
});

//show products
document.getElementById("productsbutton").addEventListener('click', (e) => {
    productsList();
    document.getElementById('box2').style.display = "block";
    document.getElementById('productslist').style.display = "block";
    document.getElementById('dashboardlist').style.display = "none";
    document.getElementById('orderslist').style.display = "none";
    document.getElementById('userslist').style.display = "none";
    document.getElementById('reviewslist').style.display = "none";
    document.getElementById('changeslist').style.display = "none";
    document.getElementById("productsbutton").className = "navbuttonselected";
    document.getElementById("dashboardbutton").className = "navbutton";
    document.getElementById("ordersbutton").className = "navbutton";
    document.getElementById("usersbutton").className = "navbutton";
    document.getElementById("reviewsbutton").className = "navbutton";
    document.getElementById("changesbutton").className = "navbutton";
});

//show reviews
document.getElementById("reviewsbutton").addEventListener('click', (e) => {
    reviewsList();
    document.getElementById('box2').style.display = "block";
    document.getElementById('reviewslist').style.display = "block";
    document.getElementById('dashboardlist').style.display = "none";
    document.getElementById('orderslist').style.display = "none";
    document.getElementById('userslist').style.display = "none";
    document.getElementById('productslist').style.display = "none";
    document.getElementById('changeslist').style.display = "none";
    document.getElementById("reviewsbutton").className = "navbuttonselected";
    document.getElementById("dashboardbutton").className = "navbutton";
    document.getElementById("ordersbutton").className = "navbutton";
    document.getElementById("usersbutton").className = "navbutton";
    document.getElementById("productsbutton").className = "navbutton";
    document.getElementById("changesbutton").className = "navbutton";
});

//show changes
document.getElementById("changesbutton").addEventListener('click', (e) => {
    changesList();
    document.getElementById('box2').style.display = "block";
    document.getElementById('changeslist').style.display = "block";
    document.getElementById('dashboardlist').style.display = "none";
    document.getElementById('orderslist').style.display = "none";   
    document.getElementById('userslist').style.display = "none";
    document.getElementById('productslist').style.display = "none";
    document.getElementById('reviewslist').style.display = "none";
    document.getElementById("changesbutton").className = "navbuttonselected";
    document.getElementById("dashboardbutton").className = "navbutton";
    document.getElementById("ordersbutton").className = "navbutton";
    document.getElementById("usersbutton").className = "navbutton";
    document.getElementById("productsbutton").className = "navbutton";
    document.getElementById("reviewsbutton").className = "navbutton";
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

//Upload Files
var files = []; //files array
var reader = new FileReader ();
var SelBtn = document.getElementById('selbtn');
var extention;
var name;

//selecting all required elements
const dropArea = document.querySelector(".drag-area"), //drop area
button = dropArea.querySelector("button");
let input = dropArea.querySelector("input");
let file; //this is a global variable and we'll use it inside multiple functions
let fileURL;
input.type = 'file';
input.onchange = e =>{
    console.log('hello world')
    files = e.target.files;

    extention = GetFileExt(files[0]);
    name = GetFileName(files[0]);

    reader.readAsDataURL(files[0]);
}
input.addEventListener("change", function(){
    //getting user select file and [0] this means if user select multiple files then we'll select only the first one
    file = this.files[0];
    var fileSize = file.size / 1024 / 1024; // in mb
    if (fileSize > 8){
        errorOkPopUp("Your file is too powerful!", "File upload size cannot exceed 8mb");
    }else{
        dropArea.classList.add("active");

        showFile(); //calling function
    }
});

//If user Drag File Over DropArea
dropArea.addEventListener("dragover", (event)=>{
  event.preventDefault(); //preventing from default behaviour
  dropArea.classList.add("active");
});
//If user leave dragged File from DropArea
dropArea.addEventListener("dragleave", ()=>{
  dropArea.classList.remove("active");
});
//If user drop File on DropArea
dropArea.addEventListener("drop", (event)=>{
    event.preventDefault(); //preventing from default behaviour
    //getting user select file and [0] this means if user select multiple files then we'll select only the first one
    file = event.dataTransfer.files[0];
    var fileSize = file.size / 1024 / 1024; // in mb
    if (fileSize > 8){
        errorOkPopUp("Your file is too powerful!", "File upload size cannot exceed 8mb");
    }else{
        extention = GetFileExt(file);
        name = GetFileName(file);

        reader.readAsDataURL(file);
        dropArea.classList.add("active");
        showFile(); //calling function
    }
});
function showFile(){
  let fileType = file.type; //getting selected file type
  let validExtensions = ["image/jpeg", "image/jpg", "image/png"]; //adding some valid image extensions in array
  if(validExtensions.includes(fileType)){ //if user selected file is an image file
    let fileReader = new FileReader(); //creating new FileReader object
    fileReader.onload = ()=>{
        fileURL = fileReader.result; //passing user file source in fileURL variable
        document.getElementById("imageid").src=fileURL;
        document.getElementById("selbtn").style.display = "none";
        document.getElementById("imageid").style.display = "block";
    }
    fileReader.readAsDataURL(file);
  }else{
    alert("This is not an Image File!");
    dropArea.classList.remove("active");
  }
}

document.getElementById("selbtn").addEventListener('click', (e) => {
    console.log('select');
    input.click();
});
                    
// SelBtn.onclick = function(){
    
// }

function GetFileExt(file) {
    var temp = file.name.split('.'); 
    var ext = temp.slice((temp.length-1), (temp.length));
    return '.' + ext[0];
}

function GetFileName(file) {
    var temp = file.name.split('.');
    var fname = temp.slice(0,-1).join('.');
    return fname;
}

async function UploadProcess() {
    try {
        var ImgToUpload = file;
        if(ImgToUpload != null){
            console.log(ImgToUpload);
            var ImgName = name + extention;
            console.log(ImgName);
            console.log(ImgToUpload.type);
            const metaData = {
                contentType: ImgToUpload.type
            }
            var user = auth.currentUser;
            const storage =  getStorage();
            const stroageRef = sRef (storage, "user-images/"+user.uid+"/"+user.uid);
            const UploadTask = uploadBytesResumable(stroageRef, ImgToUpload, metaData);
            UploadTask.on('state-changed', (snapshot)=>{
                },
                (error) =>{
                    errorOkPopUp("Error Uploading Image", "Please try again later");
                },
                ()=>{
                    closeLoginForm();
                    Toast.fire({
                        icon: 'success',
                        title: 'Success'
                    })
                    getDownloadURL(UploadTask.snapshot.ref).then((downloadURL)=>{
                        console.log(downloadURL);
                        const userDBRef = doc(db, "users", user.uid);
                        setDoc(userDBRef, {
                            image: downloadURL
                        }, { merge: true });
                        document.getElementById("profileImage").src = downloadURL;
                    });
                    
                }
            );
        } else{
            errorOkPopUp("Error Uploading Image", "File Not Found");
        }
    } catch (error) {
        errorOkPopUp("Error Uploading Image", "Please try again later");
    }
    
}

async function ProductUpdateAndImageUpload(id,name,price,quantity,status,description) {
    try {
        var ImgToUpload = file;
        if(ImgToUpload != null){
            console.log(ImgToUpload);
            var ImgName = name + extention;
            console.log(ImgName);
            console.log(ImgToUpload.type);
            const metaData = {
                contentType: ImgToUpload.type
            }
            var user = auth.currentUser;
            const storage =  getStorage();
            const stroageRef = sRef (storage, "menu-images/"+ImgName);
            const UploadTask = uploadBytesResumable(stroageRef, ImgToUpload, metaData);
            UploadTask.on('state-changed', (snapshot)=>{
                },
                (error) =>{
                    console.log(error);
                    console.log(error.message);
                    errorOkPopUp("Error Uploading Image", "Please try again later");
                },
                ()=>{
                    closeLoginForm();
                    Toast.fire({
                        icon: 'success',
                        title: id + ' Updated'
                    })
                    getDownloadURL(UploadTask.snapshot.ref).then((downloadURL)=>{
                        console.log(downloadURL);
                        const userDBRef = doc(db, "products", id);
                        setDoc(userDBRef, {
                            price:parseInt(price),
                            productname:name,
                            description:description.trim(),
                            quantity:parseInt(quantity),
                            status:status,
                            image: downloadURL
                        }, { merge: true });
                    });
                    
                }
            );
        } else{
            errorOkPopUp("Error Uploading Image", "File Not Found");
        }
    } catch (error) {
        console.log(error);
        console.log(error.message);
        errorOkPopUp("Error Uploading Image", "Please try again later");
    }
    
}