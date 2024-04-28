angular.module("PaintingsApp").factory("PaintingsService", [
  "$resource",
  function ($resource) {
    //Get all paintings
    const GetAll = $resource("/api/paintings");
    this.getAll = function () {
      return GetAll.get().$promise;
    };

    return this;
  }
]);
