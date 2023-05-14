// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";
import "../src/FounderTansfersModule.sol";
import "../src/LensActionGuard.sol";

contract DeployModuleAndGuardian is Script {
    function setUp() public {}

    function run() public {
        uint256 deployPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployPrivateKey);
        FounderTansfersModule founderTansfersModule = new FounderTansfersModule(address(vm));
        console.log("FounderTansfersModule address: %s", address(founderTansfersModule));
        LensActionGuard lensActionGuard = new LensActionGuard();
        console.log("LensActionGuard address: %s", address(lensActionGuard));
        vm.broadcast();
    }
}
