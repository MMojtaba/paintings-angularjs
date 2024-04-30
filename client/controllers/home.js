angular.module("PaintingsApp").controller("HomeCtrl", [
  "$scope",
  "$state",
  "$timeout",
  "PaintingsService",
  "AuthService",
  function ($scope, $state, $timeout, PaintingsService, AuthService) {
    $scope.state = { message: "Default message" };

    async function init() {
      try {
        const paintings = await PaintingsService.getAll();
        $timeout(function () {
          $scope.state.message = paintings.message;
        });
        // $scope.state.message = paintings.message;
      } catch (err) {
        console.error("Error", err);
        $scope.state.message = "not authenticated";
      }
    }
    init();

    $scope.logout = async function () {
      try {
        await AuthService.logout();
        $state.go("Login");
      } catch (err) {
        console.error("Erro logging out", err);
      }
    };
  }
]);
