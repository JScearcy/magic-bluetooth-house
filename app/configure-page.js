var createViewModel = require("./configure-view-model").createViewModel,
    instanceViewModel;

function onNavigatingTo(args) {
    var page = args.object;

    page.bindingContext = instanceViewModel = createViewModel(page.bindingContext);
    console.log(page.onBackPressed);
}

function onBackPressed(args) {
    console.log("backPressed");
    instanceViewModel.disconnectTap();
}

exports.onNavigatingTo = onNavigatingTo;
exports.onBackPressed = onBackPressed;