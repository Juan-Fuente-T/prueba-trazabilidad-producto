// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

// @title Product Traceability System
/// @author Juan Fuente
/// @notice This contract manages product lifecycle tracking on blockchain
/// @dev Implements registration, transfer, and soft deletion of products
contract ProductTracker {
    uint256 public productId = 1; // ID unico, inicia en 1 para evitar errores con el 0
    uint256 public activeProducts; // Cantidad total de productos activos

    mapping(uint256 => Product) public products; //Producto asociado a su ID

    /// @notice Product data structure
    /// @dev Uses timestamp for lifecycle tracking and exists flag for soft deletion
    struct Product {
        uint256 quantity;
        bytes32 characterizationHash;
        uint256 timestamp; //Marca temporal para ciclo de vida del producto
        address currentOwner; //Control de propiedad para transferencias
        bool exists; // Indica si el producto está activo o eliminado
    }

    event ProductRegistered(uint256 indexed productId, address indexed owner);
    event ProductTransferred(uint256 indexed productId, address from, address to);
    event ProductDeleted(uint256 indexed productId, address indexed owner);

    error NotOwner();
    error ProductExists();
    error ProductNotExists();
    error InvalidOwner();
    error InvalidQuantity();
    error CannotTransferToContract();

    modifier onlyOwner(uint256 _productId) {
        if (msg.sender != products[_productId].currentOwner) {
            revert NotOwner();
        }
        _;
    }
    /// @notice Registers a new product in the system
    /// @param _quantity The quantity of units for this product
    /// @param _hash The keccak256 hash characterizing the product
    /// @return The unique ID assigned to the newly registered product

    function registerProduct(uint256 _quantity, bytes32 _hash) public returns (uint256) {
        //Checks
        if (_quantity == 0) revert InvalidQuantity(); //Los errores personalizados son mas eficientes en gas
        if (msg.sender == address(0)) revert InvalidOwner();

        //Effects
        uint256 id = productId++; //Obtiene el ID actual

        products[id] = Product({
            quantity: _quantity,
            characterizationHash: _hash,
            currentOwner: msg.sender,
            timestamp: block.timestamp,
            exists: true
        });

        activeProducts++; // Suma 1 producto a la lista de activos

        //Interactions
        emit ProductRegistered(id, msg.sender);
        return id; //Retorna el ID del producto registrado para capturarlo en el front
    }

    /// @notice Soft deletes a product (sets exists to false)
    /// @dev Only the current owner can delete their product
    /// @param _id The ID of the product to delete
    function deleteProduct(uint256 _id) public onlyOwner(_id) {
        //Checks
        if (!products[_id].exists) revert ProductNotExists(); //Los errores personalizados son mas eficientes en gas

        //Effects
        products[_id].exists = false;
        activeProducts--; // Se elimina un producto de la lista de activos

        //Interactions
        emit ProductDeleted(_id, msg.sender);
    }

    /// @notice Transfers product ownership to a new address
    /// @dev Cannot transfer to zero address, self, or contract addresses
    /// @param _id The ID of the product to transfer
    function transferProduct(uint256 _id, address _newOwner) public onlyOwner(_id) {
        if (_newOwner == msg.sender || _newOwner == address(0)) revert InvalidOwner();
        if (!products[_id].exists) revert ProductNotExists();
        if (_newOwner.code.length > 0) revert CannotTransferToContract();

        address oldOwner = products[_id].currentOwner; //Guarda el propietario actual antes de cambiarlo
        products[_id].currentOwner = _newOwner;
        products[_id].timestamp = block.timestamp; //Actualiza la marca temporal

        emit ProductTransferred(_id, oldOwner, _newOwner);
    }

    /// @notice Returns the total number of active products
    /// @return The count of non-deleted products
    function getTotalProducts() public view returns (uint256) {
        return activeProducts;
    }

    /// @notice Retrieves complete product information
    /// @dev Reverts if product doesn't exist
    /// @param _id The ID of the product to query
    /// @return Product struct containing all product data
    function getProduct(uint256 _id) public view returns (Product memory) {
        if (!products[_id].exists) revert ProductNotExists();

        Product memory p = products[_id];

        return p;
    }
}
