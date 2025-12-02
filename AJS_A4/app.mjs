import express from "express";
import cors from "cors";

//adding
import path from "path";
import { fileURLToPath } from "url";
import * as constants from "./utils/constants.mjs";
import { MenuItem } from "./entity/menu-item.mjs";
import * as menuItemAccessor from "./db/menu-item-accessor.mjs";

// set absolute paths to this file and the directory where it is stored
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



// The menuItemAccessor is passed in from "server.mjs"
export function buildApp({ menuItemAccessor }) {
    const app = express();

    // enable cors
    app.use(cors());

    /// START YOUR CODE HERE
    // app.use(express.static(path.join(__dirname, constants.STATIC_FOLDER)));
    app.use(express.static(path.join(__dirname, constants.PUBLIC_FOLDER)));
    app.use(express.json());

    // Route handlers:

    //GET
    // returns all menu items:
    // 200 for success or 500 for server error
    app.get("/menuitems", async function (req, res) {
        try {
            let items = await menuItemAccessor.getAllItems();
            res.status(200).json({ err: null, data: items });
        } catch (err) {
            res.status(500).json({ err: "Internal Server Error: " + err.message, data: null });
        }
    });



    //POST
    // creates a new menu item
    app.post("/menuitems/:id", async function (req, res) {
        // attempt to create menuitem with provided values
        // if values are invalid, return 400 error before actually attempting to call the accessor
        let newItem;
        try {
            let obj = req.body;
            newItem = new MenuItem(obj.id, obj.category, obj.description, obj.price, obj.vegetarian);
        } catch (err) {
            // 400 for invalid input values
            return res.status(400).json({ err: err.message, data: null }); 
        }

        // if values are good, then try to actually add the item:
        try {
            let ok = await menuItemAccessor.addItem(newItem);
            if (ok) {
                // 201 if successfully created
                res.status(201).json({ err: null, data: true });
            } else {
                // 409 item already exists
                res.status(409).json({ err: `item ${newItem.id} already exists`, data: null });
            }
        } catch (err) {
            // 500 for server error
            res.status(500).json({ err: "Internal Server Error: " + err.message, data: null });
        }
    });





// PUT
// update an existing menu item
app.put("/menuitems/:id", async function (req, res) {
     // attempt to update the menuitem with provided values
     // if values are invalid, return 400 error before actually attempting to call the accessor
    let updatedItem;
    try {
        let obj = req.body;
        updatedItem = new MenuItem(obj.id, obj.category, obj.description, obj.price, obj.vegetarian);
    } catch (err) {
        return res.status(400).json({ err: err.message, data: null }); 
    }

    // if values are good then we can try to actually perform the updte
    try {
        let ok = await menuItemAccessor.updateItem(updatedItem);
        if (ok) {
            // 200 = success
            res.status(200).json({ err: null, data: true });
        } else {
            // 404 item does not exist
            res.status(404).json({ err: `item ${updatedItem.id} does not exist`, data: null });
        }
    } catch (err) {
        // 500 server error
        res.status(500).json({ err: "Internal Server Error: " + err.message, data: null });
    }
});




// DELETE
app.delete("/menuitems/:id", async function (req, res, next) {
    let id = Number(req.params.id);

    //validate for 3 digit ID
    if (id < 100 || id > 999) {
        // 404 if ID is not valid
        return res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
    }

    // dummy menu item because the accessor delete method requires an object. 
    // using the actual ID to match, but the other fields don't matter
    let menuObj = new MenuItem(id, "XXX", "dummy", 1, false); 

    try {
        // attempt to delete the menuItem 
        let ok = await menuItemAccessor.deleteItem(menuObj);
        if (ok) {
            // success
            res.status(200).json({ err: null, data: true });
        } else {
            // item not found
            res.status(404).json({ err: `item ${id} does not exist`, data: null });
        }
    } catch (err) {
        // server error
        res.status(500).json({ err: "Internal Server Error: " + err.message, data: null });
    }
});



/* Bad Endpoints */
// handlers for unsupported operations:


// can't get a single menu item
app.get("/menuitems/:id", function (req, res) {
    let obj = { err: "Single GETs not supported", data: null };
    res.status(405).json(obj);
});

// can't do bulk posts
app.post("/menuitems", function (req, res) {
    let obj = { err: "Bulk POSTs not supported", data: null };
    res.status(405).json(obj);
});

// can't do bulk puts
app.put("/menuitems", function (req, res) {
    let obj = { err: "Bulk PUTs not supported", data: null };
    res.status(405).json(obj);
});

// can't do bulk deletes
app.delete("/menuitems", function (req, res) {
    let obj = { err: "Bulk DELETEs not supported", data: null };
    res.status(405).json(obj);
});



// Catch all middleware: **************

// custom 404 page for failed static file requests
app.use(function (req, res) {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});


// start the server:
const server = app.listen(constants.PORT, function () {
    console.log(`Example app listening on port ${constants.PORT}!`);
});


// graceful shutdown:
function shutdown(signal) {
    console.log(`\nReceived ${signal} — shutting down...`);
    server.close(async function () {
        // close Mongo connection
        try {
            await ConnectionManager.closeConnection();
            process.exit(0);
        } catch (err) {
            console.error("Error closing Mongo:", err);
            process.exit(1);
        }
    });
}

// Ctrl+C sends SIGINT
process.once("SIGINT", function () {
    shutdown("SIGINT (Ctrl+C)");
});

// Container managers (e.g., Docker) might send SIGTERM
process.once("SIGTERM", function () {
    shutdown("SIGTERM");
});


    return app; // make sure this is the last line
}
