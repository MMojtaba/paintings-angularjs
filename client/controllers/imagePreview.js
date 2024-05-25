angular.module("PaintingsApp").controller("ImagePreviewCtrl", [
  "$scope",
  "$stateParams",
  "ImageService",
  "AuthService",
  function ($scope, $stateParams, ImageService, AuthService) {
    $scope.state = {
      image: null,
      editMode: true, //TODO: false
      isAdmin: false,
      // Image info
      title: "",
      category: "",
      isFeatued: false,
      descr: "",
    };

    $scope.CONST = {
      CATEGORY_LIST: ImageService.CATEGORY_LIST,
    };

    async function init() {
      const imageId = $stateParams.id;
      const image = await ImageService.getOne(imageId);
      $scope.state.image = image;
      $scope.state.title = image.title;
      $scope.state.descr = image.descr;
      $scope.state.category = image.category;
      $scope.state.isFeatured = image.isFeatured;

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

    $scope.handleSaveClick = async function () {
      //TODO:
      $scope.state.image.title = $scope.state.title;
      $scope.state.image.descr = $scope.state.descr;
      $scope.state.image.category = $scope.state.category;
      $scope.state.image.isFeatured = $scope.state.isFeatured;
      try {
        await ImageService.update($scope.state.image);
        alert("Successfully saved image!");
      } catch (err) {
        console.error("Error saving changes.", err);
        alert("Error saving changes.");
      }
    };
  },
]);
