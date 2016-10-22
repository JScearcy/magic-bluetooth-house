var Observable = require("data/observable").Observable;
var bluetooth = require("nativescript-bluetooth");
var LoadingIndicator = require("nativescript-loading-indicator").LoadingIndicator;
var application = require("application");
var frame = require("ui/frame");
var options = require("./loader-options").options;

function createViewModel() {
    var validAdvertisements = 
        [ "AgEGDwlFcmljIEtleWNoYWluNQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA="
        ],
        viewModel = new Observable(),
        bluetoothDevices = [],
        loader = new LoadingIndicator(),
        scanning = true;

    bluetooth.isBluetoothEnabled().then(
        function(enabled) {
            console.log("Enabled? " + enabled);
        }
    );
    checkConnectionsAndDisconnect().then(startScanning);

    function scan() {
         checkConnectionsAndDisconnect().then(startScanning);
    }
    // connect to a given item by uuid and then navigate to a page to control actions
    function connectToPeripheral(uuid) {
        options.message = "Connecting...";
        loader.show(options);
        bluetooth.connect({
            UUID: uuid,
            onConnected: function (peripheral) {
                console.log("Periperhal connected with UUID: " + peripheral.UUID);
                loader.hide();
                frame.topmost().navigate({
                    moduleName: "configure-page",
                    bindingContext: { bluetooth: bluetooth, peripheral: peripheral }
                });
            },
            onDisconnected: function (peripheral) {
                console.log("Periperhal disconnected with UUID: " + peripheral.UUID);
                frame.topmost().navigate({
                    moduleName: "main-page"
                });
            }
        });
    }
    // check the bluetooth connections for anything connected and disconnect them.
    function checkConnectionsAndDisconnect() {
        return new Promise(function (resolve, reject) {
            for (var key in bluetooth._connections) {
                var connection = bluetooth._connections[key];
                if (connection && connection.state == 'connecting') {
                    disconnect(key);
                } 
            }
            resolve();
        });
    }
    // start scanning for devices, then display found items that are in the validAdvertisement array.
    function startScanning() {
        options.message = "Scanning...";
        bluetoothDevices = [];
        viewModel.set("peripherals", []);
        viewModel.set("scanning", true);
        bluetooth.hasCoarseLocationPermission().then(
            function(granted) {
                loader.show(options);
                bluetooth.startScanning({
                    serviceUUIDs: [],
                    seconds: 2.5,
                    onDiscovered: function (peripheral) {
                        bluetoothDevices.push(peripheral);
                    }
                    }).then(function() {
                        var namedPeripherals = bluetoothDevices.filter((per) => validAdvertisements.includes(per.advertisement));
                        viewModel.set("peripherals", namedPeripherals);
                        loader.hide();
                        viewModel.set("scanning", false);
                    }, function (err) {
                        console.log("error while scanning: " + err);
                });
            }
        );
    }
    // take a uuid and disconnect from that device
    function disconnect(uuid) {
        bluetooth.disconnect({
            UUID: uuid
        }).then(function() {
            console.log('disconnected already connected device');
        });
    }

    viewModel.connect = connectToPeripheral;
    viewModel.set("scan", scan);
    viewModel.set("title", "Bluetooth Devices");

    return viewModel;
}

exports.createViewModel = createViewModel;