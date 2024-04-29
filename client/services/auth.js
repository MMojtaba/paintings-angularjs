angular.module("PaintingsApp").factory("AuthService", [
  "$resource",
  function ($resource) {
    //register
    const Register = $resource("/api/register");
    this.register = function (username, password) {
      return Register.save({ username, password }).$promise;
    };

    //login
    const Login = $resource("/api/login");
    this.login = function (username, password) {
      return Login.save({ username, password }).$promise;
    };

    //logout
    const Logout = $resource("/api/logout");
    this.logout = function () {
      return Logout.save().$promise;
    };

    return this;
  }
]);
