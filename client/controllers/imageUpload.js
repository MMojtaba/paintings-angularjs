angular.module("PaintingsApp").controller("ImageUploadCtrl", [
  "$scope",
  "PaintingsService",
  function ($scope, PaintingsService) {
    $scope.state = {
      title: "",
      description: "",
      category: "",
      image: null
    };

    function init() {
      const imageFileElement = document.getElementById("imageFile");
      if (imageFileElement) imageFileElement.onchange = handleImageSelect;
    }
    init();

    function handleImageSelect(event) {
      const images = event.target.files;
      if (!images?.length) {
        console.error("No images selected.");
        return;
      }

      if (images.length > 1)
        console.warn(
          "Multiple images selected, only the first one will be used."
        );
      const image = images[0];

      if (!image.type.match("image.*")) {
        console.error("Invalid file selected, please only upload images.");
        alert("Only images are accepted.");
        return;
      }

      try {
        const reader = new FileReader();
        reader.onload = function (event) {
          $scope.state.image = event.target.result;
          $scope.$apply();
        };
        reader.readAsDataURL(image);
      } catch (error) {
        console.error("Error reading image.", error);
        return;
      }
    }

    $scope.uploadImage = async function () {
      if (!$scope.state.image) {
        console.error("No image selected.");
        alert("Please upload an image.");
        return;
      }

      try {
        await PaintingsService.upload(
          $scope.state.title,
          $scope.state.description,
          $scope.state.category,
          $scope.state.image
        );
      } catch (error) {
        alert("Error uploading painting");
        console.error("Error uploading painting.", error);
      }
    };
  }
]);
