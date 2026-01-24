// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {Test, console} from "forge-std/Test.sol";
import {ProductTracker} from "../src/ProductTracker.sol";

contract ProductTrackerTest is Test {
    ProductTracker public productTracker;

    address alice;
    address bob;

    event ProductRegistered(uint256 indexed productId, address indexed owner);
    event ProductTransferred(uint256 indexed productId, address from, address to);
    event ProductDeleted(uint256 indexed productId, address indexed owner);

    function setUp() public {
        productTracker = new ProductTracker();
        alice = makeAddr("alice");
        bob = makeAddr("bob");
    }

    function testRegisterProduct() public {
        vm.prank(alice);
        vm.expectEmit();
        emit ProductRegistered(1, alice);
        uint256 productId1 = productTracker.registerProduct(5, keccak256(abi.encodePacked("Product 1")));
        assertEq(productId1, 1);
        ProductTracker.Product memory product1 = productTracker.getProduct(productId1);
        // console.log("Product 1 ID:", productId1);
        // console.log("Product 1 Quantity:", product1.quantity);

        assertEq(productId1, 1);
        assertEq(productTracker.activeProducts(), 1);
        assertEq(product1.characterizationHash, keccak256(abi.encodePacked("Product 1")));
        assertEq(product1.quantity, 5);
        assertEq(product1.currentOwner, alice);
        assertEq(product1.exists, true);

        vm.prank(bob);
        vm.expectEmit();
        emit ProductRegistered(2, bob);
        uint256 productId2 = productTracker.registerProduct(55, keccak256(abi.encodePacked("Product 2")));
        assertNotEq(productId2, 1);
        assertEq(productId2, 2);
        ProductTracker.Product memory product2 = productTracker.getProduct(productId2);
        assertEq(productTracker.activeProducts(), 2);
        assertEq(product2.characterizationHash, keccak256(abi.encodePacked("Product 2")));
        assertEq(product2.quantity, 55);
        assertEq(product2.currentOwner, bob);
        assertEq(product2.exists, true);
    }

    function testRegisterProductFail() public {
        vm.expectRevert(abi.encodeWithSignature("InvalidQuantity()"));
        uint256 productId1 = productTracker.registerProduct(0, keccak256(abi.encodePacked("Product 1")));
        vm.expectRevert(abi.encodeWithSignature("InvalidOwner()"));
        vm.prank(address(0));
        uint256 productId2 = productTracker.registerProduct(3, keccak256(abi.encodePacked("Product 1")));
        assertEq(productTracker.getTotalProducts(), 0);
    }

    //TEST solo para comprobar que se emite el evento correctamente
    function testTransferProductEvent() public {
        vm.startPrank(bob);
        uint256 id = productTracker.registerProduct(5, keccak256("Product"));

        vm.expectEmit(true, true, true, true);
        emit ProductTransferred(id, bob, alice);
        productTracker.transferProduct(id, alice);
    }

    //TEST solo para comprobar que se emite el evento correctamente
    function testDeleteProductEvent() public {
        vm.startPrank(alice);
        uint256 id = productTracker.registerProduct(5, keccak256("Product"));

        vm.expectEmit(true, true, true, false);
        emit ProductDeleted(id, alice);
        productTracker.deleteProduct(id);
    }
}
