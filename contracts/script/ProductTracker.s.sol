// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {Script, console, console2} from "../lib/forge-std/src/Script.sol";
import {ProductTracker} from "../src/ProductTracker.sol";

// source .env   Carga las variables de entorno en la terminal (git bash)
// forge script script/ProductTracker.s.sol:ProductTrackerScript \
//     --rpc-url sepolia \
//     --broadcast \
//     --verify \
//     -vvvv    //Comando de despliegue.Toma el rpc y la optimización del foundry.toml

// forge script script/ProductTracker.s.sol:ProductTrackerScript --rpc-url sepolia --broadcast --verify -vvvv

// forge verify-contract \
//   --chain-id 11155111 \
//   --num-of-optimizations 200 \
//   --compiler-version 0.8.29 \
//   0xBfC8A_EL_CONTRATO_d8b9e13767604 \
//   src/ProductTracker.sol:ProductTracker \
//   --etherscan-api-key LA_API_KEY o se carga con el comando
contract ProductTrackerScript is Script {
    ProductTracker public productTracker;

    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        console2.log("Deployer private key: ", deployerPrivateKey);
        vm.startBroadcast(deployerPrivateKey);

        productTracker = new ProductTracker();
        console2.log("ProductTracker contract deployed at: ", address(productTracker));
        require(address(productTracker) != address(0), "Failed to deploy ProductTracker");
        vm.stopBroadcast();
    }
}
