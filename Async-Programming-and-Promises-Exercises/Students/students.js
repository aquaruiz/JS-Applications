function attachEvents() {
    const APIKEY = "kid_BJXTsSi-e";
    const APISECRET = "447b8e7046f048039d95610c1b039390";
    const URI = `https://baas.kinvey.com/appdata/${APIKEY}/students`;
    const USER = "guest";
    const PASS = "guest";
    const base64 = btoa(USER + ":" + PASS);
    const AUTHORIZATION = {"Authorization": "Basic " + base64};

    let container = $("#results");

    $(window).on("load", function () {
        let newTr = $("<tr>");

        $("<td>")
            .append($("<input>")
                .attr("type", "number")
                .attr("placeholder", "Enter ID"))
            .appendTo(newTr);

        $("<td>")
            .append($("<input>")
                .attr("type", "text")
                .attr("placeholder", "Enter First Name"))
            .appendTo(newTr);

        $("<td>")
            .append($("<input>")
                .attr("type", "text")
                .attr("placeholder", "Enter Last Name"))
            .appendTo(newTr);

        $("<td>")
            .append($("<input>")
                .attr("type", "text")
                .attr("placeholder", "Enter Faculty Number"))
            .appendTo(newTr);

        $("<td>")
            .append($("<input>")
                .attr("type", "number")
                .attr("placeholder", "Enter Grade"))
            .appendTo(newTr);

        container.append(newTr);

        $("<tr>")
            .append($("<td>")
                .attr("colspan", "5")
                .append($("<button>")
                .text("Save")
                .on("click", saveIt)))
            .appendTo(container);

        let getRequest = {
            method: "GET",
            url: URI,
            headers: AUTHORIZATION
        };
        
        $.ajax(getRequest).then(loadThem)
            .catch(handleError)
    });
    
    function loadThem(response) {
        function compare(a,b) {
            if (a.ID < b.ID)
                return -1;
            if (a.ID > b.ID)
                return 1;
            return 0;
        }

        response.sort(compare);

        for (const item of response) {
            let newTr = $("<tr>");

            $("<td>")
                .text(item.ID)
                .appendTo(newTr);

            $("<td>")
                .text(item["FirstName"])
                .appendTo(newTr);

            $("<td>")
                .text(item.LastName)
                .appendTo(newTr);

            $("<td>")
                .text(item.FacultyNumber)
                .appendTo(newTr);

            $("<td>")
                .text(item.Grade)
                .appendTo(newTr);

            container.append(newTr);
        }
    }

    function saveIt () {
        let id = Number($(`#results tr:nth-child(2) td:nth-child(1) input`).val());
        let firstName = $(`#results tr:nth-child(2) td:nth-child(2) input`).val();
        let lastName = $(`#results tr:nth-child(2) td:nth-child(3) input`).val();
        let facultyNumber = $(`#results tr:nth-child(2) td:nth-child(4) input`).val();
        let grade = Number($(`#results tr:nth-child(2) td:nth-child(5) input`).val());

        if (id > 0 && firstName && lastName && facultyNumber && grade > 0){
            let postRequest = {
                method: "POST",
                url: URI,
                headers: {"Authorization": "Basic " + base64, "Content-type": "application/json"},
                data: JSON.stringify({
                    "ID": id,
                    "FirstName": firstName,
                    "LastName": lastName,
                    "FacultyNumber": facultyNumber,
                    "Grade": grade
                })
            };

            $.ajax(postRequest)
                .then(function () {
                    location.reload();
                })
                .catch(handleError)
        }
    }

    function handleError(err) {
        console.log(err.status, err.statusText);
    }
}