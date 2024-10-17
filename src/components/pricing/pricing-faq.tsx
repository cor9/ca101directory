import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PRICE_FAQ } from "@/config/price";

export function PricingFaq() {
  return (
    <Accordion type="single" collapsible className="w-full">
      {PRICE_FAQ.map((faqItem) => (
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
