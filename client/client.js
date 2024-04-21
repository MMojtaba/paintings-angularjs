const app = angular.module("PaintingsApp", ["ui.router"]);

app.config(function ($stateProvider) {
  $stateProvider.state("Home", {
    url: "/home",
    template: "<h1>Welcome to home!</h1> <p> {{ message }}</p>",
    controller: "HomeCtrl"
  });

  $stateProvider.state("Browse", {
    url: "/browse",
    template: "<h1>Welcome to browse!</h1><p> {{ message }}</p>",
    controller: "BrowseCtrl"
  });
});
