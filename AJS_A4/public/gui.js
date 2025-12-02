let addOrUpdate = ""; 

window.onload = function () {
    // click on table row
    document
        .querySelector("#menuItems")
        .addEventListener("click", handleTableClick);

    // buttons
    document.querySelector("#addButton").addEventListener("click", doAdd);
    document.querySelector("#updateButton").addEventListener("click", doUpdate);
    document.querySelector("#deleteButton").addEventListener("click", doDelete);
    document.querySelector("#doneButton").addEventListener("click", doDone);
    document.querySelector("#cancelButton").addEventListener("click", doCancel);

    refreshTable();

    // hide input panel
    setInputPanelState(false); 

    // disable delete and update buttons when no item selected
    setButtonStates(false); 
};

function doAdd() {
    clearInputPanel();
    setInputPanelState(true);
    setIdInputState(true);
    addOrUpdate = "ADD";
}

function doUpdate() {
    setInputPanelState(true);
    setIdInputState(false);
    addOrUpdate = "UPDATE";
}

function doDelete() {
    let elem = document.querySelector(".selected");
    let id = Number(elem.querySelector("td").innerHTML);
    let url = "http://localhost:8000/menuitems/" + id;
    let method = "DELETE";

    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            let resp = JSON.parse(xhr.responseText);
            if (xhr.status === 200) {
                if (resp.data) {
                    alert("delete successful");
                }
                refreshTable();
            } else {
                alert(resp.err);
            }
        }
    };
    xhr.open(method, url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send();
}

function doDone() {
    let id = Number(document.querySelector("#idInput").value);
    // verify ID is a 3 digit number (between 100 and 999)
    if (!id || id < 100 || id > 999) {
        alert("ID must be a three-digit number.");
        return;
    }

    let category = document.querySelector("#categoryInput").value;
    let description = document.querySelector("#descriptionInput").value;
    let price = Number(document.querySelector("#priceInput").value);
    let vegetarian = document.querySelector("#vegetarianInput").checked;
    let obj = { 
        id: id, 
        category: category, 
        description: description, 
        price: price, 
        vegetarian: vegetarian 
    };

    let url = "http://localhost:8000/menuitems/" + id;
    let method = addOrUpdate === "ADD" ? "POST" : "PUT";

    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            let resp = JSON.parse(xhr.responseText);
            if (addOrUpdate === "ADD") {
                if (xhr.status === 201) {
                    if (resp.data) {
                        alert("add successful");
                    }
                    refreshTable();
                } else {
                    alert(resp.err);
                }
            } else {
                if (xhr.status === 200) {
                    if (resp.data) {
                        alert("update successful");
                    }
                    refreshTable();
                } else {
                    alert(resp.err);
                }
            }
        }
    };
    xhr.open(method, url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.send(JSON.stringify(obj));
    setInputPanelState(false);
}

function doCancel() {
    setInputPanelState(false);
}

function refreshTable() {
    let url = "http://localhost:8000/menuitems";
    let method = "GET";
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            let response = JSON.parse(xhr.responseText);
            if (xhr.status === 200) {
                buildTable(response.data);
                setButtonStates(false);
            } else {
                alert(response.err);
            }
        }
    };
    xhr.open(method, url, true);
    xhr.send();
}

function buildTable(data) {
    let elem = document.querySelector("#menuItems");
    let html = "<table>";
    html += "<tr><th>ID</th><th>Category</th><th>Description</th><th>Price</th><th>Vegetarian</th></tr>";

    data.forEach(item => {
        html += "<tr>";
        html += `<td>${item.id}</td>`;
        html += `<td>${item.category}</td>`;
        html += `<td>${item.description}</td>`;
        // format price 
        html += `<td>$ ${item.price.toFixed(2)}</td>`;
        html += `<td>${item.vegetarian ? "Yes" : "No"}</td>`;
        html += "</tr>";
    });

    html += "</table>";
    elem.innerHTML = html;
}

function handleTableClick(evt) {
    let elem = evt.target;
    if (elem.nodeName !== "TD") return;
    clearSelections();
    let row = elem.parentElement;
    row.classList.add("selected");
    populateInputPanel();
    setButtonStates(true);
}

function populateInputPanel() {
    let row = document.querySelector(".selected");
    let tds = row.querySelectorAll("td");

    let id = Number(tds[0].innerHTML);
    let category = tds[1].innerHTML;
    let description = tds[2].innerHTML;
    let price = Number(tds[3].innerHTML.replace("$", "").trim());
    let vegetarian = tds[4].innerHTML === "Yes";


    document.querySelector("#idInput").value = id;
    document.querySelector("#categoryInput").value = category;
    document.querySelector("#descriptionInput").value = description;
    document.querySelector("#priceInput").value = price;
    document.querySelector("#vegetarianInput").checked = vegetarian;
}

function clearInputPanel() {
    document.querySelector("#idInput").value = 0;
    document.querySelector("#categoryInput").value = "";
    document.querySelector("#descriptionInput").value = "";
    document.querySelector("#priceInput").value = 0;
    document.querySelector("#vegetarianInput").checked = false;
}

function clearSelections() {
    let rows = document.querySelectorAll("tr");
    for (let i = 0; i < rows.length; i++) {
        rows[i].classList.remove("selected");
    }
}

function setButtonStates(value) {
    let updateButton = document.querySelector("#updateButton");
    let deleteButton = document.querySelector("#deleteButton");
    if (value) {
        updateButton.removeAttribute("disabled");
        deleteButton.removeAttribute("disabled");
    } else {
        updateButton.setAttribute("disabled", "disabled");
        deleteButton.setAttribute("disabled", "disabled");
    }
}

function setInputPanelState(value) {
    let elem = document.querySelector("#inputPanel");
    if (value) {
        elem.classList.remove("hidden");
    } else {
        elem.classList.add("hidden");
    }
}

function setIdInputState(value) {
    let elem = document.querySelector("#idInput");
    if (value) {
        elem.removeAttribute("disabled");
    } else {
        elem.setAttribute("disabled", "disabled");
    }
}