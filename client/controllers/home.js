angular.module("PaintingsApp").controller("HomeCtrl", [
  "$scope",
  "$state",
  "$timeout",
  "ImageService",
  "AuthService",
  function ($scope, $state, $timeout, ImageService, AuthService) {
    $scope.state = {
      featured: null,
      images: []
    };

    async function init() {
      try {
        $scope.state.images = await ImageService.getAll();
        $scope.state.featured = await ImageService.getFeatured();
        $scope.$apply();
      } catch (err) {
        $scope.state.images = [];
        console.error("Error", err);
      }
    }
    init();

    $scope.handleImageClick = function (image) {
      console.log("in handle click", image);
      $state.go("ImagePreview", { id: image.fileId });
    };
  }
]);
