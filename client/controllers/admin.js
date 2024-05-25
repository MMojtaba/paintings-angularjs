angular.module("PaintingsApp").controller("AdminCtrl", [
  "$scope",
  "$state",
  function ($scope, $state) {
    //
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
  },
]);
