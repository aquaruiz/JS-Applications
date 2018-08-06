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
        async function renderNavBar(){
            let source = await $.get("./templates/nav-bar.hbs");
            let template = Handlebars.compile(source);
            let context = {
                notLoggedIn: sessionStorage.getItem('authToken') === null,
                text: `Welcome, ${sessionStorage.getItem('username')} !`
            };

            let navbar = template(context);
            $("#menu").empty();
            $("#menu").append(navbar);
            linkLinks();
        }

        renderNavBar();
    }

    function showView(view) {
        // hide all views then show only selected
        $("main > section").hide();
        $("#" + view).show();
    }

    // link links in header
    function linkLinks() {
        $("#linkHome").on("click", showHomeView);
        $("#linkLogin").on("click", showLoginView);
        $("#linkRegister").on("click", showRegisterView);
        $("#linkListAds").on("click", listAdverts);
        $("#linkCreateAd").on("click", showCreateAdView);
        $("#linkLogout").on("click", logoutUser);
    }

    //link form buttons
    function attachBtnEvent(btn){
        switch (btn){
            case "login":
                return $("#buttonLoginUser").on("click", loginUser);
            case "register":
                return $("#buttonRegisterUser").on("click", registerUser);
            case "createAd":
                return $("#buttonCreateAd").on("click", createAdvert);
            case "editAd":
                return $("#buttonEditAd").on("click", editAdvert);
        }
    }

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
        showView('viewLogin');
        $('#viewLogin').empty();

        async function renderLoginForm(){
            let source = await $.get("./templates/login-register.hbs");
            let template = Handlebars.compile(source);
            let context = {loggingIn: true};
            let loginForm = template(context);
            $('#viewLogin').append(loginForm);
            attachBtnEvent("login");
        }

        renderLoginForm();
    }

    function showRegisterView() {
        showView("viewRegister");
        $('#viewRegister').empty();

        async function renderRegisterForm(){
            let source = await $.get("./templates/login-register.hbs");
            let template = Handlebars.compile(source);
            let context = {loggingIn: false};
            let registerForm = template(context);
            $('#viewRegister').append(registerForm);
            attachBtnEvent("register");
        }

        renderRegisterForm();
    }

    function showCreateAdView() {
        showView("viewCreateAd");
        $('#viewCreateAd').empty();

        async function renderCreateForm(){
            let source = await $.get("./templates/create-edit.hbs");
            let template = Handlebars.compile(source);
            let context = {forCreation: true};
            let createForm = template(context);
            $('#viewCreateAd').append(createForm);
            attachBtnEvent("createAd");
        }

        renderCreateForm();
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
        sessionStorage.setItem("username", username);
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

        showView("viewAds");
        $("#viewAds").empty();

        $.ajax({
            method: "GET",
            url: KINVEYADVERTSURL,
            headers: {"Authorization": "Kinvey " + authToken},
            success: loadAdvertsSuccess,
            error: handleAjaxError
        });

        function loadAdvertsSuccess(ads) {
            showInfo("Advertisements loaded.");
            $("#viewAds").empty();

            if(ads.length > 0){
                async function renderAds() {
                    ads.forEach(ad => {
                        if(ad._acl.creator === sessionStorage.getItem("userId")){
                            ad.isAuthor = true;
                        }
                    });

                    ads.map(ad => ad.price = Number(ad.price).toFixed(2));

                    let listSource = await $.get("./templates/ads-catalog.hbs");
                    let adsTemplate = Handlebars.compile(listSource);
                    let adsContext = {ads: ads};
                    let adsHtml = adsTemplate(adsContext);

                    $("#viewAds").append(adsHtml);

                    attachBtnEvents();
                }

                renderAds();
                
                function attachBtnEvents() {
                    $('.btnReadMore').on('click', function () {
                        displayAdvert($(this).parent().parent().attr("data-id"))});

                    $('.btnDelete').on('click', function () {
                        deleteAdvert($(this).parent().parent().attr("data-id"))});

                    $('.btnEdit').on('click', function () {
                        loadAdvertForEdit($(this).parent().parent().attr("data-id"))});
                }
            } else {
                $('#viewAds').append($('<p>No advertisements available.</p>'));
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
            showView("viewEditAd");
            $('#viewEditAd').empty();

            async function renderEditForm(){
                let source = await $.get("./templates/create-edit.hbs");
                let template = Handlebars.compile(source);
                let context = {
                    forCreation: false,
                    id: advert._id,
                    publisher: advert.publisher,
                    title: advert.title,
                    description: advert.description,
                    datePublished: advert.datePublished,
                    price: advert.price,
                    image: advert.image
                };
                let editForm = template(context);
                $('#viewEditAd').append(editForm);
                attachBtnEvent("editAd");
            }

            renderEditForm();
        }
    }
    
    // details ad
    function displayAdvert(advertId) {
        let authToken = sessionStorage.getItem("authToken");

        $.ajax({
            method: "GET",
            url: KINVEYADVERTSURL + advertId,
            headers: {
                "Authorization": "Kinvey " + authToken
            },
            success: displayAdvertSuccess,
            error: handleAjaxError
        });

        function displayAdvertSuccess(ad) {
            async function renderDetails(){
                ad.price = Number(ad.price).toFixed(2);
                if(ad.image.length > 0){
                    ad['hasImage'] = true;
                }

                let listSource = await $.get("./templates/ad-details.hbs");
                let adsTemplate = Handlebars.compile(listSource);
                let adsContext = ad;
                let adsHtml = adsTemplate(adsContext);

                $("#viewDetailsAd").empty();
                $("#viewDetailsAd").append(adsHtml);
                showView("viewDetailsAd");
            }

            renderDetails();
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