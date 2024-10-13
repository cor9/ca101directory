import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PRICING_FAQ } from "@/config/price-plan";

export function PricingFaq() {
  return (
    <Accordion type="single" collapsible className="w-full">
      {PRICING_FAQ.map((faqItem) => (
        <AccordionItem key={faqItem.id} value={faqItem.id}>
          <AccordionTrigger className="text-base">{faqItem.question}</AccordionTrigger>
          <AccordionContent className="text-base text-muted-foreground whitespace-pre-wrap">
            {faqItem.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
