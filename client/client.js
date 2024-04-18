const app = angular.module("PaintingsApp", ["ui.router"]);

app.config(function ($stateProvider) {
  $stateProvider.state("Home", {
    url: "/home",
    template: "<h1>Welcome to home!</h1>"
  });

  $stateProvider.state("Browse", {
    url: "/browse",
    template: "<h1>Welcome to browse!</h1>"
  });
});
