function hideAllLinks() {
    $("nav > a").hide();
    $("#profile").hide();
}

function showHideLinks() {
    hideAllLinks();
    
    if (sessionStorage.getItem("authoToken")){
        $("#profile").show();
        $("nav > a").show();

    } else {
        $("nav a.active").show();
    }
}

function hideAllViews() {
    $("#container > div").hide();
}

async function showHomeView() {
    hideAllViews();
    let username = sessionStorage.getItem("username");

    if (username){
        let listings = await kinveyRequester.getAllListings();
        renderHomeView(listings);

        $("#car-listings").show();
        $("#profile > a:nth-child(1)").text("Welcome, " + username + "!");
    } else {
        $("#main").show();
    }
}

function attachLinkEvents() {
    $("nav a.active").on("click", function () {
        hideAllViews();
        showHomeView();
    });

    $("nav > a:nth-child(2)").on("click", function () {
        hideAllViews();
        showHomeView();
    });

    $("nav > a:nth-child(3)").on("click", async function () {
        hideAllViews();
        $('div[class="my-listings"]').show();

        let username = sessionStorage.getItem("username");

        if (username) {
            let myListings = await kinveyRequester.getMyCars(username);
            renderMyView(myListings);
        }
    });

    $("nav > a:nth-child(4)").on("click", function () {
        hideAllViews();
        $("#create-listing").show();
    });

    $("#button-div a.button:nth-child(1)").on("click", function () {
        hideAllViews();
        $("#login").show();
    });

    $("#button-div a.button:nth-child(2)").on("click", function () {
        hideAllViews();
        $("#register").show();
    });

    $("#login div[class=\"container signin\"] p a").on("click", function () {
        hideAllViews();
        $("#register").show();
    });

    $("#register div[class=\"container signin\"] p a").on("click", function () {
        hideAllViews();
        $("#login").show();
    });
}