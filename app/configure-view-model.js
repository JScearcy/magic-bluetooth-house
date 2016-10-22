var Observable = require("data/observable").Observable;
var application = require("application");
var frame = require("ui/frame");
var options = require("./loader-options").options;
var LoadingIndicator = require("nativescript-loading-indicator").LoadingIndicator;

function createViewModel(connection) {
    var bluetooth = connection.bluetooth,
        peripheral = connection.peripheral,
        viewModel = new Observable(),
        firstWritable = peripheral.services.filter(writablePeripheral)[0],
        writeToggle = true,
        loader = new LoadingIndicator();

    function write(val) {
        if (firstWritable) {
            // write value to bluetooth item, then read that same item
            bluetooth.write({
                peripheralUUID: peripheral.UUID,
                serviceUUID: firstWritable.UUID,
                characteristicUUID: firstWritable.characteristics[0].UUID,
                value: val
            }).then(function(result) {
                bluetooth.read({
                    peripheralUUID: peripheral.UUID,
                    serviceUUID: firstWritable.UUID,
                    characteristicUUID: firstWritable.characteristics[0].UUID
                }).then(function(result) {
                    var data = new Uint8Array(result.value);
                    console.log("written: ", data);  
                }).catch(function(err) {
                    console.log("read error: " + err);
                });
            }).catch(function(err) {
                console.log("err: ", err);
            });
        }
    }

    function whisper() {
        write('0x00');
    }

    function yell() {
        write('0x01');
    }

    function clear() {
        write('0x02');
    }

    function disconnectTap() {
        options.message = "Disconnecting...";
        loader.show(options);
        bluetooth.disconnect({
            UUID: peripheral.UUID
        }).then(function() {
            loader.hide();
            frame.topmost().navigate("main-page");
        }).catch(function(err) {
            console.log("err: ", err);
        });
    }

    function writablePeripheral(service) {
        return service.characteristics.filter((char) => char.properties.write).length > 0;
    }

    viewModel.set("whisper", whisper);
    viewModel.set("yell", yell);
    viewModel.set("clear", clear);
    viewModel.set("disconnectTap", disconnectTap);
    viewModel.set("title", peripheral.name);

    return viewModel;
}

exports.createViewModel = createViewModel;