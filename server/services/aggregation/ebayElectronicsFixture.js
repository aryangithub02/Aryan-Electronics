/**
 * Aryan Electronics - eBay Browse API Electronics Fixture Data
 * Provides verified commercial electronics responses for deterministic testing
 * and fallback when eBay developer API credentials (EBAY_CLIENT_ID / EBAY_CLIENT_SECRET) are pending approval
 */

module.exports = {
  total: 5,
  limit: 10,
  offset: 0,
  itemSummaries: [
    {
      itemId: "v1|385920192831|0",
      title: "Apple iPhone 15 Pro Max 256GB Natural Titanium Factory Unlocked",
      price: {
        value: "1199.00",
        currency: "USD"
      },
      image: {
        imageUrl: "https://m.media-amazon.com/images/I/81Os1eA57rL._AC_SL1500_.jpg"
      },
      additionalImages: [
        { imageUrl: "https://m.media-amazon.com/images/I/81Os1eA57rL._AC_SL1500_.jpg" }
      ],
      categories: [
        { categoryId: "9355", categoryName: "Cell Phones & Smartphones" }
      ],
      condition: "Brand New in Box",
      itemLocation: {
        country: "US"
      },
      seller: {
        username: "ElectroDeals Direct",
        feedbackPercentage: "99.4",
        feedbackScore: 28410
      },
      itemWebUrl: "https://www.ebay.com/itm/385920192831",
      marketingPrice: {
        originalPrice: {
          value: "1299.00",
          currency: "USD"
        },
        discountPercentage: "8"
      }
    },
    {
      itemId: "v1|295849102847|0",
      title: "Sony PlayStation 5 Digital Edition Slim Console White",
      price: {
        value: "449.99",
        currency: "USD"
      },
      image: {
        imageUrl: "https://m.media-amazon.com/images/I/51rpbVmi9XL._AC_SL1500_.jpg"
      },
      additionalImages: [
        { imageUrl: "https://m.media-amazon.com/images/I/51rpbVmi9XL._AC_SL1500_.jpg" }
      ],
      categories: [
        { categoryId: "139971", categoryName: "Video Game Consoles" }
      ],
      condition: "Brand New Factory Sealed",
      itemLocation: {
        country: "US"
      },
      seller: {
        username: "GamingPro Sellers",
        feedbackPercentage: "98.9",
        feedbackScore: 15420
      },
      itemWebUrl: "https://www.ebay.com/itm/295849102847",
      marketingPrice: {
        originalPrice: {
          value: "499.99",
          currency: "USD"
        },
        discountPercentage: "10"
      }
    },
    {
      itemId: "v1|185920491023|0",
      title: "Sennheiser Momentum 4 Wireless Noise-Canceling Over-Ear Headphones",
      price: {
        value: "299.95",
        currency: "USD"
      },
      image: {
        imageUrl: "https://m.media-amazon.com/images/I/51-s+PZRaKL._AC_SL1500_.jpg"
      },
      categories: [
        { categoryId: "112529", categoryName: "Headphones" }
      ],
      condition: "Brand New",
      itemLocation: {
        country: "US"
      },
      seller: {
        username: "Audiophile Sound Lab",
        feedbackPercentage: "99.7",
        feedbackScore: 43200
      },
      itemWebUrl: "https://www.ebay.com/itm/185920491023",
      marketingPrice: {
        originalPrice: {
          value: "379.95",
          currency: "USD"
        },
        discountPercentage: "21"
      }
    },
    {
      itemId: "v1|334819203948|0",
      title: "Raspberry Pi 5 8GB RAM Single Board Computer Desktop Kit",
      price: {
        value: "80.00",
        currency: "USD"
      },
      image: {
        imageUrl: "https://m.media-amazon.com/images/I/81x37vNZyVL._AC_SL1500_.jpg"
      },
      categories: [
        { categoryId: "175673", categoryName: "Single Board Computers" }
      ],
      condition: "Brand New",
      itemLocation: {
        country: "UK"
      },
      seller: {
        username: "MakerWorld Electronics",
        feedbackPercentage: "99.2",
        feedbackScore: 8900
      },
      itemWebUrl: "https://www.ebay.com/itm/334819203948"
    },
    {
      itemId: "v1|204819204812|0",
      title: "Dell XPS 15 9530 Core i7-13700H 32GB RAM 1TB SSD RTX 4060",
      price: {
        value: "1899.00",
        currency: "USD"
      },
      image: {
        imageUrl: "https://m.media-amazon.com/images/I/71UBs8H1FnL._AC_SL1500_.jpg"
      },
      categories: [
        { categoryId: "177", categoryName: "PC Laptops & Netbooks" }
      ],
      condition: "Brand New Sealed",
      itemLocation: {
        country: "US"
      },
      seller: {
        username: "Workstation Express",
        feedbackPercentage: "99.5",
        feedbackScore: 19540
      },
      itemWebUrl: "https://www.ebay.com/itm/204819204812",
      marketingPrice: {
        originalPrice: {
          value: "2199.00",
          currency: "USD"
        },
        discountPercentage: "14"
      }
    }
  ]
};
