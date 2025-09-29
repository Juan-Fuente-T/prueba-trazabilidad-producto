// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract ProductTracker {
    uint256 public productId = 1;  // ID unico, inicia en 1 para evitar errores con el 0
    uint256 public activeProducts;     // Cantidad total de productos activos

    mapping(uint256 => Product) public products; //Producto asociado a su ID

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
        if(msg.sender != products[_productId].currentOwner){
            revert NotOwner();
        }
        _;
    }

    function registerProduct(uint256 _quantity, bytes32 _hash) public returns (uint256) {
        //Checks
        if(_quantity == 0) revert InvalidQuantity(); //Los errores personalizados son mas eficientes en gas
        if(msg.sender == address(0)) revert InvalidOwner();

        //Effects
        uint256 id = productId++; //Obtiene el ID actual

        products[id] = Product({
            quantity: _quantity,
            characterizationHash: _hash,
            currentOwner: msg.sender,
            timestamp: block.timestamp,
            exists: true
        });

        activeProducts++;  // Suma 1 producto a la lista de activos

        //Interactions
        emit ProductRegistered(id, msg.sender);
        return id; //Retorna el ID del producto registrado para capturarlo en el front
    }

    function deleteProduct(uint256 _id) public onlyOwner(_id) {
        //Checks
        if(!products[_id].exists)revert ProductNotExists(); //Los errores personalizados son mas eficientes en gas

        //Effects
        products[_id].exists = false;
        activeProducts--;  // Se elimina un producto de la lista de activos

        //Interactions
        emit ProductDeleted(_id, msg.sender);
    }

    function transferProduct(uint256 _id, address _newOwner) public onlyOwner(_id) {
        if(_newOwner == msg.sender || _newOwner == address(0)) revert InvalidOwner();
        if(!products[_id].exists)revert ProductNotExists();
        if(_newOwner.code.length > 0) revert CannotTransferToContract();

        address oldOwner = products[_id].currentOwner;//Guarda el propietario actual antes de cambiarlo
        products[_id].currentOwner = _newOwner;
        products[_id].timestamp = block.timestamp; //Actualiza la marca temporal

        emit ProductTransferred(_id, oldOwner, _newOwner);
    }

    function getTotalProducts() public view returns (uint256){
        return activeProducts;
    }

    // function getProduct(uint256 _id) public view returns (
    //     uint256 quantity,
    //     bytes32 characterizationHash,
    //     address currentOwner,
    //     uint256 timestamp,
    //     bool exists
    // ) {
     function getProduct(uint256 _id) public view returns (
        Product memory) {
        if(!products[_id].exists) revert ProductNotExists();

        Product memory p = products[_id];

        return p;
    }
}
