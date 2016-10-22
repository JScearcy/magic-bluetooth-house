var createViewModel = require("./main-view-model").createViewModel,
    instanceViewModel;

function onNavigatingTo(args) {
    var page = args.object;
    page.bindingContext = instanceViewModel = createViewModel();
}
exports.onNavigatingTo = onNavigatingTo;