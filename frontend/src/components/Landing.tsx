import React from "react";
import './Landing.scss';
import { styled, alpha } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';
import Box from "./components/Box";
import LandingBottom from "./components/LandingBottom";


export default function Landing() {
    const Search = styled('div')(({ theme }) => ({
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: alpha(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: alpha(theme.palette.common.white, 0.25),
        },
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(1),
            width: 'auto',
        },
    }));

    const SearchIconWrapper = styled('div')(({ theme }) => ({
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    }));

    const StyledInputBase = styled(InputBase)(({ theme }) => ({
        color: 'inherit',
        '& .MuiInputBase-input': {
            padding: theme.spacing(1, 1, 1, 0),
            // vertical padding + font size from searchIcon
            paddingLeft: `calc(1em + ${theme.spacing(4)})`,
            transition: theme.transitions.create('width'),
            width: '100%',
            [theme.breakpoints.up('sm')]: {
                width: '12ch',
                '&:focus': {
                    width: '20ch',
                },
            },
        },
    }));

    const projects = [
        {
            title: "pepe.lens",            
            owner: "0x583e367ABd6600f65142dEa4E34B6A7363310829",
            imageURL: "https://i3.wp.com/static.news.bitcoin.com/wp-content/uploads/2023/04/pepes.jpg?ssl=1",
            id : 1,
            expiresAt: "2023-10-15T00:00:00.000Z",
            raised: 500,
            cost: 1000,
            backing: 100
        },
        {
            title: "rafatatay.lens",            
            owner: "0x583e367ABd6600f65142dEa4E34B6A7363310829",
            imageURL: "https://comunica2.webs.upv.es/wp-content/uploads/2021/09/RafaTatay-1.jpeg",
            id : 1,
            expiresAt: "2021-10-15T00:00:00.000Z",
            raised: 0,
            cost: 100,
            backing: 0
        },{
            title: "stani.lens",            
            owner: "0xd75479f1AC78639249C92E811EEc42d985342516",
            imageURL: "https://pbs.twimg.com/profile_images/1621437030403014656/hrFnFkBw_400x400.jpg",
            id : 1,
            expiresAt: "2024-10-15T00:00:00.000Z",
            raised: 345,
            cost: 999,
            backing: 0
        },
        {
            title: "spiderman.lens",            
            owner: "0xe491127255c049efD0028E9E557A94A49c4c5B24",
            imageURL: "https://images.unsplash.com/photo-1683844399879-0122f0dffda6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1365&q=80",
            id : 1,
            expiresAt: "2021-10-15T00:00:00.000Z",
            raised: 100,
            cost: 100,
            backing: 0
        },
        {
            title: "cobie.lens",            
            owner: "0x72cBcd927B93Ad6d8c57A8eD2e4f449E6ca0eca5",
            imageURL: "https://images.unsplash.com/photo-1683844399879-0122f0dffda6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1365&q=80",
            id : 1,
            expiresAt: "2021-10-15T00:00:00.000Z",
            raised: 100,
            cost: 100,
            backing: 0
        },

    ]

    return (
        <div className="landing-wrapper">
            <div className="landing">
                <div className="landing-top-section">
                    <div className="block">
                        <div className="landing-top-titles">
                            <h1>Use your Lens handle <br />
                                Kickstart your career
                            </h1>
                            <p>Support creators with a credit line . Share their future revenue</p>
                        </div>
                        <div className="search">
                            <Search>
                                <SearchIconWrapper>
                                    <SearchIcon className="icon" />
                                </SearchIconWrapper>
                                <StyledInputBase className="search-input"
                                    placeholder="Search…"
                                    inputProps={{ 'aria-label': 'search' }}
                                />
                            </Search>
                        </div>
                    </div>
                    <div className="block right">
                        <img src="https://files.readme.io/c2459de-illustration_grow.svg" />
                    </div>
                </div>
                <div className="landing-bottom-section">
                    <div className="landing-bottom-stats">
                        <Box middle="1" bottom="Projects founded" />
                        <Box middle="0" bottom="Towards Creative work" />
                        <Box middle="3" bottom="Creators" />
                    </div>
                </div>
            </div>
            <div className="landing-bottom">
                <LandingBottom projects={projects}/>
            </div>
        </div>
    )
}