angular.module("PaintingsApp").factory("PaintingsService", [
  "$resource",
  function ($resource) {
    const Paintings = $resource("/api/paintings");

    //Get all paintings
    this.getAll = function () {
      return Paintings.get().$promise;
    };

    //Upload a painting
    this.upload = function (title, description, category, image) {
      return Paintings.save({ title, description, category, image }).$promise;
    };

    return this;
  }
]);
