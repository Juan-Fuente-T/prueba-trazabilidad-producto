export const CONTRACT_ADDRESS = "0xE509E7039bd8D78518822B5cBE80E93D84D2c452" as const;
// export const CONTRACT_ADDRESS = "0xDEDb6d8F6E8ef69FB76bbA1868a2d51009ce0E43" as const;

export const CONTRACT_ABI = [
  {
    type: "function",
    name: "activeProducts",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "deleteProduct",
    inputs: [{ name: "_id", type: "uint256", internalType: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "getProduct",
    inputs: [{ name: "_id", type: "uint256", internalType: "uint256" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        internalType: "struct ProductTracker.Product",
        components: [
          { name: "quantity", type: "uint256", internalType: "uint256" },
          {
            name: "characterizationHash",
            type: "bytes32",
            internalType: "bytes32",
          },
          { name: "timestamp", type: "uint256", internalType: "uint256" },
          {
            name: "currentOwner",
            type: "address",
            internalType: "address",
          },
          { name: "exists", type: "bool", internalType: "bool" },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getTotalProducts",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "productId",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "products",
    inputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    outputs: [
      { name: "quantity", type: "uint256", internalType: "uint256" },
      {
        name: "characterizationHash",
        type: "bytes32",
        internalType: "bytes32",
      },
      { name: "timestamp", type: "uint256", internalType: "uint256" },
      { name: "currentOwner", type: "address", internalType: "address" },
      { name: "exists", type: "bool", internalType: "bool" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "registerProduct",
    inputs: [
      { name: "_quantity", type: "uint256", internalType: "uint256" },
      { name: "_hash", type: "bytes32", internalType: "bytes32" },
    ],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "transferProduct",
    inputs: [
      { name: "_id", type: "uint256", internalType: "uint256" },
      { name: "_newOwner", type: "address", internalType: "address" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "event",
    name: "ProductDeleted",
    inputs: [
      {
        name: "productId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "owner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "ProductRegistered",
    inputs: [
      {
        name: "productId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "owner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "ProductTransferred",
    inputs: [
      {
        name: "productId",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "from",
        type: "address",
        indexed: false,
        internalType: "address",
      },
      {
        name: "to",
        type: "address",
        indexed: false,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  { type: "error", name: "CannotTransferToContract", inputs: [] },
  { type: "error", name: "InvalidOwner", inputs: [] },
  { type: "error", name: "InvalidQuantity", inputs: [] },
  { type: "error", name: "NotOwner", inputs: [] },
  { type: "error", name: "ProductExists", inputs: [] },
  { type: "error", name: "ProductNotExists", inputs: [] },
] as const;