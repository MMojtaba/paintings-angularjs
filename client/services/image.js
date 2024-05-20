angular.module("PaintingsApp").factory("ImageService", [
  "$resource",
  function ($resource) {
    const ImageResource = $resource(
      "/api/images",
      {},
      {
        getAll: { method: "GET", isArray: true },
        getOne: { method: "GET", url: "/api/images/:id" },
        upload: {
          method: "POST",
          transformRequest: angular.identity,
          headers: {
            "Content-Type": undefined
          }
        }
      }
    );

    async function genericGetAll(query) {
      const images = await ImageResource.getAll(query).$promise;
      if (!images) return [];

      return images;
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

    // Get all paintings
    this.getAll = function () {
      return genericGetAll();
    };

    // Get featured paintings
    this.getFeatured = async function () {
      return genericGetAll({ featured: true });
    };

    // Get a painting by its fileId
    this.getOne = async function (fileId) {
      const image = await ImageResource.getOne({ id: fileId }).$promise;
      if (!image) {
        console.error("Image not found.");
        return null;
      }

      return image;
    };

    return this;
  }
]);
