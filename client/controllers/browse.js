angular.module("PaintingsApp").controller("BrowseCtrl", [
  "$scope",
  "ImageService",
  function ($scope, ImageService) {
    $scope.state = {
      images: [],
      notFound: false,
    };

    async function init() {
      try {
        $scope.state.images = await ImageService.getAll();
        $scope.$apply();
      } catch (err) {
        $scope.state.images = [];
        if (err.status === 404) {
          console.warn("No images found for the given filter.");
          $scope.state.notFound = true;
        }
        if (err.status !== 404) console.error("Error getting images", err);
      }
    }
    init();
  },
]);
