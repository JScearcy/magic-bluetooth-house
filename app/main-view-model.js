var Observable = require("data/observable").Observable;
var application = require("application");
var frame = require("ui/frame");

function createViewModel() {
    viewModel = new Observable();
    function connect() {
        frame.topmost().navigate("connect-page");
    }

    function viewHome() {
        frame.topmost().navigate("my-home-page");
    }

    viewModel.set("connect", connect);
    viewModel.set("viewHome", viewHome);
    return viewModel;
}

exports.createViewModel = createViewModel;