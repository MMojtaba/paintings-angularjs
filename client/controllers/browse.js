angular.module("PaintingsApp").controller("BrowseCtrl", [
  "$scope",
  function ($scope) {
    console.log("browse controller");
    $scope.message = "this is browse!";
  }
]);
