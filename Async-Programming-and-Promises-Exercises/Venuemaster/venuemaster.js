function attachEvents() {
    const URI_RPC = "https://baas.kinvey.com/rpc/kid_BJ_Ke8hZg/custom/calendar";
    const URI = "https://baas.kinvey.com/appdata/kid_BJ_Ke8hZg";
    const USER = "guest";
    const PASS = "pass";
    const base64 = btoa(USER + ":" + PASS);
    const AUTHORIZATION = {"Authorization": "Basic " + base64};

    let venuesContainer = $("#venue-info");

    $("#getVenues").on("click", getIds);

    function getIds() {
        let date = $("#venueDate").val();

        if (date === "") {
            return;
        }

        let postRpcRequest = {
            method: "POST",
            url: URI_RPC + `?query=${date}`,
            headers: AUTHORIZATION
        };

        $("#venueDate").val("");

        $.ajax(postRpcRequest)
            .then(getVenues)
            .catch(handleError);
    }

    function getVenues(response) {
        venuesContainer.empty();

        for (const res of response) {
            let getVenuesRequest = {
                method: "GET",
                url: URI + "/venues/" + res,
                headers: AUTHORIZATION
            };

            $.ajax(getVenuesRequest)
                .then(displayVenue)
                .catch(handleError)
        }
    }

    function displayVenue(response) {
        let newDiv = $("<div>")
            .addClass("venue")
            .attr("id", response._id)
            .append($("<span>")
                .addClass("venue-name")
                .text(response.name)
                .append($("<input>")
                    .addClass("info")
                    .attr("type", "button")
                    .attr("value", "More info")
                    .on("click", showMoreDetails)))
            .append($("<div>")
                .addClass("venue-details")
                .css("display", "none")
                .append($("<table>")
                    .append($("<tr>")
                        .append($("<th>")
                            .text("Ticket Price"))
                        .append($("<th>")
                            .text("Ticket PriceQuantity"))
                        .append("<th>"))
                    .append($("<tr>")
                        .append($("<td>")
                            .addClass("venue-price")
                            .text(`${response.price} lv`))
                        .append($("<td>")
                            .append($("<select>")
                                .addClass("quantity")
                                .append($("<option>")
                                    .val("1")
                                    .text("1"))
                                .append($("<option>")
                                    .val("2")
                                    .text("2"))
                                .append($("<option>")
                                    .val("3")
                                    .text("3"))
                                .append($("<option>")
                                    .val("4")
                                    .text("4"))
                                .append($("<option>")
                                    .val("5")
                                    .text("5"))))
                        .append($("<td>")
                            .append($("<input>")
                                .addClass("purchase")
                                .attr("type", "button")
                                .val("Purchase")
                                .on("click", confirmPurchase)))))
                .append($("<span>")
                    .addClass("head")
                    .text("Venue description:"))
                .append($("<p>")
                    .addClass("description")
                    .text(response.description))
                .append($("<p>")
                    .addClass("description")
                    .text("Starting time: " + response.startingHour)));

        venuesContainer.append(newDiv);
    }

    function showMoreDetails() {
        $(".venue-details").hide();
        $(this).parent().next().show();
    }

    function confirmPurchase() {
        let container = $(this).parent().parent().parent().parent();
        let purchasedQnty = Number($(this).parent().parent().find("option:selected").text());
        let pricePerTicket = Number($(this).parent().parent().find(".venue-price").text().split(" ")[0]);
        let venueName = $($(this).parent().parent().parent().parent().parent().children()[0]).text();
        let venueId = $(this).parent().parent().parent().parent().parent().attr("id");

        container.empty();

        let newSpan = $("<span>")
            .addClass("head")
            .text("Confirm purchase");

        let newDiv = $("<div>")
            .addClass("purchase-info")
            .append($("<span>")
                .text(venueName))
            .append($("<span>")
                .text(purchasedQnty + " pcs. x " + pricePerTicket + " lv"))
            .append($("<span>")
                .text(`Total: ${purchasedQnty * pricePerTicket} lv`))
            .append($("<input>")
                .attr("type", "button")
                .val("Confirm")
                .on("click", payTickets.bind(this, venueId, purchasedQnty, container)));

        container.append(newSpan, newDiv);
    }

    function payTickets(venueId, purchasedQnty, container) {
        let postPayRequest = {
            method: "POST",
            url: `https://baas.kinvey.com/rpc/kid_BJ_Ke8hZg/custom/purchase?venue=${venueId}&qty=${purchasedQnty}`,
            headers: AUTHORIZATION
        };

        $.ajax(postPayRequest)
            .then(displayTickets.bind(this, container))
            .catch(handleError);
    }

    function displayTickets(container, response) {
        container.empty();
        container
            .text("You may print this page as your ticket")
            .append(response.html);
    }

    function handleError(err) {
        console.log(err.status, err.statusText);
    }
}