angular.module("PaintingsApp").controller("HomeCtrl", [
  "$scope",
  "PaintingsService",
  "AuthService",
  "$state",
  function ($scope, PaintingsService, AuthService, $state) {
    $scope.state = {
      message: "Default"
    };

    function init() {
      PaintingsService.getAll()
        .then((res) => {
          $scope.state.message = res.message;
        })
        .catch((err) => {
          $scope.state.message = "Not authenticated.";
          console.error("Error", err);
        });
    }
    init();

    $scope.logout = function () {
      AuthService.logout()
        .then(() => {
          console.log("loggecd out");
          $state.go("Login");
        })
        .catch(() => {
          console.error("failed to logout");
        });
    };
  }
]);
