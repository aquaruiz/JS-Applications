function attachEvents() {
    const URI = "https://baas.kinvey.com/appdata/kid_ryTUw7cE7/biggestCatches";
    const USER = "peter";
    const PASS = "p";
    const base64 = btoa(USER + ":" + PASS);
    const AUTHORIZATION = {"Authorization": "Basic " + base64};

    $("button.load").on("click", loadIt);
    $("button.add").on("click", createIt);

    function loadIt() {
        let getRequest = {
            method: "GET",
            url: URI,
            headers: AUTHORIZATION
        };

        $.ajax(getRequest)
            .then(showThem)
            .catch(handleError);
    }

    function showThem(response) {
        let catchesContainer = $("#catches").empty();

        for (let resp of response) {
            let newDiv = $("<div>")
                .addClass("catch")
                .attr("data-id", resp["_id"]);

            newDiv.append($("<label>")
                .text("Angler"));

            newDiv.append($("<input>")
                .attr("type", "text")
                .addClass("angler")
                .val(resp.angler));

            newDiv.append($("<label>")
                .text("Weight"));

            newDiv.append($("<input>")
                .attr("type", "number")
                .addClass("weight")
                .val(resp.weight));

            newDiv.append($("<label>")
                .text("Species"));

            newDiv.append($("<input>")
                .attr("type", "text")
                .addClass("species")
                .val(resp.species));

            newDiv.append($("<label>")
                .text("Location"));

            newDiv.append($("<input>")
                .attr("type", "text")
                .addClass("location")
                .val(resp.location));

            newDiv.append($("<label>")
                .text("Bait"));

            newDiv.append($("<input>")
                .attr("type", "text")
                .addClass("bait")
                .val(resp.bait));

            newDiv.append($("<label>")
                .text("Capture Time"));

            newDiv.append($("<input>")
                .attr("type", "number")
                .addClass("captureTime")
                .val(resp.captureTime));

            newDiv.append($("<button>")
                .addClass("update")
                .text("Update")
                .on("click", updateIt));


            newDiv.append($("<button>")
                .addClass("delete")
                .text("Delete")
                .on("click", deleteIt));

            newDiv.appendTo(catchesContainer);
        }
    }

    function updateIt() {
        let catchId = $(this).parent().attr("data-id");
        let catchContainer = $(this).parent();

        let angler = $(catchContainer.children()[1]).val();
        let weight = Number($(catchContainer.children()[3]).val());
        let species = $(catchContainer.children()[5]).val();
        let location = $(catchContainer.children()[7]).val();
        let bait = $(catchContainer.children()[9]).val();
        let captureTime = Number($(catchContainer.children()[11]).val());

        let putRequest = {
            method: "PUT",
            url: URI + "/" + catchId,
            headers: {"Authorization": "Basic " + base64, "Content-type": "application/json"},
            data: JSON.stringify({
                angler,
                weight,
                species,
                location,
                bait,
                captureTime
            })
        };

        $.ajax(putRequest)
            .catch(handleError);
    }
    function deleteIt() {
        let id = $(this).parent().attr("data-id");
        let deleteRequest = {
            method: "DELETE",
            url: URI + "/" + id,
            headers: AUTHORIZATION
        };

        $.ajax(deleteRequest)
            .then(loadIt)
            .catch(handleError);
    }

    function createIt() {
        let catchContainer = $("#addForm");
        let angler = $(catchContainer.children()[2]).val();
        let weight = Number($(catchContainer.children()[4]).val());
        let species = $(catchContainer.children()[6]).val();
        let location = $(catchContainer.children()[8]).val();
        let bait = $(catchContainer.children()[10]).val();
        let captureTime = Number($(catchContainer.children()[12]).val());

        $(catchContainer.children()[2]).val("");
        $(catchContainer.children()[4]).val("");
        $(catchContainer.children()[6]).val("");
        $(catchContainer.children()[8]).val("");
        $(catchContainer.children()[10]).val("");
        $(catchContainer.children()[12]).val("");

        let postRequest = {
            method: "POST",
            url: URI,
            headers: {"Authorization": "Basic " + base64, "Content-type": "application/json"},
            data: JSON.stringify({
                angler,
                weight,
                species,
                location,
                bait,
                captureTime
            })
        };

        $.ajax(postRequest)
            .then(loadIt)
            .catch(handleError);
    }

    function handleError(err) {
        console.log(err.status, err.statusText);
    }
}