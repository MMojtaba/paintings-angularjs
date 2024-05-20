angular.module("PaintingsApp").factory("ImageService", [
  "$resource",
  function ($resource) {
    const ImageResource = $resource(
      "/api/images",
      {},
      {
        getAll: { method: "GET", isArray: true },
        getFeatured: { method: "GET", url: "/api/featured" },
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

    //Upload an image
    this.upload = function (image, title, descr, category, isFeatured) {
      const formData = new FormData();
      formData.append("file", image);
      formData.append("title", title);
      formData.append("descr", descr);
      formData.append("category", category);
      formData.append("isFeatured", category);

      return ImageResource.upload(formData).$promise;
    };

    //Get all paintings
    this.getAll = async function () {
      const images = await ImageResource.getAll().$promise;
      if (!images) return [];

      const parsedImages = images.map(parseImage);

      return parsedImages;
    };

    this.getFeatured = async function () {
      const image = await ImageResource.getFeatured().$promise;
      if (!image) {
        console.warn("No featured image found.");
        return null;
      }
      const parsedImage = parseImage(image);

      return parsedImage;
    };

    return this;
  }
]);
