pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/// @title A title that should describe the contract/interface
/// @author The name of the author
/// @notice Explain to an end user what this does
/// @dev Explain to a developer any extra details
contract Token is ERC20, AccessControl {

    enum Status {
        WHITELISTED,
        BLACKLISTED,
        GREYLISTED
    }

    struct AccountStatus {
        address[] interactedAccounts;
        Status accountStatus;
    }
    
    // accounts status mappings
    mapping(address=> AccountStatus) public accountsStatus;

    // mapping of interactions by keccak256(address1, address2) to a bool
    mapping(bytes32 => bool) public interactions;


    constructor(
        string memory _tokenName, 
        string memory _tokenSymbol
    ) ERC20(_tokenName, _tokenSymbol) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }


    function blacklistAccount(address blacklist) onlyRole(DEFAULT_ADMIN_ROLE) external {
        accountsStatus[blacklist].accountStatus = Status.BLACKLISTED;
        address[] memory directInteractions = accountsStatus[blacklist].interactedAccounts;
        for(uint256 i = 0; i< directInteractions.length; i++) {
            if(accountsStatus[directInteractions[i]].accountStatus == Status.WHITELISTED) {
                accountsStatus[directInteractions[i]].accountStatus = Status.GREYLISTED;
            }
        }
    }

    function whitelistAccount(address whitelist) onlyRole(DEFAULT_ADMIN_ROLE) external {
        accountsStatus[whitelist].accountStatus = Status.WHITELISTED;
        address[] memory directInteractions = accountsStatus[whitelist].interactedAccounts;
        for (uint256 i = 0; i < directInteractions.length; i++) {
            if(accountsStatus[directInteractions[i]].accountStatus == Status.GREYLISTED) {
                accountsStatus[directInteractions[i]].accountStatus = Status.WHITELISTED;
            }
        }
    }

    function _beforeTokenTransfer(
        address _from, 
        address _to, 
        uint256 _amount
    ) internal virtual override {
        
    }

}