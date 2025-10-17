"use client";

import Container from "@/components/container";
import { faqConfig } from "@/config/faq";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { useState } from "react";

export default function HomeFAQ() {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggleItem = (id: string) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id);
    } else {
      newOpenItems.add(id);
    }
    setOpenItems(newOpenItems);
  };

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <Container>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-surface mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-surface max-w-2xl mx-auto">
            Get answers to common questions about our directory and services
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="space-y-4">
            {faqConfig.items.map((item) => {
              const isOpen = openItems.has(item.id);
              return (
                <div
                  key={item.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => toggleItem(item.id)}
                    className="w-full px-6 py-4 text-left bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-between"
                  >
                    <span className="font-semibold text-surface">
                      {item.question}
                    </span>
                    {isOpen ? (
                      <ChevronUpIcon className="h-5 w-5 text-surface" />
                    ) : (
                      <ChevronDownIcon className="h-5 w-5 text-surface" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-surface leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
