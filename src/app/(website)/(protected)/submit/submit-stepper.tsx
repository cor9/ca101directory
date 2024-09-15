'use client'

import React, { useState } from 'react';
import {
    Stepper,
    StepperItem,
    StepperTrigger,
    StepperIndicator,
    StepperTitle,
    StepperDescription,
    StepperSeparator,
} from "@/components/stepper";

interface StepData {
    title: string;
    description: string;
}

interface SubmitStepperProps {
    initialStep?: number;
}

export function SubmitStepper({ initialStep = 1 }: SubmitStepperProps) {
    const [currentStep, setCurrentStep] = useState(initialStep);

    const steps = [
        { title: "Submit", description: "Submit product details" },
        { title: "Pay", description: "Pay for listing" },
        { title: "Publish", description: "Publish your product" },
    ];

    return (
        <Stepper>
            {steps.map((step, index) => (
                <React.Fragment key={index}>
                    <StepperItem step={index + 1}>
                        <StepperTrigger onClick={() => setCurrentStep(index + 1)}>
                            <StepperIndicator completed={currentStep > index + 1}>
                                {index + 1}
                            </StepperIndicator>
                            <div className="text-center px-4">
                                <StepperTitle>{step.title}</StepperTitle>
                                <StepperDescription 
                                    className='hidden md:block mt-1'>
                                    {step.description}
                                </StepperDescription>
                            </div>
                        </StepperTrigger>
                    </StepperItem>
                    {index < steps.length - 1 && <StepperSeparator />}
                </React.Fragment>
            ))}
        </Stepper>
    )
}