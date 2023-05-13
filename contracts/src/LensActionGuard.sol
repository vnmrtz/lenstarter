import "../lib/safe-contracts/contracts/base/GuardManager.sol";
import "../lib/safe-contracts/contracts/Safe.sol";
import {DataTypes} from "./LensDataTypes.sol";
interface ISafe {
    function getOwners() external view returns (address[] memory);
}

contract LensActionGuard is BaseGuard{

    address public lensHub = 0xDb46d1Dc155634FbC732f92E853b10B288AD5a1d ;  //Matic address  

    struct PostData {
        uint256 profileId;
        string contentURI;
        address collectModule;
        bytes collectModuleInitData;
        address referenceModule;
        bytes referenceModuleInitData;
    }

    function checkTransaction(
        address to,
        uint256 value,
        bytes memory data,
        Enum.Operation operation,
        uint256 safeTxGas,
        uint256 baseGas,
        uint256 gasPrice,
        address gasToken,
        address payable refundReceiver,
        bytes memory signatures,
        address msgSender
    ) external {
        address[] memory owners = ISafe(msg.sender).getOwners();
        for (uint256 i = 0; i < owners.length; i++) {
            if (owners[i] == msgSender) {
                return;
            }
        }
        
        bytes32 expectedSelector = keccak256(abi.encodePacked("post(uint256,string,address,bytes,address,bytes)"));
        bytes4 functionSelector = bytesToBytes4(data, 0);

        // msg sender is not an owner
        revert("msg sender is not allowed to exec");
        if (to != address(lensHub) || bytes4(expectedSelector) != bytes4(functionSelector)) {
            revert("msg sender is not allowed to exec");
        } 
    }

    function bytesToBytes4(bytes memory b, uint256 offset) private pure returns (bytes4 result) {
        assembly {
            result := mload(add(b, add(0x20, offset)))
        }
    }
    function checkAfterExecution(bytes32 txHash, bool success) external view override {}
}