function attachEvents() {
    let submitBtn = $("#submit");
    let refreshBtn = $("#refresh");
    let uri = "https://testapp-f78b1.firebaseio.com/messanger.json";

    submitBtn.on("click", submitIt);
    refreshBtn.on("click", refreshIt);

    function submitIt() {
        let newAuthorContainer = $("#author");
        let newMessageContainer = $("#content");

        let jsonObj = JSON.stringify({
            author: newAuthorContainer.val(),
            content: newMessageContainer.val(),
            timestamp: Date.now()
        });

        let postRequest = {
            method: "POST",
            url: uri,
            data: jsonObj
        };

        $.ajax(postRequest)
            .then(refreshIt)
            .catch(handleError);

        newAuthorContainer.val("");
        newMessageContainer.val("");
    }
    
    function refreshIt() {
        let getRequest = {
            method: "GET",
            url: uri
        };

        $.ajax(getRequest)
            .then(loadIt)
            .catch(handleError);
    }

    function loadIt(response) {
        let messageBox = $("#messages");
        let newtext = "";
        let responseKeys = Object.keys(response);
        responseKeys.sort((a, b) => response[a].timestamp - (response[b].timestamp));

        for (let messegeId of responseKeys) {
            newtext += `\n${response[messegeId].author}: ${response[messegeId].content}`;
        }

        messageBox.text(newtext.trim());
    }
    
    function handleError() {
        $("#messages").text("ERROR!!!");
    }
}