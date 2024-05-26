angular.module("PaintingsApp").controller("AdminCtrl", [
  "$scope",
  "$state",
  "AuthService",
  function ($scope, $state, AuthService) {
    $scope.state = {
      currState: $state.current.name,
    };

    $scope.$watchCollection(
      function () {
        return $state.current.name;
      },
      function (newVal, oldVal) {
        $scope.state.currState = newVal;
      }
    );

    function init() {
      // If not authenticated, go to home page
      if (!AuthService.isAdmin()) $state.go("Home");
    }
    init();
  },
]);
