var createViewModel = require("./my-home-view-model").createViewModel,
    instanceViewModel;

function onNavigatingTo(args) {
    var page = args.object;
    page.bindingContext = createViewModel();
}

exports.onNavigatingTo = onNavigatingTo;