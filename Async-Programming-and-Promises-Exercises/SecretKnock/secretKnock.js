function secretKnock() {
    const URI = "https://baas.kinvey.com/appdata/kid_BJXTsSi-e/";
    const APPKEY = "kid_BJXTsSi-e";
    const APPSECRET = "447b8e7046f048039d95610c1b039390";
    const USER = "guest";
    const PASS = "guest";
    const base64 = btoa(USER + ":" + PASS);
    const AUTHORIZATION = {"Authorization": "Basic " + base64};

    const bodyContainer = $("body");
    // $.ajax({
    //     method: "GET",
    //     url: URI + "login",
    //     headers: {"Authorization": "Basic " + btoa(APPKEY + ":" + APPSECRET), "Content-Type": "application/json"},
    //     data: JSON.stringify({
    //         "username": USER,
    //         "password": PASS
    //     })
    // })
    //     .then(function (res) {
    //         console.log(res);
    //     })
    //     .catch(handleError);

    let getRequest = {
        method: "GET",
        url: URI + "knock?query=Knock Knock.",
        headers: AUTHORIZATION
    };

    bodyContainer
        .append($("<p>")
            .text("Knock Knock."));

    $.ajax(getRequest)
        .then(goo)
        .catch(handleError);

    function goo(response) {
        bodyContainer
            .append($("<p>")
                .text(response.answer))
            .append($("<p>")
                .text(response.message));

        if (response.message === undefined)
            return;

        let getNextRequest = {
            method: "GET",
            url: URI + "knock?query=" + response.message,
            headers: AUTHORIZATION
        };

        $.ajax(getNextRequest)
            .then(goo)
            .catch(handleError);

        console.log(response);
    }

    function handleError(err) {
        console.log(err.status, err.statusText);
    }
}