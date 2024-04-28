angular.module("PaintingsApp").controller("HomeCtrl", [
  "$scope",
  "$state",
  "PaintingsService",
  "AuthService",
  function ($scope, $state, PaintingsService, AuthService) {
    $scope.message = "Default message";

    function init() {
      PaintingsService.getAll()
        .then((res) => {
          $scope.message = res.message;
        })
        .catch((err) => {
          console.log("Error", err);
          $scope.message = "not authenticated";
        });
    }
    init();

    $scope.logout = function () {
      AuthService.logout().then(() => $state.go("Login"));
    };
  }
]);
