angular.module("PaintingsApp").factory("PaintingsService", [
  "$resource",
  function ($resource) {
    const Paintings = $resource(
      "/api/paintings",
      {},
      {
        getAll: { method: "GET", isArray: true },
        getFeatured: { method: "GET", url: "/api/featured" },
        getById: { url: "/api/paintings/1" },
        upload: {
          method: "POST",
          transformRequest: angular.identity,
          headers: {
            "Content-Type": undefined
          }
        }
      }
    );

    // Given an image's base64 data, it puts it in the correct format
    function parseImage(image) {
      return {
        filename: image.filename,
        url: `data:image/png;base64,${image.data}`
      };
    }

    //Upload a painting
    this.upload = function (image, title, descr, category, isFeatured) {
      const formData = new FormData();
      formData.append("file", image);
      formData.append("title", title);
      formData.append("descr", descr);
      formData.append("category", category);
      formData.append("isFeatured", category);

      // await $http.post("/api/paintings", formData, {
      //   transformRequest: angular.identity,
      //   headers: {
      //     "Content-Type": undefined
      //   }
      // });

      return Paintings.upload(formData).$promise;
    };

    //Get all paintings
    this.getAll = async function () {
      const paintings = await Paintings.getAll().$promise;
      if (!paintings) return [];

      const parsedImages = paintings.map(parseImage);

      return parsedImages;
    };

    this.getFeatured = async function () {
      console.log("in get featured");
      const painting = await Paintings.getFeatured().$promise;
      const parsedImage = parseImage(painting);
      console.log("got imagexx", parsedImage);

      return parsedImage;
    };

    //get single
    this.getById = function () {
      return Paintings.getById().$promise;
    };

    return this;
  }
]);
