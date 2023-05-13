pragma solidity ^0.8.0;

import "../lib/safe-contracts/contracts/base/ModuleManager.sol";
import "../lib/safe-contracts/contracts/base/OwnerManager.sol";
import {SecuredTokenTransfer} from "../lib/safe-contracts/contracts/common/SecuredTokenTransfer.sol";
import "../lib/safe-contracts/contracts/common/SignatureDecoder.sol";
import {Enum} from "../lib/safe-contracts/contracts/common/Enum.sol";
interface GnosisSafe {
    /// @dev Allows a Module to execute a Safe transaction without any further confirmations.
    /// @param to Destination address of module transaction.
    /// @param value Ether value of module transaction.
    /// @param data Data payload of module transaction.
    /// @param operation Operation type of module transaction.
    function execTransactionFromModule(address to, uint256 value, bytes calldata data, Enum.Operation operation)
        external
        returns (bool success);
}


contract FounderTansfersModule is ModuleManager, SignatureDecoder, OwnerManager, SecuredTokenTransfer {
    
    address public safeAddress;
    address public manager;
    address public usdc = 0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174;
    address public aavePool = 0x794a61358D6845594F94dc1DB02A252b5b4814aD;

    bool public activeFounderSeason;

    uint256 public objectiveAmount;
    uint256 public timeToAchiveObjetiveAmount;
    uint256 public totalFounders;
    uint256 public totalDeposited;

    mapping(address => uint256) public founderDeposit;

    address[] public founders;

    event FounserSeasonStarted(uint256 objectiveAmount, uint256 timeToAchiveObjetiveAmount);
    event FounserSeasonStopped();
    event MoneyReturnedToFounder(address founder, uint256 amount);
    event FounderHasDeposit(address founder, uint256 amount);
    
    modifier onlyManager() {
        require(msg.sender == manager, "Only the manager can call this function.");
        _;
    }
    
    constructor(address _manager) {
        manager = _manager;
    }

    function startFounderSeason(uint256 _objectiveAmount, uint256 _timeToAchiveObjetiveAmount) public onlyManager {
        require(!activeFounderSeason, "Founder season is already active");
        require(_objectiveAmount > 0, "Objective amount must be greater than 0");
        require(_timeToAchiveObjetiveAmount > 3 days, "Time to achive objective amount must be greater than 0");
        
        activeFounderSeason = true;
        objectiveAmount = _objectiveAmount;
        timeToAchiveObjetiveAmount = _timeToAchiveObjetiveAmount;
        
        emit FounserSeasonStarted(_objectiveAmount, _timeToAchiveObjetiveAmount);
    }

    
    function stopFounderSeason() public onlyManager {
        require(activeFounderSeason, "Founder season is not active");

        activeFounderSeason = false;
        returnMoneyToFounder();

        emit FounserSeasonStopped();
    }

    function crowfundX(uint256 _amount) public{ //@todo with USDC
        require(activeFounderSeason, "Founder season is not active");
        require(_amount > 0, "Amount must be greater than 0");
        require(totalDeposited + _amount < objectiveAmount, "Amount must be less than objective amount");

        SecuredTokenTransfer.transferToken(usdc, msg.sender, _amount);

        if(founderDeposit[msg.sender] == 0){
            founders.push(msg.sender);
        }

        founderDeposit[msg.sender] += _amount;
        totalDeposited += _amount;
        
        ++totalFounders;

        emit FounderHasDeposit(msg.sender, _amount);

    }

    function returnMoneyToFounder() internal {
        for (uint i = 0; i < founders.length; i++) {
            address founder = founders[i];
            uint256 amount = founderDeposit[founder];
            if(amount > 0){
                founderDeposit[founder] = 0;
                SecuredTokenTransfer.transferToken(usdc, msg.sender, amount);
                emit MoneyReturnedToFounder(founder, amount);
            }
            if(totalDeposited >= objectiveAmount){
                activeFounderSeason = false;
            }
        }
    }

    function requestRefund() public {
        require(
            activeFounderSeason,
            "Project not marked as revert or delete"
        );
        require(
            founderDeposit[msg.sender] > 0,
            "Sender has no deposit"
        );
        uint256 amount = founderDeposit[msg.sender];
        totalDeposited -= amount;
        founderDeposit[msg.sender] = 0;
        SecuredTokenTransfer.transferToken(usdc, msg.sender, amount);

        emit MoneyReturnedToFounder(msg.sender, amount);
    }

    function allowsLoanTo(GnosisSafe safe, address onBehalfOf, address asset, uint256 amount) internal{
        bytes memory data = abi.encodeWithSignature(
            "approveDelegation(address,uint256)",
            onBehalfOf,
            amount
        );
        require(safe.execTransactionFromModule(aavePool, 0, data, Enum.Operation.Call),
                "Could not execute transaction");
        bytes memory data2 = abi.encodeWithSignature(
            "supply(address,uint256,address,uint16)",
            asset,
            amount,
            address(safe),//or this??
            0
        );
        require(safe.execTransactionFromModule(aavePool,
                0,
                data2,
                Enum.Operation.Call),
                "Could not execute transaction");

    }

}
