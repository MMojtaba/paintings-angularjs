angular.module("PaintingsApp").directive("navBar", [
  "$state",
  "$rootScope",
  "AuthService",
  function ($state, $rootScope, AuthService) {
    return {
      restrict: "E",
      scope: {},
      templateUrl: "components/navBar/nav-bar.html",
      link: function (scope) {
        scope.state = {
          isAdmin: false,
        };

        async function init() {
          // TODO: request to backend to get user
          $rootScope.user = {
            username: "test",
          };
          scope.state.isAdmin = true;
        }
        init();

        scope.logout = async function () {
          try {
            await AuthService.logout();
            $state.go("Login");
          } catch (err) {
            console.error("Erro logging out", err);
          }
        };
      },
      // template: "directive template thing"
    };
  },
]);
