var config = {
    apiKey: "AIzaSyDSxlqB_Lbtvyc7FaifxsISoKN-EjuVWFs",
    authDomain: "shopping-list-7e2db.firebaseapp.com",
    databaseURL: "https://shopping-list-7e2db.firebaseio.com",
    projectId: "shopping-list-7e2db",
    storageBucket: "",
    messagingSenderId: "584087857436"
  };

firebase.initializeApp(config);


$(document).ready(function(){

var database = firebase.database();

function putOnPage() {

    var firstFolders = firebase.database().ref();
        firstFolders.once("value", function(snapshot) {
        snapshot.forEach(function(child) {

    var shop = child.key;
    
    var storeName = $("<div>").attr("class", "store");

            var a = $("<p>").text(" " + shop).attr("class", "store-name").attr("id", "store-" + shop);

            storeName.append(a);
    
        $("#list").append(storeName);

//--------this area puts the shopping list under the store from above ---

    var ref = firebase.database().ref(shop);
//---- changed .on to .once and it did not repeat the existing list itmes, but wont update with added items
        ref.once("value", function(snapshot) {
    var list = snapshot.val();
    var counter = 0;

        for(var i in list){
            counter++;
            var key = i;
            var value = list[i];
            var data = "item=" + counter;
            var p = $("<p>").attr("id", key).text("  " + key + "  :  " + value).attr("class", "list-items");
            var b = $("<button class='delete'>").text("✓").attr("data-key", key).attr("data-shop", shop);
                p.prepend(b);
                $("#store-" + shop).append(p);
            }
        }); // end of snapshot for items under each store(child)

//--------------- end of the shopping list under store area----

         });  // end of snapshot for each child
    });  // end of loop thru database 
};  // end of putOnPage function

putOnPage();

//----------- beginning of onclick area to add items -----

 $("#submit").on("click", function(event) {
        event.preventDefault();
    
    var itemInput = $("#list-input").val().trim();
    var itemQuantity = $("#qty-input").val().trim();
    var store = capitalizeFirstLetter($("#store-input").val().trim());

        function capitalizeFirstLetter(string) 
            {
                return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
        };

        database.ref(store).update({
        [itemInput]: itemQuantity,
        }); // end of push to database
    
        clearDom();
        putOnPage();

        $("#list-input").val('');
        $("#qty-input").val('');
    });  // end of onclick for adding items
   
//------------ delete onclick area-----------

$(document).on("click", "button.delete", function(event) {
    event.preventDefault();
    var key = $(this).attr("data-key");
    var shop = $(this).attr("data-shop");

        if(confirm('Are you sure?')){
            firebase.database().ref(shop).child(key).remove();
 
        clearDom();
        putOnPage();
        }; // end of if statement
}); // end of delete function onclick

//----- clear the dom function-------
    function clearDom () {
        $("#list").empty();
    };


});  // end document ready