angular.module("PaintingsApp").factory("PaintingsService", [
  "$resource",
  function ($resource) {
    //Get all paintings
    const Paintings = $resource("/api/paintings");
    this.getAll = function () {
      return Paintings.get().$promise;
    };

    return this;
  }
]);
