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

    let currImageIndex = 1;

    async function init() {
      const query = {
        limit: 4,
        sort: {
          createdAt: -1,
        },
      };
      ImageService.getAll(query)
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

      ImageService.getFeatured(query)
        .then(function (res) {
          $scope.state.featured = res;
          $scope.state.isLoading = false;
          $scope.$apply();
        })
        .catch(function (err) {
          if (err.status !== 404)
            console.error("Error getting featured images.", err);
        });

      // Run the change image function periodically
      const changeImageIntervalid = setInterval(changeImage, 5000);
    }
    init();

    // Changes the image and animates it
    async function animateAndChangeImage(image) {
      const mainImageElement = document.getElementById("home-main-image");
      if (mainImageElement) {
        mainImageElement.style.filter = "brightness(0.7)";
        await $timeout(() => {}, 250);
        $scope.state.selectedImage = image;
        await $timeout(() => {}, 250);
        mainImageElement.style.filter = "brightness(1)";
      }
    }

    // Changes the main image
    function changeImage() {
      // use the featured images if they exist
      if ($scope.state.featured?.length) {
        const length = $scope.state.featured.length;
        animateAndChangeImage($scope.state.featured[currImageIndex % length]);
        currImageIndex++;
      } else if ($scope.state.images?.length) {
        const length = $scope.state.images.length;
        animateAndChangeImage($scope.state.images[currImageIndex % length]);
        currImageIndex++;
      }
    }

    $scope.handleImageClick = function (image) {
      // Go to image preview if clicking the selected image
      if ($scope.state.selectedImage === image) {
        $state.go("ImagePreview", { id: image.fileId });
      } else {
        // Otherwise, set this as the selected image
        animateAndChangeImage(image);
      }
    };
  },
]);
