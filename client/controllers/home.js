angular.module("PaintingsApp").controller("HomeCtrl", [
  "$scope",
  function ($scope) {
    console.log("in home controller");
    $scope.message = "hello from controller of home";
  }
]);
