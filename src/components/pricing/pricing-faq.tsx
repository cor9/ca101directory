import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const pricingFaqData = [
  {
    id: "item-1",
    question: "What's included in the Free plan?",
    answer:
      "Our Free plan is perfect for beginners. It includes one dofollow link to boost your SEO, a permanent link with backlink maintenance, and review within 48 hours. However, it's limited to one dofollow link, requires a backlink to our site, and doesn't include customer support.",
  },
  {
    id: "item-2",
    question: "What are the benefits of the Pro plan?",
    answer:
      "The Pro plan offers at least 2 dofollow links, inclusion within 24 hours with no queue, permanent links without backlink requirements, featured listings, premium customer support, and sharing through social media and newsletters. It's designed for users who need more comprehensive features and faster service.",
  },
  {
    id: "item-3",
    question: "How much does the Pro plan cost?",
    answer:
      "The Pro plan is priced at $9.90. This plan offers significant advantages over the Free plan, including multiple dofollow links, faster inclusion, and premium support.",
  },
  {
    id: "item-4",
    question:
      "Is there a difference in review time between Free and Pro plans?",
    answer:
      "Yes, there is. Free plan submissions are reviewed within 48 hours, while Pro plan submissions are included within 24 hours and don't have to wait in a queue. This faster turnaround time is one of the key benefits of the Pro plan.",
  },
  {
    id: "item-5",
    question: "Do I need to provide a backlink for my listing?",
    answer:
      "For the Free plan, a backlink to our site is required. However, if you choose the Pro plan, you get a permanent link without any backlink requirement. This gives Pro users more flexibility in their link strategy.",
  },
];

export function PricingFaq() {
  return (
    <Accordion type="single" collapsible className="w-full">
      {pricingFaqData.map((faqItem) => (
        <AccordionItem key={faqItem.id} value={faqItem.id}>
          <AccordionTrigger>{faqItem.question}</AccordionTrigger>
          <AccordionContent className="text-sm text-muted-foreground sm:text-[15px]">
            {faqItem.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
