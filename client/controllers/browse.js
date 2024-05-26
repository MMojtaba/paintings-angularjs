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
      loadingMore: false,
    };

    const loadStep = 12; //how many images to load in each step
    let skip = 0; // how many images to skip (are already loaded)
    let firstLoad = true; // Initial loading (no images are loaded)

    $scope.CONST = {
      CATEGORY_LIST: ImageService.CATEGORY_LIST,
    };

    async function init() {
      await getImages();
    }
    init();

    $scope.handleImageClick = function (image) {
      $state.go("ImagePreview", { id: image.fileId });
    };

    $scope.clearFilters = function () {
      $scope.state.keyword = "";
      $scope.state.startDate = null;
      $scope.state.endDate = null;
      $scope.state.category = undefined;
      $scope.state.isFeatured = undefined;
      firstLoad = true;
      getImages();
    };

    async function getImages() {
      if (firstLoad) $scope.state.isLoading = true;
      try {
        // Default filters and sorting
        const query = {};
        query.limit = loadStep;
        query.skip = skip;
        query.sort = {
          createdAt: -1,
        };
        skip += loadStep;

        // User selected filters
        if ($scope.state.keyword) query.keyword = $scope.state.keyword;
        if ($scope.state.startDate) query.startDate = $scope.state.startDate;
        if ($scope.state.endDate) query.endDate = $scope.state.endDate;
        if ($scope.state.category) query.category = $scope.state.category;
        if ($scope.state.isFeatured !== undefined)
          query.isFeatured = $scope.state.isFeatured;

        const images = await ImageService.getAll(query);
        $scope.state.images.push(...images);
        $scope.state.notFound = false;
        $scope.state.isLoading = false;
        firstLoad = false;
        $scope.$apply();
      } catch (err) {
        $scope.state.isLoading = false;
        // If no images found on first load, show not found error
        if (err.status === 404 && firstLoad) {
          console.warn("No images found for the given filter.");
          $scope.state.notFound = true;
          alert("No images found.");
        } else if (err.status !== 404) {
          console.error("Error getting images", err);
          alert("Error getting images.");
        }
        $scope.$apply();
      }
    }

    $scope.handleSubmit = function () {
      firstLoad = true;
      getImages();
    };

    $scope.handleLoadMore = async function () {
      firstLoad = false;
      $scope.state.loadingMore = true;
      await getImages();
      $scope.state.loadingMore = false;
      $scope.$apply();
    };
  },
]);
