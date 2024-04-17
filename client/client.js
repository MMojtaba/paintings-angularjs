const app = angular.module("PaintingsApp", ["ui.router"]);

app.config(function ($stateProvider) {
  $stateProvider.state("Home", {
    url: "/home",
    template: "<h1>Your home page!</h1>",
    controller: "HomeCtrl"
  });

  $stateProvider.state("Browse", {
    url: "/browse",
    template: "<h1>Browser away!!</h1>",
    controller: "BrowseCtrl"
  });
});
