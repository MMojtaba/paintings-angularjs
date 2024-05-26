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

        $rootScope.$on("loggedIn", init);

        async function init() {
          try {
            const user = await AuthService.checkAuthenticated();

            $rootScope.user = {
              username: user.username,
            };
            scope.state.isAdmin = true;
          } catch (err) {
            if (err.status !== 401)
              console.error("Error checking authentication.");
            $rootScope.user = {};
            scope.state.isAdmin = false;
          }
        }
        init();

        scope.logout = async function () {
          try {
            await AuthService.logout();
            $rootScope.user = {};
            scope.state.isAdmin = false;
            $state.go("Home", {}, { reload: true });
          } catch (err) {
            console.error("Error logging out", err);
            alert("Failed to log out.");
          }
        };
      },
      // template: "directive template thing"
    };
  },
]);
