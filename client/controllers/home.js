angular.module("PaintingsApp").controller("HomeCtrl", [
  "$scope",
  "$state",
  "$timeout",
  "ImageService",
  "AuthService",
  function ($scope, $state, $timeout, ImageService, AuthService) {
    $scope.state = {
      selectedImage: null,
      featured: [],
      images: []
    };

    async function init() {
      try {
        $scope.state.images = await ImageService.getAll();
        $scope.state.featured = await ImageService.getFeatured();
        $scope.state.selectedImage = $scope.state.featured?.at(0);
        $scope.$apply();
      } catch (err) {
        $scope.state.images = [];
        $scope.state.featured = [];
        $scope.state.selectedImage = null;
        console.error("Error getting images.", err);
      }
    }
    init();

    $scope.handleImageClick = function (image) {
      // Go to image preview if clicking the selected image
      if ($scope.state.selectedImage === image)
        $state.go("ImagePreview", { id: image.fileId });
      // Otherwise, set this as the selected image
      else $scope.state.selectedImage = image;
    };
  }
]);
