import "./App.css";
import "bootstrap/dist/css/bootstrap.css";
import { useState } from "react";
import { ButtonPanel } from "./components/ButtonPanel";
import { MenuTable } from "./components/MenuTable";
import { AddUpdatePanel } from "./components/AddUpdatePanel";

function App() {
    const BASE_DATA_URL = "http://localhost:8000/menuitems";

    // Application State
    let [menuItems, setMenuItems] = useState([]); // items shown in the table
    let [selectedItem, setSelectedItem] = useState(null); // the currently selected item (when user clicks a row)
    let [controlPanelVisible, setControlPanelVisible] = useState(false); // is the control panel visible?
    let [panelItem, setPanelItem] = useState(null); // the item currently shown in the control panel
    let [isInsert, setIsInsert] = useState(true); // true for Add button click, false for Update button click

    /*
     * Event Handing Overview
     *
     * Load button click     - AJAX: get data from back end, rebuild main table
     * user clicks table row - highlight row, activate Update and Delete buttons,
     *                         set selected item to item matching the clicked row
     * Delete button click   - AJAX: delete item from back end, then click Load button
     *                             (to rebuild table etc.)
     * Add button click      - reveal control panel, set panel item to null
     * Update button click   - reveal control panel, set panel item to selected item
     * Done button click     - AJAX: if Add was clicked (isInsert is true),
     *                                   add item to back end, then click Load button
     *                               if Update was clicked (isInsert is false),
     *                                   update item in back end, then click Load button
     * Reset button click    - set panel item to null
     * Cancel button click   - hide control panel
     *
     * user changes data in the control panel
     *     - every change must be recorded instantly and reflected in the "panelItem" state variable
     *     - the event handler expects the child to send two pieces of data:
     *         (a) the name of the field that was changed
     *         (b) the new data for that field
     */

    // Event Handlers
    function handleLoadClick() {
        let url = BASE_DATA_URL;
        let method = "GET";
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                let response = JSON.parse(xhr.responseText);
                if (xhr.status === 200) {
                    setMenuItems(response.data); // call the state changer to rebuild the table
                } else {
                    alert(JSON.parse(xhr.responseText).err);
                }
                setControlPanelVisible(false); // hide the control panel
                setPanelItem(null); // nothing in the control panel
                setSelectedItem(null); // nothing selected
            }
        };
        xhr.open(method, url, true);
        xhr.send();
    }

    // child must send back the item (object) that was clicked
    function handleTableClick(item) {
        setSelectedItem(item);
    }

    function handleDeleteClick() {
        let url = BASE_DATA_URL + "/" + selectedItem.id; // selected item's ID
        let method = "DELETE";
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    handleLoadClick(); // "click" the Load button
                } else {
                    alert(JSON.parse(xhr.responseText).err);
                }
            }
        };
        xhr.open(method, url, true);
        xhr.send();
    }

    function handleAddClick() {
        setPanelItem({
            id: 0,
            category: "APP",
            description: "",
            price: 0,
            vegetarian: false,
        });
        setControlPanelVisible(true);
        setIsInsert(true);
    }

    function handleUpdateClick() {
        setPanelItem({ ...selectedItem }); // new copy of the object
        setControlPanelVisible(true);
        setIsInsert(false);
    }

    // handles both Add and Update
    function handleDoneClick() {
        let url = BASE_DATA_URL + "/" + panelItem.id; // panel item's ID (not selected item)
        let method = isInsert ? "POST" : "PUT"; // is this an Add or an Update?
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200 || xhr.status === 201) {
                    handleLoadClick(); // "click the Load button"
                } else if (xhr.status === 409) {
                    alert(JSON.parse(xhr.responseText).err);
                } else if (xhr.status === 404) {
                    alert("Error: ID must be between 100 - 999");
                }
            }
        };
        xhr.open(method, url, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify(panelItem));
    }

    function handleResetClick() {
        setSelectedItem(null);
        //setPanelItem(null);
        setPanelItem({
            id: 0,
            category: "APP",
            description: "",
            price: 0,
            vegetarian: false,
        });
    }

    function handleCancelClick() {
        setControlPanelVisible(false);
    }

    // child must send back two pieces of data - the name of the field and the new value
    function handleInputChange(fieldName, value) {
        let temp = { ...panelItem };
        switch (fieldName) {
            case "id":
                temp.id = +value;
                break;
            case "category":
                temp.category = value;
                break;
            case "description":
                temp.description = value;
                break;
            case "price":
                temp.price = +value;
                break;
            case "vegetarian":
                temp.vegetarian = value;
                break;
            default:
        }
        setPanelItem(temp);
    }

    return (
        <div className="container">
            <button
                className="btn btn-outline-success btn-lg float-end"
                onClick={handleLoadClick}
            >
                Load Menu from Source
            </button>

            <h1>Restaurant Menu</h1>

            <div className="row mt-3 mb-3">
                <ButtonPanel
                    addClickHandler={handleAddClick}
                    updateClickHandler={handleUpdateClick}
                    deleteClickHandler={handleDeleteClick}
                    selectedItem={selectedItem}
                />
            </div>
            <div
                className={
                    controlPanelVisible
                        ? "row p-3 mb-3 border border-primary-subtle"
                        : "row p-3 mb-3 border border-primary-subtle d-none"
                }
            >
                <AddUpdatePanel
                    selectedItem={selectedItem}
                    panelItem={panelItem}
                    inputChangeHandler={handleInputChange}
                    doneClickHandler={handleDoneClick}
                    resetClickHandler={handleResetClick}
                    cancelClickHandler={handleCancelClick}
                />
            </div>
            <div className="row">
                <MenuTable
                    menuItems={menuItems}
                    tableClickHandler={handleTableClick}
                    selectedItem={selectedItem}
                />
            </div>
        </div>
    );
}

export default App;
