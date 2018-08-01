function attachEvents() {
    const URI = "https://baas.kinvey.com/appdata/kid_ryTUw7cE7/players";
    const USER = "peter";
    const PASS = "p";
    const base64 = btoa(USER + ":" + PASS);
    const AUTHORIZATION = {"Authorization": "Basic " + base64};

    $(window).ready(getPlayers);
    $('#addPlayer').click(addPlayer);

    function getPlayers() {
        let getRequest = {
            method: "GET",
            url: URI,
            headers: AUTHORIZATION
        };

        $.ajax(getRequest)
            .then(loadPlayers)
            .catch(handleError);
    }

    function loadPlayers(response) {
        let container = $("#players");
        container.empty();

        for (let player of response) {
            let newDiv = $("<div>")
                .addClass("player")
                .attr("data-id", player._id)
                .append($("<div>")
                    .addClass("row")
                    .append($("<label>")
                        .text("Name:"))
                    .append($("<label>")
                        .addClass("name")
                        .text(player.name)))
                .append($("<div>")
                    .addClass("row")
                    .append($("<label>")
                        .text("Money:"))
                    .append($("<label>")
                        .addClass("money")
                        .text(player.money)))
                .append($("<div>")
                    .addClass("row")
                    .append($("<label>")
                        .text("Bullets:"))
                    .append($("<label>")
                        .addClass("bullets")
                        .text(player.bullets)))
                .append(($("<button>")
                    .addClass("play")
                    .text("Play")
                    .on("click", playIt.bind(this, player))))
                .append(($("<button>")
                    .addClass("delete")
                    .text("Delete")
                    .on("click", deleteIt.bind(this, player))));

            newDiv.appendTo(container);
        }
    }

    function playIt(player) {
        $('#save').trigger('click');

        $('#canvas').css('display', 'block');
        $('#save').css('display', 'inline-block');
        $('#reload').css('display', 'inline-block');

        loadCanvas(player);
    }

    function deleteIt(player) {
        let deleteRequest = {
            method: "DELETE",
            url: URI + "/" + player._id,
            headers: AUTHORIZATION
        };

        $.ajax(deleteRequest)
            .then(getPlayers)
            .catch(handleError);
    }

    function addPlayer() {
        let name = $('#addName').val();
        let money = 500;
        let bullets = 6;

        let request = {
            url: URI,
            method: "POST",
            headers: {
                "Authorization": "Basic " + base64,
                "Content-type": "application/json"
            },
            data: JSON.stringify({
                name: name,
                money: money,
                bullets: bullets
            })
        };

        $.ajax(request).then(function(){
            getPlayers();
            $('#addName').val('');
        });
    }

    function handleError(err) {
        console.log(err.status, err.statusText);
    }
}