const app = angular.module("PaintingsApp", ["ui.router", "ngResource"]);

app.config(function ($stateProvider, $urlRouterProvider) {
  $stateProvider.state("Login", {
    url: "/login",
    templateUrl: "templates/login.html",
    controller: "LoginCtrl"
  });

  $stateProvider.state("Register", {
    url: "/register",
    templateUrl: "templates/register.html",
    controller: "RegisterCtrl"
  });

  $stateProvider.state("Home", {
    url: "/home",
    templateUrl: "templates/home.html",
    controller: "HomeCtrl"
  });

  $stateProvider.state("Browse", {
    url: "/browse",
    templateUrl: "templates/browse.html",
    controller: "BrowseCtrl"
  });

  $stateProvider.state("Admin", {
    url: "/admin",
    templateUrl: "templates/admin.html",
    controller: "AdminCtrl"
  });

  $stateProvider.state("ImagePreview", {
    url: "/imagePreview",
    templateUrl: "templates/image-preview.html",
    controller: "ImagePreviewCtrl"
  });

  $urlRouterProvider.otherwise("/login");
});
