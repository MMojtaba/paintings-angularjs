angular.module("PaintingsApp").controller("ImagePreviewCtrl", [
  "$scope",
  "$stateParams",
  "ImageService",
  function ($scope, $stateParams, ImageService) {
    $scope.state = {
      image: null
    };

    async function init() {
      const imageId = $stateParams.id;
      $scope.state.image = await ImageService.getOne(imageId);
      $scope.$apply();
    }
    init();
  }
]);
