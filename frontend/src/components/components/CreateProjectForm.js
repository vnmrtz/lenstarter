import React, { useRef, useState, useEffect } from "react";
import "./CreateProjectForm.scss";
import { Web3Modal, useWeb3Modal } from '@web3modal/react'
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { useAccount } from 'wagmi'
import { ethers } from 'ethers'
import { SafeFactory } from '@safe-global/protocol-kit'
import { EthersAdapter } from '@safe-global/protocol-kit'
import { SafeAccountConfig } from '@safe-global/protocol-kit'




export default function VerticalLinearStepper() {

  const steps = [
    {
      label: 'Configure your campaign',
      description: <CreateProjectForm />,
    },
    {
      label: 'Create an ad group',
      description:
        'An ad group contains one or more ads which target a shared set of keywords.',
    },
    {
      label: 'Create an ad',
      description: `Try out different ad text to see what brings in the most customers,
                and learn how to enhance your ads using features like ad extensions.
                If you run into any problems with your ads, find out how to tell if
                they're running and how to resolve approval issues.`,
    },
  ];

  const formRef = useRef(null);
  const [error, setErrors] = useState(null);
  const account = useAccount()

  function setUpEthers() {
    const provider = account.connector.options.getProvider()
    const ethersProvider = new ethers.providers.Web3Provider(provider)
    const signer = ethersProvider.getSigner()
    const ethAdapter = new EthersAdapter({
      ethers,
      signerOrProvider: signer
    })
    return { ethersProvider, signer, ethAdapter}
  }

  async function handleSubmit() {
    console.log("handleSubmit")
    formRef.current.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  }

  async function handleTransfer() {
    return false
  }

  async function handleApprove() {
    return false
  }

  async function handleWalletCreation(event) {
    console.log("handleWalletCreation")
    event.preventDefault();

    const title = event.target.title.value
    const amount = event.target.amount.value
    const expiration = event.target.expiration.value
    const description = event.target.description.value
    console.log(title, amount, expiration, description)
    if(!title || !amount || !expiration || !description) {
      setErrors("Please fill out all fields")
      return false
    } else if (amount < 0) {
      setErrors("Amount must be greater than 0")
      return false
    } else if (expiration < Date.now()) {
      setErrors("Expiration must be in the future")
      return false
    } else {
      setErrors(null)
    }
    const { provider, signer, ethAdapter } = setUpEthers()
    const safeFactory = await SafeFactory.create({ ethAdapter: ethAdapter })
    const safeAccountConfig: SafeAccountConfig = {
      owners: [
        await signer.getAddress()
      ],
      threshold: 1,
      // ... (Optional params)
    }
    console.log(account.address)
    const safe = await safeFactory.deploySafe({safeAccountConfig});
  }


  function CreateProjectForm(props) {
    return (
      <div>
        <div class="w-full h-full max-w-xs">
          <form ref={formRef} onSubmit={handleWalletCreation} class="bg-white ">
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2" for="username">
                What's you lenstarter title
              </label>
              <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="title" type="text" placeholder="Title" />
            </div>
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2" for="username">
                How much money would you like to raise?
              </label>
              <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="amount" type="number" placeholder="USDC" />
            </div>
            <div class="mb-4">
              <label class="block text-gray-700 text-sm font-bold mb-2" for="username">
                Expiration date
              </label>
              <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="expiration" type="date" placeholder="USDC" />
            </div>
            <div class="mb-6">
              <label class="block text-gray-700 text-sm font-bold mb-2" for="password">
                What's your project about?
              </label>
              <textarea class="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="description" type="text" placeholder="Stealing money from north korea" />
            </div>
            {error && <p class="text-red-500 text-xs italic">{error}</p>}
          </form>
        </div>
      </div>
    );
  }


  const [activeStep, setActiveStep] = React.useState(0);

  const next = () => setActiveStep((prevActiveStep) => prevActiveStep + 1);

  const handleNext = async () => {
    if (activeStep === 0) {
      handleSubmit();
    } else if (activeStep === 1) {
      handleTransfer()
    } else if (activeStep === 2) {
      handleApprove()
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <Box className="create-form shadow-md rounded px-8 pt-6 pb-8 mb-4" sx={{ maxWidth: 400 }}>
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel
              optional={
                index === 2 ? (
                  <Typography variant="caption">Last step</Typography>
                ) : null
              }
            >
              {step.label}
            </StepLabel>
            <StepContent>
              <Typography>{step.description}</Typography>
              <Box sx={{ mb: 2 }}>
                <div>
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    {index === steps.length - 1 ? 'Finish' : 'Continue'}
                  </Button>
                  <Button
                    disabled={index === 0}
                    onClick={handleBack}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Back
                  </Button>
                </div>
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length && (
        <Paper square elevation={0} sx={{ p: 3 }}>
          <Typography>All steps completed - you&apos;re finished</Typography>
          <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
            Reset
          </Button>
        </Paper>
      )}
      <br />
      <p class="copyright text-center text-gray-500 text-xs">
        &copy;2023 Lenstarter. All rights reserved.
      </p>
    </Box>

  );
}