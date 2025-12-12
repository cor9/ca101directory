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
          className="border-secondary-denim/30"
        >
          <AccordionTrigger className="text-base text-paper hover:text-bauhaus-blue">
            <div className="text-left w-full bauhaus-heading">
              {faqItem.question}
            </div>
          </AccordionTrigger>
          <AccordionContent className="text-base text-paper bauhaus-body whitespace-pre-wrap">
            {/* {faqItem.answer} */}
            {/* biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation> */}
            <div dangerouslySetInnerHTML={{ __html: faqItem.answer }} />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
