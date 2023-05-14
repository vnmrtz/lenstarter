import React from "react";
import { useParams } from "react-router-dom";
import "./ProjectView.scss";
import { daysRemaining, truncate } from './components/store'
import Donation from "./components/Donation";

export default function ProjectView() {
    const project = {
        title: "Project 1",
        owner: "0x408BcC04d5234699dE68852fe377d36e3ebF59bd",
        imageURL: "https://images.unsplash.com/photo-1683844399879-0122f0dffda6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1365&q=80",
        id: 1,
        expiresAt: "2021-10-15T00:00:00.000Z",
        raised: 0,
        cost: 100,
        backing: 0
    }
    const { id } = useParams<{ id: string }>();
    return (
        <div className="project-wrapper">
            <div className="project-head">
                <div className="left">
                    <div className="wrapper dark:!bg-navy-800 shadow-shadow-500 shadow-3xl rounded-primary relative w-full flex h-full w-full flex-col items-center bg-white bg-cover bg-clip-border p-[16px] dark:text-white dark:shadow-none">
                        <div className="relative mt-1 flex h-32 w-full justify-center rounded-xl bg-cover" >
                            <div className="absolute -bottom-12 flex h-[88px] w-[88px] items-center justify-center rounded-full border-[4px] border-white bg-pink-400">
                                <img className="h-full w-full rounded-full" src="https://i.ibb.co/6YbS9ff/avatar11.png" alt="" />
                            </div>
                        </div>
                        <div className="mt-16 flex flex-col items-center">
                            <h4 className="text-black text-xl font-bold">Adela Parkson</h4>
                            <p className="text-gray-500 text-base font-normal">Product Manager</p>
                        </div>
                        <div className="mt-6 mb-3 flex gap-4 md:!gap-14">
                            <div className="flex flex-col items-center justify-center">
                                <h3 className="text-black text-2xl font-bold">17</h3>
                                <p className="text-gray-500 text-sm font-normal">Posts</p>
                            </div>
                            <div className="flex flex-col items-center justify-center">
                                <h3 className="text-black text-2xl font-bold">9.7K</h3>
                                <p className="text-gray-500 text-sm font-normal">Followers</p>
                            </div>
                            <div className="flex flex-col items-center justify-center">
                                <h3 className="text-black text-2xl font-bold">434</h3>
                                <p className="text-gray-500 text-sm font-normal">Following</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="right">
                    <div className="card">
                        <div className="w-full bg-gray-300 rounded-full">
                            <div
                                className="bg-green-600 text-xs font-medium text-green-100 text-center
                                p-0.5 leading-none rounded-l-full h-1"
                                style={{ width: `${(project.raised / project.cost) * 100}%` }}
                            ></div>
                        </div>

                        <div className="card-header">
                            <h1>{project.raised} USDC</h1>
                        </div>
                        <div className="card-body">
                            pledged of {project.cost} USDC goal
                        </div>
                        <div className="backers">
                            <h1>{project.backing}</h1>
                            <h2>Backers</h2>
                        </div>
                        <div className="expiration">
                            <small className="text-gray-500">
                                {new Date().getTime() > Number(project.expiresAt + '000')
                                    ? 'Expired'
                                    : daysRemaining(project.expiresAt)}{' '}
                                left
                            </small>
                            <h1>Expiration Date</h1>
                            <h2 className="text-gray-500">12/12/2021</h2>

                        </div>
                        <div className="actions">
                            <div className="action-row">
                                <button className="w-full bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Deposit</button>

                                <div className="h-full ml-4 row-right">
                                    <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="amount" type="number" placeholder="USDC" />
                                </div>
                            </div>
                            <button className="w-full bg-purple-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Withdraw</button>
                            <button className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Share</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="project-body">
                <Donation />
            </div>
        </div>
    )
}