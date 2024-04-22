angular.module("PaintingsApp").controller("RegisterCtrl", [
  "$scope",
  function ($scope) {
    $scope.state = {
      username: "",
      password: "",
      passwordRe: ""
    };

    function verifyPassword() {
      return $scope.state.password === $scope.state.passwordRe;
    }

    $scope.register = async function () {
      console.log("registering");
      if (!verifyPassword()) {
        alert("Passwords do not match!");
        return;
      }
    };
  }
]);
