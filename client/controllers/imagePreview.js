angular.module("PaintingsApp").controller("ImagePreviewCtrl", [
  "$scope",
  "$stateParams",
  "ImageService",
  "AuthService",
  function ($scope, $stateParams, ImageService, AuthService) {
    $scope.state = {
      image: null,
      editMode: true, //false
      isAdmin: false,
    };

    $scope.CONST = {
      CATEGORIES: ImageService.CATEGORIES,
      CATEGORY_LIST: ImageService.CATEGORY_LIST,
    };

    async function init() {
      const imageId = $stateParams.id;
      $scope.state.image = await ImageService.getOne(imageId);

      $scope.state.isAdmin = AuthService.isAdmin();

      $scope.$apply();
    }
    init();

    $scope.handleEditClick = function () {
      $scope.state.editMode = !$scope.state.editMode;
    };

    $scope.handleDeleteClick = function () {
      //TODO:
    };

    $scope.handleSaveClick = function () {
      //TODO:
    };
  },
]);
