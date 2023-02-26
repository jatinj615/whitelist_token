pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/// @title WhiteList-Blacklist Token
/// @author xaults-assignment
contract Token is ERC20, AccessControl {

    enum Status {
        BLACKLISTED,
        WHITELISTED,
        GREYLISTED
    }

    struct AccountStatus {
        address[] interactedAccounts;
        Status accountStatus;
    }
    
    error TransferNotAllowed();

    uint256 immutable public exchangeRate;

    // accounts status mappings
    mapping(address=> AccountStatus) public accountsStatus;

    // mapping of interactions by keccak256(address1, address2) to a bool
    mapping(bytes32 => bool) public interactions;

    event BlackListed(address account);

    event WhiteListed(address account);

    constructor(
        string memory _tokenName, 
        string memory _tokenSymbol,
        uint256 _exchangeRate,
        address[] memory _accounts
    ) ERC20(_tokenName, _tokenSymbol) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        exchangeRate = _exchangeRate;
        for(uint8 i = 0; i < _accounts.length; i++) {
            accountsStatus[_accounts[i]].accountStatus = Status.WHITELISTED;
        }
    }

    /// @notice Blacklist an account and it's direct interactions
    /// @param blacklist address of the account which needs to be blacklisted
    function blacklistAccount(address blacklist) onlyRole(DEFAULT_ADMIN_ROLE) external {
        require(blacklist != address(0), "Error: Zero Account Address");
        accountsStatus[blacklist].accountStatus = Status.BLACKLISTED;
        address[] memory directInteractions = accountsStatus[blacklist].interactedAccounts;
        for(uint256 i = 0; i< directInteractions.length; i++) {
            if(accountsStatus[directInteractions[i]].accountStatus == Status.WHITELISTED) {
                accountsStatus[directInteractions[i]].accountStatus = Status.GREYLISTED;
            }
        }
        emit BlackListed(blacklist);
    }

    /// @notice Whitelist any account and affected accounts by it (if any)
    /// @param whitelist address of the account which needs to be whitelisted
    function whitelistAccount(address whitelist) onlyRole(DEFAULT_ADMIN_ROLE) external {
        require(whitelist != address(0), "Error: Zero Account Address");
        accountsStatus[whitelist].accountStatus = Status.WHITELISTED;
        address[] memory directInteractions = accountsStatus[whitelist].interactedAccounts;
        for (uint256 i = 0; i < directInteractions.length; i++) {
            if(accountsStatus[directInteractions[i]].accountStatus == Status.GREYLISTED) {
                accountsStatus[directInteractions[i]].accountStatus = Status.WHITELISTED;
            }
        }
        emit WhiteListed(whitelist);
    }

    /// @notice checks if both thefrom and to addresses are whitelisted 
    /// @dev Reverts the transaction if sending or receiving address is not whitelisted, ignore mint and burn
    /// @param _from spender address
    /// @param _to receiver address
    function _beforeTokenTransfer(
        address _from, 
        address _to, 
        uint256
    ) internal virtual override {
        if(_from != address(0) && _to != address(0) && (accountsStatus[_from].accountStatus != Status.WHITELISTED ||
            accountsStatus[_to].accountStatus != Status.WHITELISTED)) revert TransferNotAllowed();
    }

    /// @notice add the direct interaction of spender and receiver
    /// @dev if spender and receiver interacted directly for the first time then add otherwise skip, ignore mint and burn
    /// @param _from spender address
    /// @param _to receiver address
    function _afterTokenTransfer(
        address _from, 
        address _to, 
        uint256
    ) internal virtual override {
        if(_from != address(0) && _to != address(0) &&
            !(interactions[keccak256(abi.encode(_from, _to))] || interactions[keccak256(abi.encode(_to, _from))])){
            interactions[keccak256(abi.encode(_from, _to))] = true;
            (accountsStatus[_from].interactedAccounts).push(_to);
            (accountsStatus[_to].interactedAccounts).push(_from);
        }
    }

    /// @notice Lets User purchase tokens at fixed rate by checking exchange rate
    /// @dev mint amount should be paid in native currency
    /// @param _amount amount of tokens user wants to mint
    function mint(uint256 _amount) external payable {
        require(accountsStatus[msg.sender].accountStatus == Status.WHITELISTED, "Error: Not Whitelisted");
        require((msg.value * exchangeRate) >= _amount, "Error: Not enough liquidity provided");
        _mint(msg.sender, _amount);
    }

    // to receive native currency
    receive() external payable{}
}