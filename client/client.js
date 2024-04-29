const app = angular.module("PaintingsApp", ["ui.router", "ngResource"]);

app.config(function ($stateProvider) {

  $stateProvider.state("Login", {
    url: "/login",
    templateUrl: "./templates/login.html",
    controller: "LoginCtrl"
  });

  $stateProvider.state("Register", {
    url: "/register",
    templateUrl: "./templates/register.html",
    controller: "RegisterCtrl"
  });

  $stateProvider.state("Home", {
    url: "/home",
    templateUrl: "./templates/home.html",
    controller: "HomeCtrl"
  });


  $stateProvider.state("Browse", {
    url: "/browse",
    template: "<h1>Welcome to browse!</h1><p> {{ message }}</p>",
    controller: "BrowseCtrl"
  });
});
