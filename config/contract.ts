export const CONTRACT_ADDRESS = "0xE509E7039bd8D78518822B5cBE80E93D84D2c452" as const;

export const CONTRACT_ABI = [
  {
    abi: [
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
    ],
    bytecode: {
      object:
        "0x608060405260015f553480156012575f5ffd5b506106b5806100205f395ff3fe608060405234801561000f575f5ffd5b5060043610610085575f3560e01c8063b9db15b411610058578063b9db15b41461013a578063c5ce391114610195578063e43059e51461019d578063ed90c7b7146101b2575f5ffd5b8063570aea8a1461008957806361015ea4146100a05780637554ee1c146100b35780637acc0b20146100bc575b5f5ffd5b6001545b6040519081526020015b60405180910390f35b61008d6100ae3660046105ce565b6101c5565b61008d60015481565b6101076100ca3660046105ee565b600260208190525f91825260409091208054600182015492820154600390920154909291906001600160a01b03811690600160a01b900460ff1685565b604080519586526020860194909452928401919091526001600160a01b031660608301521515608082015260a001610097565b61014d6101483660046105ee565b6102dd565b60405161009791908151815260208083015190820152604080830151908201526060808301516001600160a01b03169082015260809182015115159181019190915260a00190565b61008d5f5481565b6101b06101ab366004610605565b6103a9565b005b6101b06101c03660046105ee565b6104fd565b5f825f036101e65760405163524f409b60e01b815260040160405180910390fd5b33610204576040516349e27cff60e01b815260040160405180910390fd5b5f8054818061021283610652565b909155506040805160a08101825286815260208082018781524283850190815233606085019081526001608086018181525f8981526002968790529788209651875593518682015591519385019390935591516003909301805491511515600160a01b026001600160a81b03199092166001600160a01b039490941693909317179091558054929350906102a583610652565b9091555050604051339082907f73e014c0a076665d9511a27e878fadccb6d7171f5754ba1167a670023760b015905f90a39392505050565b6103156040518060a001604052805f81526020015f81526020015f81526020015f6001600160a01b031681526020015f151581525090565b5f82815260026020526040902060030154600160a01b900460ff1661034d57604051631a97b1c160e01b815260040160405180910390fd5b505f90815260026020818152604092839020835160a081018552815481526001820154928101929092529182015492810192909252600301546001600160a01b0381166060830152600160a01b900460ff161515608082015290565b5f8281526002602052604090206003015482906001600160a01b031633146103e4576040516330cd747160e01b815260040160405180910390fd5b6001600160a01b03821633148061040257506001600160a01b038216155b15610420576040516349e27cff60e01b815260040160405180910390fd5b5f83815260026020526040902060030154600160a01b900460ff1661045857604051631a97b1c160e01b815260040160405180910390fd5b6001600160a01b0382163b15610481576040516304b5d61d60e01b815260040160405180910390fd5b5f838152600260208181526040928390206003810180546001600160a01b038881166001600160a01b031983168117909355429390950192909255845193909116808452918301529185917fcef86d37ba3dc1d682967cde44d8050488734bf53166725b220b4d2e515e9e93910160405180910390a250505050565b5f8181526002602052604090206003015481906001600160a01b03163314610538576040516330cd747160e01b815260040160405180910390fd5b5f82815260026020526040902060030154600160a01b900460ff1661057057604051631a97b1c160e01b815260040160405180910390fd5b5f828152600260205260408120600301805460ff60a01b1916905560018054916105998361066a565b9091555050604051339083907f2791af6bd6d895b9bb9d148eac54029dad3f4675e951880dc571ce83d7d02227905f90a35050565b5f5f604083850312156105df575f5ffd5b50508035926020909101359150565b5f602082840312156105fe575f5ffd5b5035919050565b5f5f60408385031215610616575f5ffd5b8235915060208301356001600160a01b0381168114610633575f5ffd5b809150509250929050565b634e487b7160e01b5f52601160045260245ffd5b5f600182016106635761066361063e565b5060010190565b5f816106785761067861063e565b505f19019056fea2646970667358221220ab8e84bfbc1f8d887c7f451b434ae3f5ab21254593ca2967843238f43731c16f64736f6c634300081d0033",
      sourceMap: "58:3526:16:-:0;;;115:1;88:28;;58:3526;;;;;;;;;;;;;;;;",
      linkReferences: {},
    },
    deployedBytecode: {
      object:
        "0x608060405234801561000f575f5ffd5b5060043610610085575f3560e01c8063b9db15b411610058578063b9db15b41461013a578063c5ce391114610195578063e43059e51461019d578063ed90c7b7146101b2575f5ffd5b8063570aea8a1461008957806361015ea4146100a05780637554ee1c146100b35780637acc0b20146100bc575b5f5ffd5b6001545b6040519081526020015b60405180910390f35b61008d6100ae3660046105ce565b6101c5565b61008d60015481565b6101076100ca3660046105ee565b600260208190525f91825260409091208054600182015492820154600390920154909291906001600160a01b03811690600160a01b900460ff1685565b604080519586526020860194909452928401919091526001600160a01b031660608301521515608082015260a001610097565b61014d6101483660046105ee565b6102dd565b60405161009791908151815260208083015190820152604080830151908201526060808301516001600160a01b03169082015260809182015115159181019190915260a00190565b61008d5f5481565b6101b06101ab366004610605565b6103a9565b005b6101b06101c03660046105ee565b6104fd565b5f825f036101e65760405163524f409b60e01b815260040160405180910390fd5b33610204576040516349e27cff60e01b815260040160405180910390fd5b5f8054818061021283610652565b909155506040805160a08101825286815260208082018781524283850190815233606085019081526001608086018181525f8981526002968790529788209651875593518682015591519385019390935591516003909301805491511515600160a01b026001600160a81b03199092166001600160a01b039490941693909317179091558054929350906102a583610652565b9091555050604051339082907f73e014c0a076665d9511a27e878fadccb6d7171f5754ba1167a670023760b015905f90a39392505050565b6103156040518060a001604052805f81526020015f81526020015f81526020015f6001600160a01b031681526020015f151581525090565b5f82815260026020526040902060030154600160a01b900460ff1661034d57604051631a97b1c160e01b815260040160405180910390fd5b505f90815260026020818152604092839020835160a081018552815481526001820154928101929092529182015492810192909252600301546001600160a01b0381166060830152600160a01b900460ff161515608082015290565b5f8281526002602052604090206003015482906001600160a01b031633146103e4576040516330cd747160e01b815260040160405180910390fd5b6001600160a01b03821633148061040257506001600160a01b038216155b15610420576040516349e27cff60e01b815260040160405180910390fd5b5f83815260026020526040902060030154600160a01b900460ff1661045857604051631a97b1c160e01b815260040160405180910390fd5b6001600160a01b0382163b15610481576040516304b5d61d60e01b815260040160405180910390fd5b5f838152600260208181526040928390206003810180546001600160a01b038881166001600160a01b031983168117909355429390950192909255845193909116808452918301529185917fcef86d37ba3dc1d682967cde44d8050488734bf53166725b220b4d2e515e9e93910160405180910390a250505050565b5f8181526002602052604090206003015481906001600160a01b03163314610538576040516330cd747160e01b815260040160405180910390fd5b5f82815260026020526040902060030154600160a01b900460ff1661057057604051631a97b1c160e01b815260040160405180910390fd5b5f828152600260205260408120600301805460ff60a01b1916905560018054916105998361066a565b9091555050604051339083907f2791af6bd6d895b9bb9d148eac54029dad3f4675e951880dc571ce83d7d02227905f90a35050565b5f5f604083850312156105df575f5ffd5b50508035926020909101359150565b5f602082840312156105fe575f5ffd5b5035919050565b5f5f60408385031215610616575f5ffd5b8235915060208301356001600160a01b0381168114610633575f5ffd5b809150509250929050565b634e487b7160e01b5f52601160045260245ffd5b5f600182016106635761066361063e565b5060010190565b5f816106785761067861063e565b505f19019056fea2646970667358221220ab8e84bfbc1f8d887c7f451b434ae3f5ab21254593ca2967843238f43731c16f64736f6c634300081d0033",
      sourceMap:
        "58:3526:16:-:0;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;3042:95;3116:14;;3042:95;;;160:25:17;;;148:2;133:18;3042:95:16;;;;;;;;1222:803;;;;;;:::i;:::-;;:::i;177:29::-;;;;;;256:43;;;;;;:::i;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;-1:-1:-1;;;;;256:43:16;;;-1:-1:-1;;;256:43:16;;;;;;;;;;979:25:17;;;1035:2;1020:18;;1013:34;;;;1063:18;;;1056:34;;;;-1:-1:-1;;;;;1126:32:17;1121:2;1106:18;;1099:60;1203:14;1196:22;1190:3;1175:19;;1168:51;966:3;951:19;256:43:16;726:499:17;3373:209:16;;;;;;:::i;:::-;;:::i;:::-;;;;;;1447:13:17;;1429:32;;1517:4;1505:17;;;1499:24;1477:20;;;1470:54;1580:4;1568:17;;;1562:24;1540:20;;;1533:54;1647:4;1635:17;;;1629:24;-1:-1:-1;;;;;1625:50:17;1603:20;;;1596:80;1746:4;1734:17;;;1728:24;1721:32;1714:40;1692:20;;;1685:70;;;;1416:3;1401:19;;1230:531;88:28:16;;;;;;2437:599;;;;;;:::i;:::-;;:::i;:::-;;2031:400;;;;;;:::i;:::-;;:::i;1222:803::-;1297:7;1336:9;1349:1;1336:14;1333:43;;1359:17;;-1:-1:-1;;;1359:17:16;;;;;;;;;;;1333:43;1444:10;1441:50;;1477:14;;-1:-1:-1;;;1477:14:16;;;;;;;;;;;1441:50;1520:10;1533:11;;1520:10;;1533:11;;;:::i;:::-;;;;-1:-1:-1;1593:197:16;;;;;;;;;;;;;;;;;;1738:15;1593:197;;;;;;1703:10;1593:197;;;;;;1775:4;1593:197;;;;;;-1:-1:-1;1578:12:16;;;:8;:12;;;;;;;:212;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;-1:-1:-1;;;1578:212:16;-1:-1:-1;;;;;;1578:212:16;;;-1:-1:-1;;;;;1578:212:16;;;;;;;;;;;;1801:16;;1520:24;;-1:-1:-1;1775:4:16;1801:16;;;:::i;:::-;;;;-1:-1:-1;;1898:33:16;;1920:10;;1916:2;;1898:33;;;;;1948:2;1222:803;-1:-1:-1;;;1222:803:16:o;3373:209::-;3436:14;-1:-1:-1;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;3436:14:16;3466:13;;;;:8;:13;;;;;:20;;;-1:-1:-1;;;3466:20:16;;;;3462:51;;3495:18;;-1:-1:-1;;;3495:18:16;;;;;;;;;;;3462:51;-1:-1:-1;3524:16:16;3543:13;;;:8;:13;;;;;;;;;3524:32;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;-1:-1:-1;;;;;3524:32:16;;;;;;-1:-1:-1;;;3524:32:16;;;;;;;;;;;3373:209::o;2437:599::-;1123:20;;;;:8;:20;;;;;:33;;;:20;;-1:-1:-1;;;;;1123:33:16;1109:10;:47;1106:93;;1178:10;;-1:-1:-1;;;1178:10:16;;;;;;;;;;;1106:93;-1:-1:-1;;;;;2529:23:16;::::1;2542:10;2529:23;::::0;:50:::1;;-1:-1:-1::0;;;;;;2556:23:16;::::1;::::0;2529:50:::1;2526:76;;;2588:14;;-1:-1:-1::0;;;2588:14:16::1;;;;;;;;;;;2526:76;2616:13;::::0;;;:8:::1;:13;::::0;;;;:20:::1;;::::0;-1:-1:-1;;;2616:20:16;::::1;;;2612:50;;2644:18;;-1:-1:-1::0;;;2644:18:16::1;;;;;;;;;;;2612:50;-1:-1:-1::0;;;;;2675:21:16;::::1;;:25:::0;2672:63:::1;;2709:26;;-1:-1:-1::0;;;2709:26:16::1;;;;;;;;;;;2672:63;2746:16;2765:13:::0;;;:8:::1;:13;::::0;;;;;;;;:26:::1;::::0;::::1;::::0;;-1:-1:-1;;;;;2850:38:16;;::::1;-1:-1:-1::0;;;;;;2850:38:16;::::1;::::0;::::1;::::0;;;2924:15:::1;2898:23:::0;;;::::1;:41:::0;;;;2985:44;;2765:26;;;::::1;2625:51:17::0;;;2692:18;;;2685:60;2765:26:16;:13;;2985:44:::1;::::0;2598:18:17;2985:44:16::1;;;;;;;2516:520;2437:599:::0;;;:::o;2031:400::-;1123:20;;;;:8;:20;;;;;:33;;;:20;;-1:-1:-1;;;;;1123:33:16;1109:10;:47;1106:93;;1178:10;;-1:-1:-1;;;1178:10:16;;;;;;;;;;;1106:93;2120:13:::1;::::0;;;:8:::1;:13;::::0;;;;:20:::1;;::::0;-1:-1:-1;;;2120:20:16;::::1;;;2116:50;;2148:18;;-1:-1:-1::0;;;2148:18:16::1;;;;;;;;;;;2116:50;2273:5;2250:13:::0;;;:8:::1;:13;::::0;;;;:20:::1;;:28:::0;;-1:-1:-1;;;;2250:28:16::1;::::0;;;2288:16;;;::::1;::::0;::::1;:::i;:::-;::::0;;;-1:-1:-1;;2393:31:16::1;::::0;2413:10:::1;::::0;2408:3;;2393:31:::1;::::0;;;::::1;2031:400:::0;;:::o;196:294:17:-;264:6;272;325:2;313:9;304:7;300:23;296:32;293:52;;;341:1;338;331:12;293:52;-1:-1:-1;;386:23:17;;;480:2;465:18;;;452:32;;-1:-1:-1;196:294:17:o;495:226::-;554:6;607:2;595:9;586:7;582:23;578:32;575:52;;;623:1;620;613:12;575:52;-1:-1:-1;668:23:17;;495:226;-1:-1:-1;495:226:17:o;1766:408::-;1834:6;1842;1895:2;1883:9;1874:7;1870:23;1866:32;1863:52;;;1911:1;1908;1901:12;1863:52;1956:23;;;-1:-1:-1;2055:2:17;2040:18;;2027:32;-1:-1:-1;;;;;2090:33:17;;2078:46;;2068:74;;2138:1;2135;2128:12;2068:74;2161:7;2151:17;;;1766:408;;;;;:::o;2179:127::-;2240:10;2235:3;2231:20;2228:1;2221:31;2271:4;2268:1;2261:15;2295:4;2292:1;2285:15;2311:135;2350:3;2371:17;;;2368:43;;2391:18;;:::i;:::-;-1:-1:-1;2438:1:17;2427:13;;2311:135::o;2756:136::-;2795:3;2823:5;2813:39;;2832:18;;:::i;:::-;-1:-1:-1;;;2868:18:17;;2756:136::o",
      linkReferences: {},
    },
    methodIdentifiers: {
      "activeProducts()": "7554ee1c",
      "deleteProduct(uint256)": "ed90c7b7",
      "getProduct(uint256)": "b9db15b4",
      "getTotalProducts()": "570aea8a",
      "productId()": "c5ce3911",
      "products(uint256)": "7acc0b20",
      "registerProduct(uint256,bytes32)": "61015ea4",
      "transferProduct(uint256,address)": "e43059e5",
    },
    rawMetadata:
      '{"compiler":{"version":"0.8.29+commit.ab55807c"},"language":"Solidity","output":{"abi":[{"inputs":[],"name":"CannotTransferToContract","type":"error"},{"inputs":[],"name":"InvalidOwner","type":"error"},{"inputs":[],"name":"InvalidQuantity","type":"error"},{"inputs":[],"name":"NotOwner","type":"error"},{"inputs":[],"name":"ProductExists","type":"error"},{"inputs":[],"name":"ProductNotExists","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"productId","type":"uint256"},{"indexed":true,"internalType":"address","name":"owner","type":"address"}],"name":"ProductDeleted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"productId","type":"uint256"},{"indexed":true,"internalType":"address","name":"owner","type":"address"}],"name":"ProductRegistered","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"productId","type":"uint256"},{"indexed":false,"internalType":"address","name":"from","type":"address"},{"indexed":false,"internalType":"address","name":"to","type":"address"}],"name":"ProductTransferred","type":"event"},{"inputs":[],"name":"activeProducts","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"}],"name":"deleteProduct","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"}],"name":"getProduct","outputs":[{"components":[{"internalType":"uint256","name":"quantity","type":"uint256"},{"internalType":"bytes32","name":"characterizationHash","type":"bytes32"},{"internalType":"uint256","name":"timestamp","type":"uint256"},{"internalType":"address","name":"currentOwner","type":"address"},{"internalType":"bool","name":"exists","type":"bool"}],"internalType":"struct ProductTracker.Product","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getTotalProducts","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"productId","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"products","outputs":[{"internalType":"uint256","name":"quantity","type":"uint256"},{"internalType":"bytes32","name":"characterizationHash","type":"bytes32"},{"internalType":"uint256","name":"timestamp","type":"uint256"},{"internalType":"address","name":"currentOwner","type":"address"},{"internalType":"bool","name":"exists","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_quantity","type":"uint256"},{"internalType":"bytes32","name":"_hash","type":"bytes32"}],"name":"registerProduct","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"},{"internalType":"address","name":"_newOwner","type":"address"}],"name":"transferProduct","outputs":[],"stateMutability":"nonpayable","type":"function"}],"devdoc":{"kind":"dev","methods":{},"version":1},"userdoc":{"kind":"user","methods":{},"version":1}},"settings":{"compilationTarget":{"src/ProductTracker.sol":"ProductTracker"},"evmVersion":"cancun","libraries":{},"metadata":{"bytecodeHash":"ipfs"},"optimizer":{"enabled":true,"runs":200},"remappings":[":forge-std/=lib/forge-std/src/"]},"sources":{"src/ProductTracker.sol":{"keccak256":"0xfa8c68ed59432d971f3e4dce2df0aa6ac34a6b5c5872ba1b42de121ce68a07cb","license":"MIT","urls":["bzz-raw://fe130f9e069e5bd540a36e01b353457464231a6db42f823a1d37380ddf548f4b","dweb:/ipfs/QmRKxY52ZnCrC7CdAhuST7cp8w2vy43ik4SCj68YQYTwNZ"]}},"version":1}',
    metadata: {
      compiler: { version: "0.8.29+commit.ab55807c" },
      language: "Solidity",
      output: {
        abi: [
          { inputs: [], type: "error", name: "CannotTransferToContract" },
          { inputs: [], type: "error", name: "InvalidOwner" },
          { inputs: [], type: "error", name: "InvalidQuantity" },
          { inputs: [], type: "error", name: "NotOwner" },
          { inputs: [], type: "error", name: "ProductExists" },
          { inputs: [], type: "error", name: "ProductNotExists" },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "productId",
                type: "uint256",
                indexed: true,
              },
              {
                internalType: "address",
                name: "owner",
                type: "address",
                indexed: true,
              },
            ],
            type: "event",
            name: "ProductDeleted",
            anonymous: false,
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "productId",
                type: "uint256",
                indexed: true,
              },
              {
                internalType: "address",
                name: "owner",
                type: "address",
                indexed: true,
              },
            ],
            type: "event",
            name: "ProductRegistered",
            anonymous: false,
          },
          {
            inputs: [
              {
                internalType: "uint256",
                name: "productId",
                type: "uint256",
                indexed: true,
              },
              {
                internalType: "address",
                name: "from",
                type: "address",
                indexed: false,
              },
              {
                internalType: "address",
                name: "to",
                type: "address",
                indexed: false,
              },
            ],
            type: "event",
            name: "ProductTransferred",
            anonymous: false,
          },
          {
            inputs: [],
            stateMutability: "view",
            type: "function",
            name: "activeProducts",
            outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
          },
          {
            inputs: [{ internalType: "uint256", name: "_id", type: "uint256" }],
            stateMutability: "nonpayable",
            type: "function",
            name: "deleteProduct",
          },
          {
            inputs: [{ internalType: "uint256", name: "_id", type: "uint256" }],
            stateMutability: "view",
            type: "function",
            name: "getProduct",
            outputs: [
              {
                internalType: "struct ProductTracker.Product",
                name: "",
                type: "tuple",
                components: [
                  {
                    internalType: "uint256",
                    name: "quantity",
                    type: "uint256",
                  },
                  {
                    internalType: "bytes32",
                    name: "characterizationHash",
                    type: "bytes32",
                  },
                  {
                    internalType: "uint256",
                    name: "timestamp",
                    type: "uint256",
                  },
                  {
                    internalType: "address",
                    name: "currentOwner",
                    type: "address",
                  },
                  { internalType: "bool", name: "exists", type: "bool" },
                ],
              },
            ],
          },
          {
            inputs: [],
            stateMutability: "view",
            type: "function",
            name: "getTotalProducts",
            outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
          },
          {
            inputs: [],
            stateMutability: "view",
            type: "function",
            name: "productId",
            outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
          },
          {
            inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
            stateMutability: "view",
            type: "function",
            name: "products",
            outputs: [
              { internalType: "uint256", name: "quantity", type: "uint256" },
              {
                internalType: "bytes32",
                name: "characterizationHash",
                type: "bytes32",
              },
              { internalType: "uint256", name: "timestamp", type: "uint256" },
              {
                internalType: "address",
                name: "currentOwner",
                type: "address",
              },
              { internalType: "bool", name: "exists", type: "bool" },
            ],
          },
          {
            inputs: [
              { internalType: "uint256", name: "_quantity", type: "uint256" },
              { internalType: "bytes32", name: "_hash", type: "bytes32" },
            ],
            stateMutability: "nonpayable",
            type: "function",
            name: "registerProduct",
            outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
          },
          {
            inputs: [
              { internalType: "uint256", name: "_id", type: "uint256" },
              { internalType: "address", name: "_newOwner", type: "address" },
            ],
            stateMutability: "nonpayable",
            type: "function",
            name: "transferProduct",
          },
        ],
        devdoc: { kind: "dev", methods: {}, version: 1 },
        userdoc: { kind: "user", methods: {}, version: 1 },
      },
      settings: {
        remappings: ["forge-std/=lib/forge-std/src/"],
        optimizer: { enabled: true, runs: 200 },
        metadata: { bytecodeHash: "ipfs" },
        compilationTarget: { "src/ProductTracker.sol": "ProductTracker" },
        evmVersion: "cancun",
        libraries: {},
      },
      sources: {
        "src/ProductTracker.sol": {
          keccak256:
            "0xfa8c68ed59432d971f3e4dce2df0aa6ac34a6b5c5872ba1b42de121ce68a07cb",
          urls: [
            "bzz-raw://fe130f9e069e5bd540a36e01b353457464231a6db42f823a1d37380ddf548f4b",
            "dweb:/ipfs/QmRKxY52ZnCrC7CdAhuST7cp8w2vy43ik4SCj68YQYTwNZ",
          ],
          license: "MIT",
        },
      },
      version: 1,
    },
    id: 16,
  },
] as const;
