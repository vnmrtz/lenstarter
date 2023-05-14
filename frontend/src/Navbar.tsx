import { Web3Button } from "@web3modal/react";
import React from "react";

function Navbar() {
    return (
        <div className="flex w-full flex-row navbar">
                <div className="flex-1 flex justify-start font-light">
                    <div className="m-3 ml-8 flex">
                        <a href={`/about`}>Discover</a>
                    </div>
                    <div className="m-3 flex">
                        <a href="/newproject">Start a Project</a>
                    </div>
                </div>
                <div className="m-3 flex-1 flex justify-center font-black">
                    <a href="/"><h2>LENSTARTER</h2></a>
                </div>
                <div className="flex-1">
                    <div className="m-3 navbar-tag flex justify-end">
                        <Web3Button />
                    </div>
                </div>
        </div>
    )
}

export default Navbar;