angular.module("PaintingsApp").controller("LoginCtrl", [
  "$scope",
  "AuthService",
  "$state",
  function ($scope, AuthService, $state) {
    $scope.state = {
      username: "",
      passport: ""
    };

    $scope.login = function () {
      AuthService.login($scope.state.username, $scope.state.password);
      $state.go("Home");
      console.log("tring to login");
    };
  }
]);
