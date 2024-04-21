angular.module("PaintingsApp").controller("BrowseCtrl", [
  "$scope",
  function ($scope) {
    console.log("in browse controller");
    $scope.message = "browse my paintings";
  }
]);
