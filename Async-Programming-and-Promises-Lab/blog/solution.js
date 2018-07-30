function attachEvents() {
    $("#btnLoadPosts").on("click", loadIt);
    $("#btnViewPost").on("click", viewIt);
    let uri = "https://baas.kinvey.com/appdata/kid_ryTUw7cE7";
    let user = "peter";
    let pass = "p";

    const base64auth = btoa(user + ":" + pass);
    let selectContainer = $("#posts");

    function loadIt() {
        let request = {
            method: "GET",
            url: uri + "/Posts",
            headers: {"Authorization":"Basic " + base64auth}
        };

        $.ajax(request)
            .then(appendPosts)
            .catch(handleError);

        function appendPosts(response) {
            selectContainer.empty();

            for (const responseElement of response) {
                let newOption = $("<option>")
                    .text(responseElement.title)
                    .val(responseElement._id);
                selectContainer.append(newOption);
            }
        }
    }
    
    function viewIt() {
        let selectedPostName = selectContainer.find("option:selected").text();
        let selectedPostId = selectContainer.val();

        let getCommentsRequest = {
          method: "GET",
          url: uri + "/comments/" + `?query={"post_id":"${selectedPostId}"}`,
          headers: {"Authorization": "Basic " + base64auth}
        };

        let getPostBodyRequest = {
            method: "GET",
            url: uri + "/Posts/" + `${selectedPostId}`,
            headers: {"Authorization": "Basic " + base64auth}
        };

        Promise.all([$.ajax(getCommentsRequest), $.ajax(getPostBodyRequest)])
            .then(showPostDetails)
            .catch(handleError);

        function showPostDetails([commentsResponse, postsResponse]){
            $("#post-title").text(postsResponse.title);
            $("#post-body").empty().append($("<li>").text(postsResponse.body));
            $("#post-comments").empty();

            for (let commentsRestonseElement of commentsResponse) {
                let newLi = $("<li>").text(commentsRestonseElement.text);
                newLi.appendTo($("#post-comments"));
            }
        }
    }

    function handleError(error) {
        let errDiv = $("<div>")
            .text(`Error: ${error.status} (${error.statusText})`);
        $(document.body).prepend(errDiv);

        setTimeout(function () {
            $(errDiv).fadeOut(function () {
                $(errDiv).remove()
            })
        }, 3000);
    }
}