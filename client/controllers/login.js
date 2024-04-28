angular.module("PaintingsApp").controller("LoginCtrl", [
  "$scope",
  "$state",
  "AuthService",
  function ($scope, $state, AuthService) {
    $scope.state = {
      username: "",
      password: ""
    };

    $scope.login = async function () {
      try {
        await AuthService.login($scope.state.username, $scope.state.password);
        $state.go("Home");
      } catch (err) {
        console.log("err", err);
        alert("Failed to login.");
      }
    };
  }
]);
