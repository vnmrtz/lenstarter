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
            title: "Project 1",            
            owner: "0x408BcC04d5234699dE68852fe377d36e3ebF59bd",
            imageURL: "https://images.unsplash.com/photo-1683844399879-0122f0dffda6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1365&q=80",
            id : 1,
            expiresAt: "2021-10-15T00:00:00.000Z",
            raised: 0,
            cost: 100,
            backing: 0
        }
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
                            <p>Support creators with a credit line . Share their future revnue</p>
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
                        <source src="./assets/landing.mp4" type="video/mp4" />
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