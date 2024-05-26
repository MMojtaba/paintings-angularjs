angular.module("PaintingsApp").controller("LoginCtrl", [
  "$scope",
  "$state",
  "$rootScope",
  "AuthService",
  function ($scope, $state, $rootScope, AuthService) {
    $scope.state = {
      username: "",
      password: "",
    };

    $scope.login = async function () {
      try {
        await AuthService.login($scope.state.username, $scope.state.password);

        $rootScope.$broadcast("loggedIn");

        $state.go("Home", {}, { reload: true });
      } catch (err) {
        console.error("Error logging in", err);
        alert("Failed to login.");
      }
    };
  },
]);
