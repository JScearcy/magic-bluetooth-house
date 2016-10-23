var Observable = require("data/observable").Observable;
var http = require('http');
var options = require("./loader-options").options;
var LoadingIndicator = require("nativescript-loading-indicator").LoadingIndicator;

function createViewModel() {
    var viewModel = new Observable(),
        endPoint = "http://192.168.3.78:8080/rest/items",
        loader = new LoadingIndicator();

    refresh();

    function refresh() {
        options.message = "Loading...";
        loader.show(options);

        console.log("refreshing");
        http.request({ 
            url: endPoint, 
            method:'GET',
            headers: { "Accept": "application/json" } 
        })
            .then(
                refreshHandler, 
                refreshError
            )
            .catch(function (err) {
                console.log("err: ", err);
            });
    }

    function refreshHandler (data) {
        var items = JSON.parse(JSON.stringify(data.content));
        items = items.item.reduce((a, c) => {
            switch (c.name) {
                case "itm_Front_door":
                    a.itm_Front_door = c;
                    break;
                case "itm_Garage_door":
                    a.itm_Garage_door = c;

                    break;
                case "itm_Mailbox":
                    a.itm_Mailbox = c;
                    break;
                case "itm_Person":
                    a.itm_Person = c;
                    break;
            }

            return a;
        }, {});

        viewModel.set("frontDoorStatus", setStatus(items.itm_Front_door.state));
        viewModel.set("personStatus", setStatus(items.itm_Person.state, "Present", "Not Present"));
        viewModel.set("garageStatus", setStatus(items.itm_Garage_door.state, "Open", "Closed"));
        viewModel.set("mailboxStatus", setStatus(items.itm_Mailbox.state));
        loader.hide();
    }

    function refreshError (err) {
        console.log("Error: ", err);
        loader.hide();
    }

    function setStatus(val, customClosed, customOpen) {
        var closed = customClosed || "Closed",
            open = customOpen || "Open",
            status;
        if (val == 0 || val == "Uninitialized") {
            status = open;
        } else {
            status = closed;
        }
        return status;
    }

    viewModel.set("frontDoorStatus", "Closed");
    viewModel.set("windowStatus", "Closed");
    viewModel.set("garageStatus", "Closed");
    viewModel.set("refresh", refresh);
    return viewModel;
}

exports.createViewModel = createViewModel;