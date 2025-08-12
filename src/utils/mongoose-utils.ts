type BasicDocument = {
  processograms: {
    _id: string;
    identifier: string;
    raster_images_dark?: { [key: string]: { src: string } };
    raster_images_light?: { [key: string]: { src: string } };
  }[];
};

export const getItemWithProcessogramUrls = <T extends BasicDocument>(
  items: T[]
): (Omit<T, "processograms"> & {
  processograms: {
    _id: string;
    identifier: string;
    url_dark: string | undefined;
    url_light: string | undefined;
  }[];
})[] => {
  const itemsWithUrl = items.map((item) => {
    const processogramsWithUrls = item.processograms?.map((processogram) => {
      const url_dark =
        processogram.raster_images_dark?.[processogram.identifier]?.src;
      const url_light =
        processogram.raster_images_light?.[processogram.identifier]?.src;

      return {
        _id: processogram._id,
        identifier: processogram.identifier,
        url_dark,
        url_light,
      };
    });

    return {
      ...item,
      processograms: processogramsWithUrls,
    };
  });

  return itemsWithUrl;
};
