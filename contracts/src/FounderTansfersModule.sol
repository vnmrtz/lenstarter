pragma solidity ^0.8.0;

import "../lib/safe-contracts/contracts/base/ModuleManager.sol";
import "../lib/safe-contracts/contracts/base/OwnerManager.sol";
import {SecuredTokenTransfer} from "../lib/safe-contracts/contracts/common/SecuredTokenTransfer.sol";
import "../lib/safe-contracts/contracts/common/SignatureDecoder.sol";
import {Enum} from "../lib/safe-contracts/contracts/common/Enum.sol";
import "../lib/safe-contracts/contracts/Safe.sol";
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
interface IPool{
    function withdraw(address asset, uint256 amount, address to) external returns (uint256);
    function getUserAccountData(address user) external view returns (
      uint256 totalCollateralBase,
      uint256 totalDebtBase,
      uint256 availableBorrowsBase,
      uint256 currentLiquidationThreshold,
      uint256 ltv,
      uint256 healthFactor
    );
}


contract FounderTansfersModule is ModuleManager, SignatureDecoder, OwnerManager, SecuredTokenTransfer {
    
    address public safeAddress;
    address public manager;
    address public usdc = 0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174;
    address public aavePool = 0x794a61358D6845594F94dc1DB02A252b5b4814aD;
    address public aavePool2 = 0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2;

    //Safe -> Founder -> Amount
    mapping(address => mapping(address => uint256)) public founderDepositsbySafe;
    //Safe -> bool
    mapping(address => bool) public activeFounderSeasonBySafe;
    //Safe -> AmountObjetive
    mapping(address => uint256) public objectiveAmountBySafe;
    //Safe -> TimeToAchiveObjetiveAmount
    mapping(address => uint256) public timeUnlockBySafe;
    //Safe -> TotalDeposited
    mapping(address => uint256) public totalDepositedBySafe;
    //Safe -> bool
    mapping(address => bool) public founderHasWithdrawnBySafe;

    event FounserSeasonStarted(address indexed safe, uint256 indexed objectiveAmount, uint256 indexed timeToAchiveObjetiveAmount);
    event MoneyReturnedToFounder(address indexed safe, address indexed founder, uint256 indexed amount);
    event FounderHasDeposit(address indexed safe, address indexed founder, uint256 indexed amount);
    
    modifier onlyManager() {
        require(msg.sender == manager, "Only the manager can call this function.");
        _;
    }
    
    constructor(address _manager) {
        manager = _manager;
    }

    function startFounderSeason(address safe, uint256 _objectiveAmount, uint256 _timeUnlockBySafe) public onlyManager {
        require(!activeFounderSeasonBySafe[safe], "Founder season is already active");
        require(_objectiveAmount > 0, "Objective amount must be greater than 0");
        require(_timeUnlockBySafe > 3 days, "Time to achive objective amount must be greater than 0");
        
        activeFounderSeasonBySafe[safe] = true;
        objectiveAmountBySafe[safe] = _objectiveAmount;
        timeUnlockBySafe[safe] = _timeUnlockBySafe;
        
        emit FounserSeasonStarted(safe, _objectiveAmount, _timeUnlockBySafe);
    }

    function crowfundX(address safe, uint256 _amount) public{ //@todo with USDC
        require(activeFounderSeasonBySafe[safe], "Founder season is not active");
        require(_amount > 0, "Amount must be greater than 0");
        require(totalDepositedBySafe[safe] + _amount < objectiveAmountBySafe[safe], "Amount must be less than objective amount");

        SecuredTokenTransfer.transferToken(usdc, msg.sender, _amount);

        founderDepositsbySafe[safe][msg.sender] += _amount;
        totalDepositedBySafe[safe] += _amount;

        emit FounderHasDeposit(safe, msg.sender, _amount);

    }

    //@dev a founder want to get his money back
    function requestRefund(address safe) public {
        require(
            activeFounderSeasonBySafe[safe],
            "Project not marked as revert or delete"
        );
        require(
            timeUnlockBySafe[safe] > block.timestamp,
            "Time to unlock has not passed yet"
        );
        require(
            isLoanPaid(safe),
            "Loan has not been paid yet"
        );
        require(
            founderDepositsbySafe[safe][msg.sender] > 0,
            "Sender has no deposit"
        );
        if(!founderHasWithdrawnBySafe[safe]){
            IPool(aavePool2).withdraw(usdc, type(uint256).max, address(this));
            founderHasWithdrawnBySafe[safe] = true;
        }

        uint256 amount = founderDepositsbySafe[safe][msg.sender];
        totalDepositedBySafe[safe] -= amount;
        founderDepositsbySafe[safe][msg.sender] = 0;
        SecuredTokenTransfer.transferToken(usdc, msg.sender, amount);

        emit MoneyReturnedToFounder(safe, msg.sender, amount);
    }

    function allowsLoanTo(address safe, address onBehalfOf, address asset, uint256 amount) internal{
        GnosisSafe gnosisSafe = GnosisSafe(safe);
        bytes memory data = abi.encodeWithSignature(
            "approveDelegation(address,uint256)",
            onBehalfOf,
            amount
        );
        require(gnosisSafe.execTransactionFromModule(aavePool, 0, data, Enum.Operation.Call),
                "Could not execute transaction");
        bytes memory data2 = abi.encodeWithSignature(
            "supply(address,uint256,address,uint16)",
            asset,
            amount,
            address(safe),//or this??
            0
        );
        require(gnosisSafe.execTransactionFromModule(aavePool,
                0,
                data2,
                Enum.Operation.Call),
                "Could not execute transaction");

    }
    function refoundFounders(address safe) public{
        require(
            !activeFounderSeasonBySafe[safe],
            "Project not marked as revert or delete"
        );

        uint256 amount = founderDepositsbySafe[safe][msg.sender];
        founderDepositsbySafe[safe][msg.sender] = 0;
        SecuredTokenTransfer.transferToken(usdc, msg.sender, amount);

        emit MoneyReturnedToFounder(safe, msg.sender, amount);
    }

    function isLoanPaid(address safe) public view returns(bool){
        (
        uint256 totalCollateralBase,
        uint256 totalDebtBase,
        uint256 availableBorrowsBase,
        uint256 currentLiquidationThreshold,
        uint256 ltv,
        uint256 healthFactor
    ) = IPool(aavePool2).getUserAccountData(address(safe));

        if(totalDebtBase != 0){
            return false;
        }else{
            return true;
        }
        
    }

}
