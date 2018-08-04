function startApp() {
    const KINVEYBASEURL = "https://baas.kinvey.com/";
    const KINVEYAPPKEY = "kid_ryTUw7cE7";
    const KINVEYAPPSECRET = "c3f2438fef2a4c738d2011cdf5e88095";
    const KINVEYLOGINURL = KINVEYBASEURL + "user/" + KINVEYAPPKEY + "/login/";
    const KINVEYAUTHHEADERS = {
        "Authorization": "Basic " + btoa(KINVEYAPPKEY + ":" + KINVEYAPPSECRET)
    };
    const KINVEYREGISTERURL = KINVEYBASEURL + "user/" + KINVEYAPPKEY + "/";
    const KINVEYLOGOUTURL = KINVEYBASEURL + "user/" + KINVEYAPPKEY + "/_logout/";
    const KINVEYADVERTSURL = KINVEYBASEURL + "appdata/" + KINVEYAPPKEY + "/prodavachnik/";

    // $('header').find('a').show();

    sessionStorage.clear();
    showHideMenuLinks();
    showView("viewHome");

    function showHideMenuLinks() {
        $("#linkHome").show();
        if (sessionStorage.getItem("authToken") === null) {
            // not logged in user
            $("#linkLogin").show();
            $("#linkRegister").show();
            $("#linkListAds").hide();
            $("#linkCreateAd").hide();
            $("#linkLogout").hide();
        } else {
            // logged in user
            $("#linkLogin").hide();
            $("#linkRegister").hide();
            $("#linkListAds").show();
            $("#linkCreateAd").show();
            $("#linkLogout").show();
        }
    }

    function showView(view) {
        // hide all views then show only selected
        $("main > section").hide();
        $("#" + view).show();
    }

    // link links in header
    $("#linkHome").on("click", showHomeView);
    $("#linkLogin").on("click", showLoginView);
    $("#linkRegister").on("click", showRegisterView);
    $("#linkListAds").on("click", listAdverts);
    $("#linkCreateAd").on("click", showCreateAdView);
    $("#linkLogout").on("click", logoutUser);

    //link form buttons
    $("#buttonLoginUser").on("click", loginUser);
    $("#buttonRegisterUser").on("click", registerUser);
    $("#buttonCreateAd").on("click", createAdvert);
    $("#buttonEditAd").on("click", editAdvert);

    // error boxes fade out
    $("#infoBox, #errorBox").on("click", function () {
        $(this).fadeOut();
    });

    //attach AJAX "loading" event listener
    $(document).on("ajaxStart", function () {
        $("#loadingBox").show();
    });

    $(document).on("ajaxStop", function () {
        $("#loadingBox").hide();
    });

    function showInfo(message) {
        $("#infoBox").text(message);
        $("#infoBox").show();
        setTimeout(function () {
            $("#infoBox").fadeOut();
        }, 3000);
    }

    function showError(message) {
        $("#errorBox").text("Error: " + message);
        $("#errorBox").show();
    }

    function handleAjaxError(response) {
        let errorMsg = JSON.stringify(response);
        if (response.readyState === 0) {
            errorMsg = "Cannot connect due to network error.";
        }

        if (response.responseJSON && response.responseJSON.description) {
            errorMsg = response.responseJSON.description;
        }

        showError(errorMsg);
    }

    function showHomeView() {
        showView("viewHome");
    }

    function showLoginView() {
        showView("viewLogin");
        $("#formLogin").trigger("reset");
    }

    function showRegisterView() {
        showView("viewRegister");
        $("#formRegister").trigger("reset");
    }

    function showCreateAdView() {
        showView("viewCreateAd");
        $("#formCreateAd").trigger("reset");
    }

    // user login
    function loginUser() {
        let userData = {
            username: $("#formLogin input[name='username']").val(),
            password: $("#formLogin input[name='passwd']").val()
        };

        $.ajax({
            method: "POST",
            url: KINVEYLOGINURL,
            headers: KINVEYAUTHHEADERS,
            data: userData,
            success: loginSuccess,
            error: handleAjaxError
        });

        function loginSuccess(userInfo) {
            saveAuthInSession(userInfo);
            showHideMenuLinks();
            listAdverts();
            showInfo("Login successful.");
        }
    }

    function saveAuthInSession(userInfo) {
        let userAuth = userInfo._kmd.authtoken;
        sessionStorage.setItem("authToken", userAuth);

        let userId = userInfo._id;
        sessionStorage.setItem("userId", userId);

        let username = userInfo.username;
        $("#loggedInUser").text("Welcome, " + username + "!");
    }

    // user register
    function registerUser() {
        let userData = {
            username: $("#formRegister input[name='username']").val(),
            password: $("#formRegister input[name='passwd']").val()
        };

        $.ajax({
            method: "POST",
            url: KINVEYREGISTERURL,
            headers: {
                "Authorization": "Basic " + btoa(KINVEYAPPKEY + ":" + KINVEYAPPSECRET),
                "Content-Type": "application/json"
            },
            data: JSON.stringify(userData),
            success: registerSuccess,
            error: handleAjaxError
        });

        function registerSuccess(userInfo) {
            saveAuthInSession(userInfo);
            showHideMenuLinks();
            listAdverts();
            showInfo("User Registration Successful.");
        }
    }

    // user logout
    function logoutUser() {
        let authToken = sessionStorage.getItem("authToken");

        $.ajax({
            method: "POST",
            url: KINVEYLOGOUTURL,
            headers: {"Authorization": "Kinvey " + authToken},
            success: logoutSuccess,
            error: handleAjaxError
        })
    }

    function logoutSuccess(userInfo) {
        sessionStorage.clear();
        $("#loggedInUser").text("");
        showHideMenuLinks();
        showHomeView();
        showInfo("Logout Successful.")
    }

    // advertisements list all
    function listAdverts() {
        let authToken = sessionStorage.getItem("authToken");

        $("#ads").empty();
        showView("viewAds");

        $.ajax({
            method: "GET",
            url: KINVEYADVERTSURL,
            headers: {"Authorization": "Kinvey " + authToken},
            success: loadAdvertsSuccess,
            error: handleAjaxError
        });

        function loadAdvertsSuccess(adverts) {
            showInfo("Advertisements loaded.");

            if (adverts.length < 1) {
                $("#ads").text("No Advertisements available.")
            } else {
                let advertsTable = $("<table>")
                    .append($("<tr>")
                        .append('<th>Title</th>',
                            '<th>Description</th>',
                            '<th>Publisher</th>',
                            '<th>Date Published</th>',
                            '<th>Price</th>',
                            '<th>Actions</th>'));

                for (const ad of adverts) {
                    let readMoreLink = $(`<a data-id="${ad._id}" href="#">[Read More]</a>`)
                        .on("click", function () {
                            displayAdvert($(this).attr("data-id"));
                        });
                    let links = [readMoreLink];

                    if (ad._acl.creator === sessionStorage.getItem("userId")) {
                        let deleteLink = $(`<a data-id="${ad._id}" href="#">[Delete]</a>`)
                            .on("click", function () {
                                deleteAdvert($(this).attr("data-id"));
                            });

                        let editLink = $(`<a data-id="${ad._id}" href="#">[Edit]</a>`)
                            .on("click", function () {
                                loadAdvertForEdit($(this).attr("data-id"));
                            });

                        links = [readMoreLink, " ", deleteLink, " ", editLink];
                    }

                    advertsTable.append($("<tr>")
                        .append(
                            $("<td>").text(ad.title),
                            $("<td>").text(ad.description),
                            $("<td>").text(ad.publisher),
                            $("<td>").text(ad.datePublished),
                            $("<td>").text(Number(ad.price).toFixed(2)),
                            $("<td>").append(links)
                        )
                    );
                }

                $('#ads').append(advertsTable);
            }
        }
    }

    // create new ad
    function createAdvert() {
        // GET request is only for getting user username
        const kinveyUserUrl = `${KINVEYBASEURL}user/${KINVEYAPPKEY}/${sessionStorage.getItem("userId")}`;
        let authToken = sessionStorage.getItem("authToken");

        $.ajax({
            method: "GET",
            headers: {"Authorization": "Kinvey " + authToken},
            success: afterPublisherRequest,
            url: kinveyUserUrl,
            error: handleAjaxError
        });

        function afterPublisherRequest(publisher) {
            let advertData = {
                title: $("#formCreateAd input[name='title']").val(),
                description: $("#formCreateAd textarea[name='description']").val(),
                publisher: publisher.username,
                datePublished: $("#formCreateAd input[name='datePublished']").val(),
                price: $("#formCreateAd input[name='price']").val(),
                image: $("#formCreateAd input[name='image']").val()
            };

            $.ajax({
                method: "POST",
                url: KINVEYADVERTSURL,
                headers: {"Authorization": "Kinvey " + authToken,
                    'Content-Type': 'application/json'},
                data: JSON.stringify(advertData),
                success: createAdvertSuccess,
                error: handleAjaxError
            });
            
            function createAdvertSuccess() {
                listAdverts();
                showInfo("Advertisement created.")
            }
        }
    }

    // delete ad
    
    function deleteAdvert(advertId) {
        let authToken = sessionStorage.getItem("authToken");

        $.ajax({
            method: "DELETE",
            url: KINVEYADVERTSURL + advertId,
            headers: {
                "Authorization": "Kinvey " + authToken
            },
            success: deleteAdvertSuccess,
            error: handleAjaxError
        });
        
        
        function deleteAdvertSuccess(adsDeleted) {
            listAdverts();
            showInfo("Advert deleted.")
        }
    }
    
    // edit ad
    
    function loadAdvertForEdit(advertId) {
        let authToken = sessionStorage.getItem("authToken");

        $.ajax({
            method: "GET",
            url: KINVEYADVERTSURL + advertId,
            headers: {
                "Authorization": "Kinvey " + authToken
            },
            success: loadAdvertForEditSuccess,
            error: handleAjaxError
        });
        
        function loadAdvertForEditSuccess(advert) {
            $("#formEditAd input[name='id']").val(advert._id);
            $("#formEditAd input[name='publisher']").val(advert.publisher);
            $("#formEditAd input[name='title']").val(advert.title);
            $("#formEditAd textarea[name='description']").val(advert.description);
            $("#formEditAd input[name='datePublished']").val(advert.datePublished);
            $("#formEditAd input[name='price']").val(advert.price);
            $("#formEditAd input[name='image']").val(advert.image);
            showView("viewEditAd");
        }
    }
    
    // details ad
    function displayAdvert(advertId) {
        let authToken = sessionStorage.getItem("authToken");

        console.log(KINVEYADVERTSURL + advertId);
        $.ajax({
            method: "GET",
            url: KINVEYADVERTSURL + advertId,
            headers: {
                "Authorization": "Kinvey " + authToken
            },
            success: displayAdvertSuccess,
            error: handleAjaxError
        });

        function displayAdvertSuccess(advert) {
        let advertInfo = $("<div>")
            .append(
                $("<img>").attr("src", advert.image),
                $("<br>"),
                $("<label>").text("Title:"),
                $("<h1>").text(advert.title),
                $("<label>").text("Description:"),
                $("<p>").text(advert.description),
                $("<label>").text("Price:"),
                $("<h4>").text(Number(advert.price).toFixed(2)),
                $("<label>").text("Publisher:"),
                $("<div>").text(advert.publisher),
                $("<label>").text("Date:"),
                $("<div>").text(advert.datePublished)
            );

            $("#viewDetailsAd").empty();
            $("#viewDetailsAd").append(advertInfo);
            showView("viewDetailsAd");
        }
    }
    
    // edit ad
    function editAdvert() {
        let authToken = sessionStorage.getItem("authToken");
        let kinveyEditAdUrl = KINVEYBASEURL + "appdata/" + KINVEYAPPKEY + "/prodavachnik/" + $("#formEditAd input[name='id']").val();
        let authHeaders = {"Authorization": "Kinvey " + authToken,
                "Content-Type": "application/json"};

        let advertData = {
            title: $("#formEditAd input[name='title']").val(),
            description: $("#formEditAd textarea[name='description']").val(),
            publisher: $("#formEditAd input[name='publisher']").val(),
            datePublished: $("#formEditAd input[name='datePublished']").val(),
            price: $("#formEditAd input[name='price']").val(),
            image: $("#formEditAd input[name='image']").val(),
        };

        $.ajax({
            method: "PUT",
            url: kinveyEditAdUrl,
            headers: authHeaders,
            data: JSON.stringify(advertData),
            success: editAdvertSuccess,
            error: handleAjaxError
        });
        
        function editAdvertSuccess(editedAdvert) {
            listAdverts();
            showInfo("Advertisement edited.");
        }
    }
}