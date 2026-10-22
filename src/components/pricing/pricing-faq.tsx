import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqConfig } from "@/config/faq";

export function PricingFaq() {
  return (
    <Accordion type="single" collapsible className="w-full">
      {faqConfig.items.map((faqItem) => (
        <AccordionItem
          key={faqItem.id}
          value={faqItem.id}
          className="border-canvas-line"
        >
          <AccordionTrigger className="text-base text-ink hover:text-brass-dark">
            <div className="text-left w-full font-semibold">
              {faqItem.question}
            </div>
          </AccordionTrigger>
          <AccordionContent className="text-base text-ink-soft whitespace-pre-wrap [&_a]:text-brass-dark [&_a]:underline">
            {/* {faqItem.answer} */}
            {/* biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation> */}
            <div dangerouslySetInnerHTML={{ __html: faqItem.answer }} />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
