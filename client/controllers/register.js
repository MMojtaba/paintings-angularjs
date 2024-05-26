angular.module("PaintingsApp").controller("RegisterCtrl", [
  "$scope",
  "$state",
  "AuthService",
  function ($scope, $state, AuthService) {
    $scope.state = {
      username: "",
      password: "",
      passwordRe: "",
    };

    //Verify that the passwords match
    function verifyPassword() {
      return $scope.state.password === $scope.state.passwordRe;
    }

    $scope.register = async function () {
      //Ensure passwords match
      if (!verifyPassword()) {
        alert("Passwords do not match!");
        return;
      }

      try {
        //Send registration request
        await AuthService.register(
          $scope.state.username,
          $scope.state.password
        );
        alert("Successfully registered!");
        $state.go("Login");
      } catch (err) {
        alert("Error registering.");
      }
    };
  },
]);
