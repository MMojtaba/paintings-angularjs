angular.module("PaintingsApp").controller("ImageUploadCtrl", [
  "$scope",
  "ImageService",
  function ($scope, ImageService) {
    $scope.state = {
      image: null,
      title: "",
      descr: "",
      category: "",
      isFeatured: false
    };

    function init() {
      // Add event lister to image input
      const imageFileElement = document.getElementById("imageInput");
      if (imageFileElement) imageFileElement.onchange = handleImageSelect;
    }
    init();

    // Runs when an image is selected
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

      // Make sure it's an image
      if (!image.type.match("image.*")) {
        console.error("Invalid file selected, please only upload images.");
        alert("Only images are accepted.");
        return;
      }

      $scope.state.image = image;

      // Preview the selected imag
      try {
        const reader = new FileReader();
        reader.onload = function (event) {
          $scope.state.imagePreview = event.target.result;
          $scope.$apply();
        };
        reader.readAsDataURL(image);
      } catch (err) {
        console.error("Error reading image.", err);
        return;
      }
    }

    $scope.uploadImage = async function () {
      if (!$scope.state.image) {
        console.error("No image selected.");
        alert("Please select an image.");
        return;
      }

      try {
        await ImageService.upload(
          $scope.state.image,
          $scope.state.title,
          $scope.state.descr,
          $scope.state.category,
          $scope.state.isFeatured
        );
      } catch (err) {
        alert("Error uploading image");
        console.error("Error uploading image.", err);
      }
    };
  }
]);
