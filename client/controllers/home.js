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
      images: [],
      isLoading: true,
    };

    async function init() {
      ImageService.getAll()
        .then(function (res) {
          $scope.state.images = res;
          $scope.state.selectedImage = res?.at(0);
          $scope.state.isLoading = false;
          $scope.$apply();
        })
        .catch(function (err) {
          if (err.status !== 404)
            console.error("Error getting featured images.", err);
        });

      ImageService.getFeatured()
        .then(function (res) {
          $scope.state.featured = res;
          $scope.state.isLoading = false;
          $scope.$apply();
        })
        .catch(function (err) {
          if (err.status !== 404)
            console.error("Error getting featured images.", err);
        });
    }
    init();

    $scope.handleImageClick = function (image) {
      // Go to image preview if clicking the selected image
      if ($scope.state.selectedImage === image)
        $state.go("ImagePreview", { id: image.fileId });
      // Otherwise, set this as the selected image
      else $scope.state.selectedImage = image;
    };
  },
]);
