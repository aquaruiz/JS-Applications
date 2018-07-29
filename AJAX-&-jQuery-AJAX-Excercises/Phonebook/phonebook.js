function attachEvents() {
    $("#btnCreate").on("click", createContact);
    $("#btnLoad").on("click", loadContacts);
    let phoneBook = $("#phonebook");
    let baseServiceUrl = 'https://phonebook-nakov.firebaseio.com/phonebook';

    function createContact() {
        let person = $("#person");
        let phone = $("#phone");

        let newContactJson = JSON.stringify({
            person: person.val(),
            phone: phone.val()
        });

        person.val("");
        phone.val("");

        $.post(baseServiceUrl + ".json", newContactJson)
            .then(loadContacts).catch(handleError);
    }


    function loadContacts() {
        phoneBook.empty();
        $.get(baseServiceUrl + ".json")
            .then(displayContacts)
            .catch(handleError);
    }

    function displayContacts(contacts) {
        for (let key in contacts) {
            let personName = contacts[key].person;
            let personPhone = contacts[key].phone;

            let newLi = $("<li>")
                .text(personName + ": " + personPhone + " ");
            phoneBook.append(newLi
                .append(
                    $("<button>")
                        .text("[Delete]")
                        .on("click", deleteContact.bind(this, key))
                )
            )
        }
    }

    function deleteContact(key) {
        let request = {
            method: "DELETE",
            url: `${baseServiceUrl}/${key}.json`
        };

        $.ajax(request)
            .then(loadContacts)
            .catch(handleError);
    }

    function handleError() {
        phoneBook.append(
            $("<li>")
                .text("Error")
        );
    }
}