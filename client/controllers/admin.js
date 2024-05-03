angular.module("PaintingsApp").controller("AdminCtrl", [
  "$scope",
  function ($scope) {
    $scope.state = {
      title: "",
      description: "",
      imageFile: null
    };

    function init() {}
    init();

    $scope.uploadImage = async function () {
      console.log("uploading image");
    };
  }
]);
