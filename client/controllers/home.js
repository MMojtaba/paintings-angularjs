angular.module("PaintingsApp").controller("HomeCtrl", [
  "$scope",
  function ($scope) {
    console.log("home controller");
    $scope.message = "this is home!";
  }
]);
