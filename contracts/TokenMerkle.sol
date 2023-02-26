pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/// @title A title that should describe the contract/interface
/// @author The name of the author
/// @notice Explain to an end user what this does
/// @dev Explain to a developer any extra details
contract Token is ERC20, AccessControl {
    
    error TransferNotAllowed();

    bytes32 public whitelistMerkleRoot;

    // accounts status mappings
    mapping(address=> address[]) public accountsStatus;

    // mapping of interactions by keccak256(address1, address2) to a bool
    mapping(bytes32 => bool) public interactions;


    constructor(
        string memory _tokenName, 
        string memory _tokenSymbol,
        bytes32 _root
    ) ERC20(_tokenName, _tokenSymbol) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        whitelistMerkleRoot = _root;
    }

    /// @notice Set new root of updated whitelist/blacklist
    /// @param _newRoot new merkle root for whitelisted accounts
    function setRoot(bytes32 _newRoot) onlyRole(DEFAULT_ADMIN_ROLE) external {
        whitelistMerkleRoot = _newRoot;
    }

    /// @notice checks if both thefrom and to addresses are whitelisted 
    /// @dev Reverts the transaction if sending or receiving address is not whitelisted
    /// @param _from spender address
    /// @param _to receiver address
    function _beforeTokenTransfer(
        address _from, 
        address _to, 
        uint256
    ) internal virtual override {
        if(accountsStatus[_from].accountStatus != Status.WHITELISTED ||
            accountsStatus[_to].accountStatus != Status.WHITELISTED) revert TransferNotAllowed();
    }

    /// @notice add the direct interaction of spender and receiver
    /// @dev if spender and receiver interacted directly for the first time then add otherwise skip
    /// @param _from spender address
    /// @param _to receiver address
    function _afterTokenTransfer(
        address _from, 
        address _to, 
        uint256
    ) internal virtual override {
        if(!(interactions[keccak256(abi.encode(_from, _to))] || interactions[keccak256(abi.encode(_to, _from))])){
            interactions[keccak256(abi.encode(_from, _to))] = true;
            (accountsStatus[_from].interactedAccounts).push(_to);
            (accountsStatus[_to].interactedAccounts).push(_from);
        }
    }
}