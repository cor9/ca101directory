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

interface SubmitStepperProps {
    initialStep?: number;
}

export function SubmitStepper({ initialStep = 1 }: SubmitStepperProps) {
    const [currentStep, setCurrentStep] = useState(initialStep);

    // TODO(javayhu): change number indicators to icons
    const steps = [
        { title: "Details", description: "Enter product information" },
        { title: "Pricing", description: "Select pricing plan" },
        { title: "Publish", description: "Publish your product" },
    ];

    return (
        <Stepper>
            {steps.map((step, index) => (
                <React.Fragment key={index}>
                    <StepperItem step={index + 1}>
                        {/* disable click on stepper trigger */}
                        <StepperTrigger
                            // onClick={() => setCurrentStep(index + 1)}
                            active={currentStep === index + 1}
                            className='cursor-default'
                        >
                            <StepperIndicator
                                completed={currentStep > index + 1}
                                active={currentStep === index + 1}
                            >
                                {index + 1}
                            </StepperIndicator>
                            <div>
                                <StepperTitle>
                                    {step.title}
                                </StepperTitle>
                                {/* hidden on mobile, to make separator visible */}
                                <StepperDescription className='hidden md:block'>
                                    {step.description}
                                </StepperDescription>
                            </div>
                        </StepperTrigger>
                    </StepperItem>
                    {index < steps.length - 1 && (
                        <StepperSeparator completed={currentStep > index + 1} />
                    )}
                </React.Fragment>
            ))}
        </Stepper>
    )
}