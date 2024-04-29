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
      AuthService.login($scope.state.username, $scope.state.password)
        .then(() => $state.go("Home"))
        .catch();

      console.log("tring to login");
    };
  }
]);
