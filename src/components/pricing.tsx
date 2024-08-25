'use client';

import { HeaderSection } from "./shared/header-section";
import MaxWidthWrapper from "./shared/max-width-wrapper";

/**
 * TODO: other info: https://preview.tailus.io/astrolus/
 */
export default function Pricing() {

    const plan = {
        name: "One-Time Submit",
        desc: "Pay once to submit your product",
        price: 9.9,
        isMostPop: true,
        features: [
            "Pay once",
            "Instant listing",
            "Permanent link",
            "Refundable if not used",
        ],
    }

    const features = [
        {
            name: "Pay Once",
            desc: "Pay once for one product, get listed permanently",
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-dollar-sign"><circle cx="12" cy="12" r="10" /><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" /><path d="M12 18V6" /></svg>
        },
        {
            name: "Instant Listing",
            desc: "No waiting, listed immediately after submit",
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-zap"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" /></svg>

        },
        {
            name: "Permanent Link",
            desc: "A dofollow link is always active to your product",
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-link-2"><path d="M9 17H7A5 5 0 0 1 7 7h2" /><path d="M15 7h2a5 5 0 1 1 0 10h-2" /><line x1="8" x2="16" y1="12" y2="12" /></svg>
        },
        {
            name: "Refundable",
            desc: "Secure payment, get a refund if not used",
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-shield-check"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" /><path d="m9 12 2 2 4-4" /></svg>
        },
    ]

    return (
        <MaxWidthWrapper>
            <section className='relative py-8'>
                <HeaderSection label="Pricing" title="Start growing at full speed" />

                {/* center the pricing section */}
                <div className="mt-16 w-full flex items-center justify-center">
                    <div className='gap-8 md:flex md:items-center'>
                        {/* features on the left or top */}
                        <ul className="space-y-10">
                            {
                                features.map((item, idx) => (
                                    <li key={idx} className="flex gap-x-3">
                                        {/* bg-indigo-50 */}
                                        <div className="flex-none w-12 h-12 rounded-full text-indigo-600 flex items-center justify-center">
                                            {item.icon}
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-medium">
                                                {item.name}
                                            </h4>
                                            <p className="mt-2 text-muted-foreground md:text-sm">
                                                {item.desc}
                                            </p>
                                        </div>
                                    </li>
                                ))
                            }
                        </ul>

                        {/* pricing on the right or bottom */}
                        <div className="mt-16 md:mt-0 flex flex-col rounded-xl border border-x-none shadow-lg">

                            {/* pricing & call to action button */}
                            <div className="p-8 border-b">
                                <div className="flex items-center justify-between gap-4">
                                    <div className="max-w-xs">
                                        <span className='text-xl font-semibold sm:text-3xl'>
                                            {plan.name}
                                        </span>
                                        <p className="mt-3 text-muted-foreground sm:text-sm">
                                            {plan.desc}
                                        </p>
                                    </div>
                                    <div className='text-5xl font-bold text-indigo-600'>
                                        ${plan.price}
                                    </div>
                                </div>
                                <button className='mt-8 px-3 py-3 rounded-lg w-full font-semibold text-sm duration-150 text-white bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700'>
                                    Get Started
                                </button>
                            </div>

                            {/* simplified features on the bottom */}
                            <ul className='p-4 space-y-3 sm:grid sm:grid-cols-2 md:block md:p-8 lg:grid'>
                                <div className="pb-2 col-span-2 font-medium">
                                    <p>Features</p>
                                </div>
                                {/* TODO: fix stroke-width  */}
                                {/* Warning: Invalid DOM property `stroke-width`. Did you mean `strokeWidth`? */}
                                {
                                    plan.features.map((featureItem, idx) => (
                                        <li key={idx} className='flex items-center gap-4'>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-check text-indigo-600"><path d="M20 6 9 17l-5-5" /></svg>
                                            {featureItem}
                                        </li>
                                    ))
                                }
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        </MaxWidthWrapper>
    );
};