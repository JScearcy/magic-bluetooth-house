var createViewModel = require("./main-view-model").createViewModel,
    instanceViewModel;

function onNavigatingTo(args) {
    var page = args.object;
    page.bindingContext = instanceViewModel = createViewModel();
}
exports.onNavigatingTo = onNavigatingTo;

exports.bluetoothTap = function(args) {
    var item = args.object;
    instanceViewModel.connect(item.id);
}