const webpack = require("webpack");
const path = require("path");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

const config = {
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  //plugins: [new BundleAnalyzerPlugin()],
  optimization: {
    minimize: true,
  },
};

// Elementor Elements
const elementStatsCollectionConfig = Object.assign({}, config, {
  entry: {
    frontend: "./frontend/src/collection-stats-element",
  },
  output: {
    path: path.join(__dirname),
    filename: "[name]/assets/js/collection-stats-element.bundle.js",
  },
});

const frontSingleConfig = Object.assign({}, config, {
  entry: {
    frontend: "./frontend/src/single",
  },
  output: {
    path: path.join(__dirname),
    filename: "[name]/assets/js/single.bundle.js",
  },
});

const frontProfileEditConfig = Object.assign({}, config, {
  entry: {
    frontend: "./frontend/src/edit-profile",
  },
  output: {
    path: path.join(__dirname),
    filename: "[name]/assets/js/edit-profile.bundle.js",
  },
});

const frontProfilConfig = Object.assign({}, config, {
  entry: {
    frontend: "./frontend/src/profile",
  },
  output: {
    path: path.join(__dirname),
    filename: "[name]/assets/js/profile.bundle.js",
  },
});

const frontCollectionConfig = Object.assign({}, config, {
  entry: {
    frontend: "./frontend/src/collection",
  },
  output: {
    path: path.join(__dirname),
    filename: "[name]/assets/js/collection.bundle.js",
  },
});

const frontSingleCategoryConfig = Object.assign({}, config, {
  entry: {
    frontend: "./frontend/src/single-category",
  },
  output: {
    path: path.join(__dirname),
    filename: "[name]/assets/js/single-category.bundle.js",
  },
});

const frontCreateCollectionConfig = Object.assign({}, config, {
  entry: {
    frontend: "./frontend/src/create-collection",
  },
  output: {
    path: path.join(__dirname),
    filename: "[name]/assets/js/create-collection.bundle.js",
  },
});

const frontPublicProfilConfig = Object.assign({}, config, {
  entry: {
    frontend: "./frontend/src/public-profile",
  },
  output: {
    path: path.join(__dirname),
    filename: "[name]/assets/js/public-profile.bundle.js",
  },
});

const frontAllcollectionConfig = Object.assign({}, config, {
  entry: {
    frontend: "./frontend/src/allcollection",
  },
  output: {
    path: path.join(__dirname),
    filename: "[name]/assets/js/allcollection.bundle.js",
  },
});
const frontAllnftConfig = Object.assign({}, config, {
  entry: {
    frontend: "./frontend/src/allnft",
  },
  output: {
    path: path.join(__dirname),
    filename: "[name]/assets/js/allnft.bundle.js",
  },
});

const elementNftFormConfig = Object.assign({}, config, {
  entry: {
    frontend: "./frontend/src/element/nft-form.js",
  },
  output: {
    path: path.join(__dirname),
    filename: "[name]/assets/js/element-nft-form.bundle.js",
  },
});

const elementTopCollectorConfig = Object.assign({}, config, {
  entry: {
    frontend: "./frontend/src/element/top-collector.js",
  },
  output: {
    path: path.join(__dirname),
    filename: "[name]/assets/js/element-top-collector.bundle.js",
  },
});

const elementNftGrid = Object.assign(
  {},
  /* config,*/
  {
    entry: {
      frontend: "./frontend/src/element/nft-grid.js",
    },
    output: {
      path: path.join(__dirname),
      filename: "[name]/assets/js/element-nft-grid.bundle.js",
    },
  }
);

const adminAddNewNftConfig = Object.assign({}, config, {
  entry: {
    backend: "./backend/src/add-new-nft",
  },
  output: {
    path: path.join(__dirname),
    filename: "[name]/assets/js/add-new-nft.bundle.js",
  },
});

const adminNFTListConfig = Object.assign({}, config, {
  entry: {
    backend: "./backend/src/nft-list",
  },
  output: {
    path: path.join(__dirname),
    filename: "[name]/assets/js/nftlist.bundle.js",
  },
});

const adminCollectionList = Object.assign({}, config, {
  entry: {
    backend: "./backend/src/collection-list",
  },
  output: {
    path: path.join(__dirname),
    filename: "[name]/assets/js/collection-list.bundle.js",
  },
});

const adminContractsConfig = Object.assign({}, config, {
  entry: {
    backend: "./backend/src/smart-contracts",
  },
  output: {
    path: path.join(__dirname),
    filename: "[name]/assets/js/smart-contracts.bundle.js",
  },
});

const adminSettingsConfig = Object.assign({}, config, {
  entry: {
    backend: "./backend/src/settings",
  },
  output: {
    path: path.join(__dirname),
    filename: "[name]/assets/js/settings.bundle.js",
  },
});

const adminCategoryConfig = Object.assign({}, config, {
  entry: {
    backend: "./backend/src/categories",
  },
  output: {
    path: path.join(__dirname),
    filename: "[name]/assets/js/category.bundle.js",
  },
});

const adminAddonsConfig = Object.assign({}, config, {
  entry: {
    backend: "./backend/src/addons",
  },
  output: {
    path: path.join(__dirname),
    filename: "[name]/assets/js/addons.bundle.js",
  },
});

module.exports = [
  // elementor
  // elementCollectionConfig,
  //frontend
  frontSingleConfig,
  frontProfileEditConfig,
  frontProfilConfig,
  frontPublicProfilConfig,
  frontAllnftConfig,
  frontAllcollectionConfig,
  frontCollectionConfig,
  frontCreateCollectionConfig,
  frontSingleCategoryConfig,
  //backend
  adminNFTListConfig,
  adminCollectionList,
  adminContractsConfig,
  adminSettingsConfig,
  adminAddNewNftConfig,
  adminCategoryConfig,
  adminAddonsConfig,
  //element
  elementNftFormConfig,
  elementTopCollectorConfig,
  elementNftGrid,
  elementStatsCollectionConfig,
];
