angular.module("PaintingsApp").controller("RegisterCtrl", [
    "$scope",
    "AuthService",
    function ($scope, AuthService) {
      $scope.state = {
        username: '',
        password: '',
        passwordRe: ''
      }

      function verifyPassword() {
        return $scope.state.password === $scope.state.passwordRe;
      }

      $scope.register = function() {
        if(!verifyPassword()) {
          alert("Password do not match!")
          return;
        }

        console.log('registering');
        AuthService.register($scope.state.username, $scope.state.password);

      }
    }
  ]);
  