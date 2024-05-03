angular.module("PaintingsApp").directive("navBar", [
  "$state",
  "AuthService",
  function (AuthService, $state) {
    return {
      restrict: "E",
      scope: {},
      templateUrl: "components/navBar/nav-bar.html",
      link: function (scope) {
        console.log("in directive");

        scope.logout = async function () {
          try {
            await AuthService.logout();
            $state.go("Login");
          } catch (err) {
            console.error("Erro logging out", err);
          }
        };
      }
      // template: "directive template thing"
    };
  }
]);
