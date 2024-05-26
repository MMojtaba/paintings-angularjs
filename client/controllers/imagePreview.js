angular.module("PaintingsApp").controller("ImagePreviewCtrl", [
  "$scope",
  "$state",
  "$stateParams",
  "ImageService",
  "AuthService",
  function ($scope, $state, $stateParams, ImageService, AuthService) {
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
      try {
        const image = await ImageService.getOne(imageId);
        $scope.state.image = image;
        $scope.state.title = image.title;
        $scope.state.descr = image.descr;
        $scope.state.category = image.category;
        $scope.state.isFeatured = image.isFeatured;
      } catch (err) {
        console.error("Image not found.", err);
        alert("Image not found.");
        $state.go("Home");
      }

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

    $scope.handleDeleteClick = async function () {
      try {
        await ImageService.delete($scope.state.image.fileId);
        alert("Deleted image!");
        $state.go("Home");
      } catch (err) {
        console.error("Error deleting image.", err);
        alert("Error deleting image.");
      }
    };
  },
]);
