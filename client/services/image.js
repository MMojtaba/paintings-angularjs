angular.module("PaintingsApp").factory("ImageService", [
  "$resource",
  function ($resource) {
    const ImageResource = $resource(
      "/api/images",
      {},
      {
        getAll: { method: "GET", isArray: true },
        getOne: { method: "GET", url: "/api/images/:id" },
        update: { method: "PUT", url: "/api/images" },
        upload: {
          method: "POST",
          transformRequest: angular.identity,
          headers: {
            "Content-Type": undefined,
          },
        },
      }
    );

    async function genericGetAll(query = {}) {
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
      formData.append("isFeatured", isFeatured);

      return ImageResource.upload(formData).$promise;
    };

    // Get all paintings
    this.getAll = function (query = {}) {
      return genericGetAll(query);
    };

    // Get featured paintings
    this.getFeatured = async function () {
      return genericGetAll({ isFeatured: true });
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

    // Update an image (title, descr, etc. not the picture itself)
    this.update = function (image) {
      const imageMeta = angular.copy(image);
      delete imageMeta.content;
      return ImageResource.update(imageMeta);
    };

    this.delete = async function (fileId) {
      return ImageResource.delete({ fileId: fileId });
    };

    this.CATEGORIES = {
      OTHER: "Other",
      LANDSCAPE: "Landscape",
      SEA: "Sea",
      SKY: "Sky",
      JUNGLE: "Jungle",
    };

    this.CATEGORY_LIST = Object.values(this.CATEGORIES);

    return this;
  },
]);
