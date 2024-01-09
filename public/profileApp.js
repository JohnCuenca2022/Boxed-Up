import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-app.js";
import { getAuth, onAuthStateChanged, connectAuthEmulator, GoogleAuthProvider, FacebookAuthProvider, signOut} 
from 'https://www.gstatic.com/firebasejs/9.6.7/firebase-auth.js';
import { doc, setDoc, getDoc, getFirestore, connectFirestoreEmulator, getDocs, query, where, collection } from 'https://www.gstatic.com/firebasejs/9.6.7/firebase-firestore.js';
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
const storage = getStorage(app);
//emulator things

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

//userdata
onAuthStateChanged(auth, (user) => {
    if (user) {
        getDoc(doc(db, "users", user.uid)).then(docSnap => {
            if (docSnap.exists()) {
                const info =  docSnap.data()
                document.getElementById("firstname").value = info.firstname;
                document.getElementById("lastname").value = info.lastname;
                document.getElementById("contact").value = info.contact;
                document.getElementById("street").value = info.street;
                document.getElementById("city").value = info.city;
                document.getElementById("province").value = info.province;
                document.getElementById('email').value = info.email;
                if (info.image!=""){
                    document.getElementById("profileImage").src=info.image;
                }else{
                    document.getElementById("profileImage").src="assets/default_profile.png";
                }
                var name = "";
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

//edit
document.getElementById("editbutton").addEventListener('click', (e) => {
    if (document.getElementById('editbutton').innerText === "Edit"){
        document.getElementById('firstname').removeAttribute('readonly');
        document.getElementById('lastname').removeAttribute('readonly');
        document.getElementById('contact').removeAttribute('readonly');
        document.getElementById('street').removeAttribute('readonly');
        document.getElementById('city').removeAttribute('readonly');
        document.getElementById('province').removeAttribute('readonly');
        document.getElementById('editbutton').innerText = 'Cancel';
        document.getElementById('savebutton').removeAttribute('disabled');
    } else {
        var user = auth.currentUser;
        getDoc(doc(db, "users", user.uid)).then(docSnap => {
            if (docSnap.exists()) {
                const info =  docSnap.data()
                document.getElementById("firstname").value = info.firstname;
                document.getElementById("lastname").value = info.lastname;
                document.getElementById("contact").value = info.contact;
                document.getElementById("street").value = info.street;
                document.getElementById("city").value = info.city;
                document.getElementById("province").value = info.province;
            } else {
                console.log("No such document!");
            }
          })

        document.getElementById('email').value = user.email;
        document.getElementById('firstname').setAttribute('readonly', 'readonly');
        document.getElementById('lastname').setAttribute('readonly', 'readonly');
        document.getElementById('contact').setAttribute('readonly', 'readonly');
        document.getElementById('street').setAttribute('readonly', 'readonly');
        document.getElementById('city').setAttribute('readonly', 'readonly');
        document.getElementById('province').setAttribute('readonly', 'readonly');
        document.getElementById('editbutton').innerText = 'Edit';
        document.getElementById("savebutton").disabled = true;
    }
});

//save
document.getElementById("savebutton").addEventListener('click', (e) => {
    var firstname = document.getElementById("firstname").value;
    var lastname = document.getElementById("lastname").value;
    var contact = document.getElementById("contact").value;
    var street = document.getElementById("street").value;
    var city = document.getElementById("city").value;
    var province = document.getElementById("province").value;
    var user = auth.currentUser;
    const userDBRef = doc(db, "users", user.uid);
        setDoc(userDBRef, {
            city: city,
            contact: contact,
            firstname: firstname,
            lastname: lastname,
            province: province,
            street: street
        }, { merge: true });  
    document.getElementById('firstname').setAttribute('readonly', 'readonly');
    document.getElementById('lastname').setAttribute('readonly', 'readonly');
    document.getElementById('contact').setAttribute('readonly', 'readonly');
    document.getElementById('street').setAttribute('readonly', 'readonly');
    document.getElementById('city').setAttribute('readonly', 'readonly');
    document.getElementById('province').setAttribute('readonly', 'readonly');    
    document.getElementById('editbutton').innerText = 'Edit';
    document.getElementById("savebutton").disabled = true;

    getDoc(doc(db, "users", user.uid)).then(docSnap => {
        if (docSnap.exists()) {
            const info =  docSnap.data()

            var name = "";
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
});

//show profile
document.getElementById("profilebutton").addEventListener('click', (e) => {
    document.getElementById('profile').style.display = "block";
    document.getElementById('orderslist').style.display = "none";
    document.getElementById("profilebutton").className = "navbuttonselected";
    document.getElementById("historybutton").className = "navbutton";
});

//show history
document.getElementById("historybutton").addEventListener('click', (e) => {
    document.getElementById('profile').style.display = "none";
    document.getElementById('orderslist').style.display = "block";
    document.getElementById("profilebutton").className = "navbutton";
    document.getElementById("historybutton").className = "navbuttonselected";
    showOrderHistory();
});

//show PopUp Form
function openLoginForm(){
    document.getElementById('addImageContainer').style.display = 'block';
    document.getElementById("selbtn").style.display = "block";
    document.getElementById("imageid").style.width = "10rem";
    document.getElementById('imageid').style.borderRadius = '50%';
    document.getElementById("imageid").src = document.getElementById("profileImage").src;
    document.getElementById("imageid").style.display = "block";
    

    document.getElementById("orderPopUp").style.display = "block";
    document.getElementById("popUpBox").style.visibility = "visible";
    document.getElementById("popUpBox").style.opacity = "1";
    document.getElementById("popUpContent").innerHTML = `
        <button class="saveButton" id="uploadProfileImage" style="margin-top:5rem;">Save</button>
    `;

    addFunctionality();
    // document.getElementById("editImagePopUp").style.display = "block";
    // document.getElementById("popUpBox").style.visibility = "visible";
    // document.getElementById("popUpBox").style.opacity = "1";
    // document.getElementById("textTitle").style.display = "block";
    // document.getElementById("textThin").style.display = "block";
    // document.getElementById("selbtn").style.display = "block";
    // document.getElementById("imageid").style.display = "none";
    // console.log('opened');
}

//show PopUp Form
function openViewOrderPopUp(orderID,date,payment,total){
    document.getElementById('addImageContainer').style.display = 'none';
    document.getElementById("popUpContent").innerHTML = `
    <div style="display:grid;grid-template-columns: repeat(4,1fr);">
        <h4 style="grid-column:1/2;">Order ID</h4>
        <input value="`+orderID+`" readonly="true" class="ordertxtbox" style="grid-column:2/5;">
        <h4 style="grid-column:1/2;">Date</h4>
        <input value="`+date+`" readonly="true" class="ordertxtbox" style="grid-column:2/5;">
        <h4 style="grid-column:1/2;">Payment</h4>
        <input value="`+payment+`" readonly="true" class="ordertxtbox" style="grid-column:2/5;">
        <h4 style="grid-column:1/2;">Items</h4>
        <textarea readonly="true" class="ordertxtbox" id="orderInstruc" style="grid-column:2/5;"></textarea>
        <h4 style="grid-column:1/2;">Total</h4>
        <input value="`+total+`" readonly="true" class="ordertxtbox" style="grid-column:2/5;">
    </div>
    <button class="saveButton" id="createReview" style="margin-top: 3rem;">Leave a Review!</button>
    `
    document.getElementById("orderInstruc").value = '';
    document.getElementById("orderPopUp").style.display = "block";
    document.getElementById("popUpBox").style.visibility = "visible";
    document.getElementById("popUpBox").style.opacity = "1";
    document.getElementById("selbtn").style.display = "block";
    document.getElementById("imageid").style.display = "none";

    document.getElementById("createReview").addEventListener('click', (e) => {
        closeLoginForm();
        openCreateReviewPopUp(orderID);
    });

    addFunctionality();
}

var badwords = ["hudas", "putangina", "lintik", "ulol", "gago", "tarantado", "buwisit", 
"burat", "kupal", "leche", "ungas", "punyeta", "hinayupak", "pucha", "pesteng yawa", 
"pakshet","tangina","Tang ina", "Putang ina", "Tanga", "bobo", "Bwisit", "Puta", "Pota", 
"peste", "Pisti", "Kinangina", "Kinang ina", "Tamod", "Puke", "utot", "yawa", "tite", 
"pepe", "jakol", "oten" ,"hudas", "putangina", "lintik", "ulol", "gago", "tarantado", 
"buwisit", "burat", "kupal", "leche", "ungas", "punyeta", "hinayupak", "pucha", "pesteng yawa", 
"pakshet","tangina","Tang ina", "Putang ina", "Tanga", "bobo", "Bwisit", "Puta", "Pota", "peste", 
"Pisti", "Kinangina", "Kinang ina", "Tamod", "Puke", "utot", "yawa", "Walang hiya", "Tite", "Fuck", 
"Fuck You", "Bitch", "Whore", "Shit", "Asshole" , "Bastard", "Damn", "Cunt", "Dick", "Pussy", 
"Taint", "Faggot", "Motherfucker", "Crap", "Ass", "Bullshit", "Tits", "Boobs", "Boobies", "Cock", 
"Dickhead", "Hell", "Tarantado", "tangina"];

function openCreateReviewPopUp(orderID){
    document.getElementById('imageid').style.borderRadius = '0';
    document.getElementById("imageid").style.width = "auto";
    document.getElementById("imageid").style.display = "block";
    document.getElementById('addImageContainer').style.display = 'block';
    document.getElementById("popUpContent").innerHTML = `
    <div id="starContainer" style="margin-top:2rem;">
        <span id="star1" class="fa fa-star checked"></span>
        <span id="star2" class="fa fa-star checked"></span>
        <span id="star3" class="fa fa-star checked"></span>
        <span id="star4" class="fa fa-star"></span>
        <span id="star5" class="fa fa-star"></span>
        <h4 style="margin-top:1rem;">Comments</h4>
        <textarea class="ordertxtbox" id="reviewcomments" style="grid-column:2/5;"></textarea>
    </div>
    <button class="saveButton" id="createReviewButton" style="margin-top: 3rem;">Leave a Review!</button>
    `
    document.getElementById("orderPopUp").style.display = "block";
    document.getElementById("popUpBox").style.visibility = "visible";
    document.getElementById("popUpBox").style.opacity = "1";
    document.getElementById("selbtn").style.display = "block";
    document.getElementById("imageid").style.display = "none";
    
    document.getElementById("createReviewButton").addEventListener('click', (e) => {
        var rating = 0;
        var now = new Date();
        var comments = document.getElementById("reviewcomments").value;

        var profanity = new RegExp(badwords.join("|"),'gi');
        var filteredComments = comments.replace(profanity,'****')
        
        for (let index = 1; index < 6; index++) {
            if(document.getElementById("star"+index).className == "fa fa-star checked"){
                rating += 1;
            };
        }
        getDoc(doc(db, "users", auth.currentUser.uid)).then(docSnap => {
            if (docSnap.exists()) {
                const info =  docSnap.data()
                var fullname = info.firstname+' '+info.lastname;
                if($('.drag-area').hasClass('active')){
                    ReviewImageUpload(filteredComments,fullname,now,rating,orderID);
                }
                else{
                    const userDBRef = doc(db, "reviews", orderID);
                    setDoc(userDBRef, {
                        commentsnippet:filteredComments,
                        fullname:fullname,
                        rating:rating,
                        reviewdate:now,
                        status:"hidden",
                        image:"",
                    });        
                    Toast.fire({
                        icon: 'success',
                        title: 'Review posted'
                    })
                    closeLoginForm();
                }
            }
        });
    });

    addFunctionality();
}

function closeLoginForm(){
    document.getElementById("orderPopUp").style.display = "none";
    document.getElementById("popUpBox").style.visibility = "hidden";
    document.getElementById("popUpBox").style.opacity = "0";
    document.getElementById("selbtn").style.display = "none";
    document.getElementById("imageid").style.display = "none";
    document.getElementById("imageid").style.width = "none";
    dropArea.classList.remove("active");
    files = [];
    reader = new FileReader ();
    extention = null;
    name = null;
    input = dropArea.querySelector("input");
    file = null; //this is a global variable and we'll use it inside multiple functions
    fileURL = null;
}

async function showOrderHistory(){
    var user = auth.currentUser;
    document.getElementById("orderslist").innerHTML = `<p style="text-align:center;">No orders yet</p>`;
    const querySnapshotOrders = await getDocs(query(collection(db, "orders"), where("userid", "==", user.uid), where("status", "==", "completed")));
    
    if (querySnapshotOrders){
        document.getElementById("orderslist").innerHTML =`
            <div style="display:grid;grid-template-columns: repeat(5, 1fr);text-align:left;">
                <h3 style="grid-column: 1 / 2;margin-left:1rem;margin-right:1rem">Date</h3>
                <h3 style="grid-column: 2 / 4;margin-left:1rem;margin-right:1rem">Items</h3>
                <h3 style="grid-column: 4 / 5;margin-left:1rem;margin-right:1rem">Total</h3>
            </div>
        `;
        querySnapshotOrders.forEach((docu) => {
            var info = docu.data();
            var documentID = docu.id;

            var options = { year: 'numeric', month: 'numeric', day: 'numeric'};
            document.getElementById("orderslist").innerHTML +=`
            <div class="item">
                <div style="display:grid;grid-template-columns: repeat(5, 1fr);text-align:left;font-family: Montserrat-Regular;">
                    <h4 style="grid-column: 1 / 2;margin-left:1rem;margin-right:1rem">`+info.date.toDate().toLocaleString("en-PH", options)+`</h4>
                    <h4 class="vieworder" id="`+documentID+`ID" style="grid-column: 2 / 4;margin-left:1rem;margin-right:1rem"></h4>
                    <h4 style="grid-column: 4 / 5;margin-left:1rem;margin-right:1rem">₱`+info.total+`</h4>
                    <h4 style="grid-column: 5 / 6;color: #9a4b0d;opacity: 0.7;;margin-left:1rem;margin-right:1rem"><u id="`+documentID+`"class="vieworderClickable">View</u></h4>
                </div>
            </div>
            `;

            var cartItems = info.cartItems;
            for (let index = 0; index < cartItems.length; index++) {
                const element = cartItems[index];
                getDoc(doc(db, "products", element.productId)).then(docSnap => {
                    var prodinfo = docSnap.data();
                    var items;
                    var instruc="";
                    if (element.specInstruc != "" && element.specInstruc != null){
                        instruc = " - " + element.specInstruc;
                    }

                    if (index === 0){
                        items = `<h5 style="margin-top:0;">`+element.quantity+`x `+ prodinfo.productname +``+ instruc+`</h5>`
                    } else{
                        items = `<h5>`+element.quantity+`x `+ prodinfo.productname +``+ instruc+`</h5>`
                    }
                    
                    document.getElementById(documentID+"ID").innerHTML += items;
                });
            }
        });
    }
    addShowOrderFunctionality();
}

function addShowOrderFunctionality(){
    //clickable view on completed orders
    const status = document.querySelectorAll('.vieworderClickable');
    status.forEach(element => {
        var orderID = $(element).attr('id');
        element.addEventListener('click', (e) => {
            getDoc(doc(db, "orders", orderID)).then(docSnap => {
                if (docSnap.exists()) {
                    const info =  docSnap.data();
                    var orderDate = info.date;
                    var realdate = orderDate.toDate();
                    var options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute:'numeric'};
                    var date = realdate.toLocaleString("en-PH", options);
                    var pay = info.payment;
                    var ttl = info.total;
                    openViewOrderPopUp(orderID,date,pay,ttl);
                    getDoc(doc(db, "reviews", orderID)).then(docSnap => {
                        if (docSnap.exists()) {
                            document.getElementById('createReview').disabled = true; 
                        }
                    });
                    var item = info.cartItems;
                    document.getElementById("orderInstruc").value = '';
                    for (let index = 0; index < item.length; index++) {
                        getDoc(doc(db, "products", item[index].productId)).then(docSnap => {
                            const prodinfo = docSnap.data();
                            var prodName = prodinfo.productname;
                            document.getElementById('orderInstruc').value += prodName;
                            document.getElementById('orderInstruc').value += "("+item[index].quantity+")";
                            document.getElementById('orderInstruc').value += ":"+item[index].specInstruc+"\n";
                        });
                    }
                }
            });
        });
    });
}

function addFunctionality(){

    //close pop-upform on outside click
    document.getElementById("orderPopUp").addEventListener('click', (e) => {
        closeLoginForm();
    });

    try{
        document.getElementById("uploadProfileImage").addEventListener('click', (e) => {
            UploadProcess();
        });
    }catch{}

    try{
        document.getElementById("star1").addEventListener('click', (e) => {
            document.getElementById("star1").className = "fa fa-star checked";
            document.getElementById("star2").className = "fa fa-star";
            document.getElementById("star3").className = "fa fa-star";
            document.getElementById("star4").className = "fa fa-star";
            document.getElementById("star5").className = "fa fa-star";
        });

        document.getElementById("star2").addEventListener('click', (e) => {
            document.getElementById("star1").className = "fa fa-star checked";
            document.getElementById("star2").className = "fa fa-star checked";
            document.getElementById("star3").className = "fa fa-star";
            document.getElementById("star4").className = "fa fa-star";
            document.getElementById("star5").className = "fa fa-star";
        });

        document.getElementById("star3").addEventListener('click', (e) => {
            document.getElementById("star1").className = "fa fa-star checked";
            document.getElementById("star2").className = "fa fa-star checked";
            document.getElementById("star3").className = "fa fa-star checked";
            document.getElementById("star4").className = "fa fa-star";
            document.getElementById("star5").className = "fa fa-star";
        });

        document.getElementById("star4").addEventListener('click', (e) => {
            document.getElementById("star1").className = "fa fa-star checked";
            document.getElementById("star2").className = "fa fa-star checked";
            document.getElementById("star3").className = "fa fa-star checked";
            document.getElementById("star4").className = "fa fa-star checked";
            document.getElementById("star5").className = "fa fa-star";
        });

        document.getElementById("star5").addEventListener('click', (e) => {
            document.getElementById("star1").className = "fa fa-star checked";
            document.getElementById("star2").className = "fa fa-star checked";
            document.getElementById("star3").className = "fa fa-star checked";
            document.getElementById("star4").className = "fa fa-star checked";
            document.getElementById("star5").className = "fa fa-star checked";
        });
    }catch{}
}

document.getElementById("profileImage").addEventListener('click', (e) => {
    openLoginForm();
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
    if (fileSize > 5){
        errorOkPopUp("Your file is too powerful!", "File upload size cannot exceed 5mb");
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
    if (fileSize > 5){
        errorOkPopUp("Your file is too powerful!", "File upload size cannot exceed 5mb");
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
                    console.log(error);
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

async function ReviewImageUpload(comments,fullname,now,rating,orderID) {
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
            const stroageRef = sRef (storage, "review-images/"+ImgName);
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
                        title: 'Review posted'
                    })
                    getDownloadURL(UploadTask.snapshot.ref).then((downloadURL)=>{
                        console.log(downloadURL);
                        const userDBRef = doc(db, "reviews", orderID);
                        setDoc(userDBRef, {
                            commentsnippet:comments,
                            fullname:fullname,
                            rating:rating,
                            reviewdate:now,
                            status:"hidden",
                            image:downloadURL,
                        }); 
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