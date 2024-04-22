angular.module("PaintingsApp").controller("LoginCtrl", [
  "$scope",
  function ($scope) {
    $scope.state = {
      username: "",
      password: ""
    };

    $scope.login = async function () {
      console.log("logging in");
    };
  }
]);
