function attachEvents(){
    const URI = "https://baas.kinvey.com/appdata/kid_ryTUw7cE7";
    const USER = "peter";
    const PASS = "p";
    const base64 = btoa(USER + ":" + PASS);
    const AUTHORIZATION = {"Authorization": "Basic " + base64};

    $(window).on("load", loadCounties);

    function loadCounties() {
        let getCountiesRequest = {
            methos: "GET",
            url: URI + "/Country",
            headers: AUTHORIZATION
        };

        $.ajax(getCountiesRequest)
            .then(displayCounties)
            .catch(handleError);
    }

    function displayCounties(response) {
        let container = $("#results");

        for (let resp of response) {
            ($("<tr>")
                .append(
                    $("<td>")
                        .attr("colspan", "2")
                        .text(resp.name)
                        .on("click", showTowns)))
                .appendTo(container);
        }
    }

    function showTowns() {
        let searchedCounty = $(this).text();

        let getTownsRequest = {
            methos: "GET",
            url: URI + "/Town" + `?query={"country":"${searchedCounty}"}`,
            headers: AUTHORIZATION
        };

        $.ajax(getTownsRequest)
            .then(displayTowns)
            .catch(handleError);
    }

    function displayTowns(response) {
        let townContainer = $(`td:contains(${response[0].country})`).parent();

        for (let responseElement of response) {
            let newTr = $("<tr>")
                .append($("<td>"))
                .append($("<td>")
                    .text(responseElement.name));

            newTr.appendTo(townContainer);
        }
    }

    function handleError(err) {
        console.log(err.status, err.statusText);
    }
}