angular.module("PaintingsApp").controller("BrowseCtrl", [
  "$scope",
  "$state",
  "ImageService",
  function ($scope, $state, ImageService) {
    $scope.state = {
      images: [],
      keyword: "",
      startDate: null,
      endDate: null,
      category: undefined,
      isFeatured: undefined,
      notFound: false,
      isLoading: true,
    };

    $scope.CONST = {
      CATEGORY_LIST: ImageService.CATEGORY_LIST,
    };

    async function init() {
      await getImages();
    }
    init();

    // TODO: handleImageClick in a utils file?
    $scope.handleImageClick = function (image) {
      $state.go("ImagePreview", { id: image.fileId });
    };

    $scope.clearFilters = function () {
      $scope.state.keyword = "";
      $scope.state.startDate = null;
      $scope.state.endDate = null;
      $scope.state.category = undefined;
      $scope.state.isFeatured = undefined;
      getImages();
    };

    async function getImages() {
      $scope.state.isLoading = true;
      try {
        const query = {};
        query.limit = 10;
        if ($scope.state.keyword) query.keyword = $scope.state.keyword;
        if ($scope.state.startDate) query.startDate = $scope.state.startDate;
        if ($scope.state.endDate) query.endDate = $scope.state.endDate;
        if ($scope.state.category) query.category = $scope.state.category;
        if ($scope.state.isFeatured !== undefined)
          query.isFeatured = $scope.state.isFeatured;
        $scope.state.images = await ImageService.getAll(query);
        $scope.state.notFound = false;
        $scope.state.isLoading = false;

        $scope.$apply();
      } catch (err) {
        $scope.state.isLoading = false;

        $scope.state.images = [];
        if (err.status === 404) {
          console.warn("No images found for the given filter.");
          $scope.state.notFound = true;
          alert("No images found.");
        } else {
          console.error("Error getting images", err);
          alert("Error getting images.");
        }
        $scope.$apply();
      }
    }

    $scope.handleSubmit = function () {
      getImages();
    };
  },
]);
