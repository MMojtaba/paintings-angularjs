angular.module("PaintingsApp").controller("HomeCtrl", [
  "$scope",
  "$state",
  "$timeout",
  "PaintingsService",
  "AuthService",
  function ($scope, $state, $timeout, PaintingsService, AuthService) {
    $scope.state = {
      featured: null,
      paintings: []
    };

    async function init() {
      try {
        $scope.state.paintings = await PaintingsService.getAll();
        $scope.state.featured = await PaintingsService.getFeatured();
        console.log("featured", $scope.state.featured);
        $scope.$apply();
        console.log("they are", $scope.state.paintings?.length);
      } catch (err) {
        $scope.state.paintings = [];
        console.error("Error", err);
      }

      // getSingleImage();
    }
    init();

    // async function getSingleImage() {
    //   try {
    //     const res = await $http.get("/api/paintings/1", {
    //       responseType: "blob"
    //     });
    //     const blob = new Blob([res.data], { type: "image/png" });
    //     const single = URL.createObjectURL(blob);
    //     // const single = res.data;

    //     console.log("got image", single);
    //     $scope.state.single = single;
    //     $scope.$apply();
    //   } catch (err) {
    //     $scope.state.paintings = [];
    //     console.error("Error", err);
    //   }
    // }
  }
]);
