angular.module("PaintingsApp").factory("AuthService", [
  "$resource",
  "$rootScope",
  function ($resource, $rootScope) {
    //Register user
    const Register = $resource("/api/register");
    this.register = function (username, password) {
      return Register.save({ username, password }).$promise;
    };

    //Login user
    const Login = $resource("/api/login");
    this.login = function (username, password) {
      return Login.save({ username, password }).$promise;
    };

    //Logout user
    const Logout = $resource("/api/logout");
    this.logout = function () {
      return Logout.save().$promise;
    };

    this.isAdmin = function () {
      if ($rootScope.user?.username) return true;
      return false;
    };

    return this;
  },
]);
