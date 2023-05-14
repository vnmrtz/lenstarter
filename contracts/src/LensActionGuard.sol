import "../lib/safe-contracts/contracts/base/GuardManager.sol";
import "../lib/safe-contracts/contracts/Safe.sol";
import "./LensDataTypes.sol";
interface ISafe {
    function getOwners() external view returns (address[] memory);
}

contract LensActionGuard is BaseGuard{

    address public owner;
    address public lensHub = 0xDb46d1Dc155634FbC732f92E853b10B288AD5a1d ;  //Matic address  
    mapping(bytes4 => bool) public profileIdMap;

    constructor(){
        owner = msg.sender;
        profileIdMap[0xa5363627] = true; //a5363627  =>  post(address) 
        profileIdMap[0xfb78ae6c] = true; //fb78ae6c  =>  follow(uint256[],bytes[]) 
        profileIdMap[0xa768079b] = true; //a768079b  =>  mirror(address) 
             
    }

    struct PostData {
        uint256 profileId;
        string contentURI;
        address collectModule;
        bytes collectModuleInitData;
        address referenceModule;
        bytes referenceModuleInitData;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function.");
        _;
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
        bytes4 functionSelector = bytesToBytes4(data, 0);

        for (uint256 i = 0; i < owners.length; i++) {
            if (owners[i] == msgSender) {
                if (to != address(lensHub) || !isValidFunction(functionSelector)) {
                    revert("msg sender is not allowed to exec");
                }    
            }
        }
        
    }

    function bytesToBytes4(bytes memory b, uint256 offset) private pure returns (bytes4 result) {
        assembly {
            result := mload(add(b, add(0x20, offset)))
        }
    }
    function isValidFunction(bytes4 functionSelector) internal view returns (bool) {
        bytes32 sigHash = keccak256(abi.encodePacked(functionSelector));
        return profileIdMap[bytesToBytes4(sigHash,0)];
    }

    function checkAfterExecution(bytes32 txHash, bool success) external view override {}

    function addProfileId(string memory profileId) external onlyOwner {
        bytes4 profileIdBytes = bytes4(keccak256(abi.encodePacked(profileId)));
        profileIdMap[bytes4(keccak256(bytes(profileId)))] = true;

    }

}