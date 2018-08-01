function attachEvents() {
    const URI = "https://baas.kinvey.com/appdata/kid_ryTUw7cE7";
    const USER = "peter";
    const PASS = "p";
    const base64 = btoa(USER + ":" + PASS);
    const AUTHORIZATION = {"Authorization": "Basic " + base64};

    $("button.load").on("click", loadIt);
    $("button.add").on("click", createIt);

    function loadIt() {
        let getRequest = {
            method: "GET",
            url: URI + "/books",
            headers: AUTHORIZATION
        };

        $.ajax(getRequest)
            .then(showThem)
            .catch(handleError);
    }

    function showThem(response) {
        let booksContainer = $("#books").empty();

        for (let resp of response) {
            let bookId = resp._id;

            let getTagsRequest = {
                method: "GET",
                url: URI + `/tags?query={"bookId":"${bookId}"}`,
                headers: AUTHORIZATION
            };

            $.ajax(getTagsRequest)
                .then(
                    function (response) {
                        let newDiv = $("<div>")
                            .addClass("book")
                            .attr("data-id", resp._id);

                        newDiv.append($("<label>")
                            .text("Author"));

                        newDiv.append($("<input>")
                            .attr("type", "text")
                            .addClass("author")
                            .val(resp.author));

                        newDiv.append($("<label>")
                            .text("Title"));

                        newDiv.append($("<input>")
                            .attr("type", "text")
                            .addClass("title")
                            .val(resp.title));

                        newDiv.append($("<label>")
                            .text("ISBN Number"));

                        newDiv.append($("<input>")
                            .attr("type", "number")
                            .addClass("isbn")
                            .val(resp.isbn));

                        newDiv.append($("<label>")
                            .text("Tags"));

                        let tags = "";

                        for (let resp of response) {
                            tags += " " + resp["tag name"];
                        }

                        newDiv.append($("<input>")
                            .attr("type", "text")
                            .addClass("tags")
                            .val(tags));

                        newDiv.append($("<button>")
                            .addClass("update")
                            .text("Update")
                            .on("click", updateIt));

                        newDiv.append($("<button>")
                            .addClass("delete")
                            .text("Delete")
                            .on("click", deleteIt));

                        newDiv.appendTo(booksContainer);
                    }
                )
                .catch(handleError);

        }
    }

    function updateIt() {
        let bookId = $(this).parent().attr("data-id");
        let bookContainer = $(this).parent();

        let author = $(bookContainer.children()[1]).val();
        let title = $(bookContainer.children()[3]).val();
        let isbn = Number($(bookContainer.children()[5]).val());
        let tags = ($(bookContainer.children()[7]).val()).split(/\W+/).filter(e => e !== "");

        let putRequest = {
            method: "PUT",
            url: URI + "/books/" + bookId,
            headers: {"Authorization": "Basic " + base64, "Content-type": "application/json"},
            data: JSON.stringify({
                author,
                title,
                isbn,
            })
        };

        $.ajax(putRequest).then(
            function () {

                let deleteTagsRequest = {
                    method: "DELETE",
                    url: URI + `/tags?query={"bookId":"${bookId}"}`,
                    headers: AUTHORIZATION
                };

                $.ajax(deleteTagsRequest)
                    .then(
                        function () {
                            for (let tag of tags) {
                                let putTagsRequest = {
                                    method: "POST",
                                    url: URI + "/tags",
                                    headers: {"Authorization": "Basic " + base64, "Content-type": "application/json"},
                                    data: JSON.stringify({
                                        "tag name": tag,
                                        bookId
                                    })
                                };

                                $.ajax(putTagsRequest)
                                    .catch(handleError);
                            }
                        }
                    )
            }
        )
            .catch(handleError);
    }

    function deleteIt() {
        let id = $(this).parent().attr("data-id");

        let deleteRequest = {
            method: "DELETE",
            url: URI + "/books/" + id,
            headers: AUTHORIZATION
        };

        $.ajax(deleteRequest)
            .then(function () {
                let deleteTagsRequest = {
                    method: "DELETE",
                    url: URI + `/tags?query={"bookId":"${id}"}`,
                    headers: AUTHORIZATION
                };

                $.ajax(deleteTagsRequest)
                    .catch(handleError);

                loadIt()
            })
            .catch(handleError);
    }

    function createIt() {
        let booksContainer = $("#addForm");
        let author = $(booksContainer.children()[2]).val();
        let title = $(booksContainer.children()[4]).val();
        let isbn = Number($(booksContainer.children()[6]).val());
        let tags = ($(booksContainer.children()[8]).val()).split(/\W+/).filter(e => e !== "");

        $(booksContainer.children()[2]).val("");
        $(booksContainer.children()[4]).val("");
        $(booksContainer.children()[6]).val("");
        $(booksContainer.children()[8]).val("");

        let postRequest = {
            method: "POST",
            url: URI + "/books",
            headers: {"Authorization": "Basic " + base64, "Content-type": "application/json"},
            data: JSON.stringify({
                author,
                title,
                isbn,
            })
        };

        $.ajax(postRequest)
            .then(function (response){
                let bookId = response._id;

                for (let tag of tags) {
                    let postReqTags = {
                        method: "POST",
                        url: URI + "/tags",
                        headers: {"Authorization": "Basic " + base64, "Content-type": "application/json"},
                        data: JSON.stringify({
                            "tag name": tag,
                            bookId
                        })
                    };

                    $.ajax(postReqTags)
                        .catch(handleError);
                }

                loadIt()
            })
            .catch(handleError);
    }

    function handleError(err) {
        console.log(err.status, err.statusText);
    }
}