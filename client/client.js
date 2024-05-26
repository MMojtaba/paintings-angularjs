// TODO: frontend auth
// TODO: image preview and edit page
// TODO: change password
// TODO: font
// TODO: search page
// TODO: make image preview not go beyond the screen height (make image smaller in that case)
// Display empty thing when loading images
// redirect  to home if non-logged in user goes to admin states
const app = angular.module("PaintingsApp", ["ui.router", "ngResource"]);

app.config(function ($stateProvider, $urlRouterProvider) {
  $stateProvider.state("Login", {
    url: "/login",
    templateUrl: "templates/login.html",
    controller: "LoginCtrl",
  });

  $stateProvider.state("Register", {
    url: "/register",
    templateUrl: "templates/register.html",
    controller: "RegisterCtrl",
  });

  $stateProvider.state("Home", {
    url: "/home",
    templateUrl: "templates/home.html",
    controller: "HomeCtrl",
  });

  $stateProvider.state("Browse", {
    url: "/browse",
    templateUrl: "templates/browse.html",
    controller: "BrowseCtrl",
  });

  $stateProvider.state("ImagePreview", {
    url: "/imagePreview/:id",
    templateUrl: "templates/image-preview.html",
    controller: "ImagePreviewCtrl",
  });

  $stateProvider.state("Admin", {
    abstract: true,
    url: "/admin",
    templateUrl: "templates/admin.html",
    controller: "AdminCtrl",
  });

  $stateProvider.state("Admin.ImageUpload", {
    url: "/image-upload",
    templateUrl: "templates/image-upload.html",
    controller: "ImageUploadCtrl",
  });

  $stateProvider.state("Admin.Register", {
    url: "/register",
    templateUrl: "templates/register.html",
    controller: "RegisterCtrl",
  });

  $urlRouterProvider.otherwise("/home");
});
