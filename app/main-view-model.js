var Observable = require("data/observable").Observable;
var bluetooth = require("nativescript-bluetooth");
var application = require("application");

function createViewModel() {
    var viewModel = new Observable(),
        bluetoothPeripherals = [];

    bluetooth.isBluetoothEnabled().then(
        function(enabled) {
            console.log("Enabled? " + enabled);
        }
    );

    function scan() {
        bluetoothPeripherals = [];
        bluetooth.hasCoarseLocationPermission().then(
            function(granted) {
                bluetooth.startScanning({
                    serviceUUIDs: [],
                    seconds: 4,
                    onDiscovered: function (peripheral) {
                        bluetoothPeripherals.push(peripheral);
                    }
                    }).then(function() {
                        viewModel.set("peripherals", bluetoothPeripherals);
                    }, function (err) {
                        console.log("error while scanning: " + err);
                });
            }
        );
    }

    function connectToPeripheral(uuid) {
        bluetooth.connect({
            UUID: uuid,
            onConnected: function (peripheral) {
                console.log("Periperhal connected with UUID: " + peripheral.UUID);

                // the peripheral object now has a list of available services:
                peripheral.services.forEach(function(service) {
                    console.log("service found: " + JSON.stringify(service));
                    console.log("-----------------------------");
                });
            },
            onDisconnected: function (peripheral) {
                console.log("Periperhal disconnected with UUID: " + peripheral.UUID);
            }
        });
    }

    viewModel.connect = connectToPeripheral;
    viewModel.scan = scan;
    viewModel.set("title", "Bluetooth Devices");

    return viewModel;
}

exports.createViewModel = createViewModel;