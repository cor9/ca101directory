export default function VendorTestimonials() {
  const testimonials = [
    {
      quote:
        "Since listing, I've booked three new families a month — all from this directory.",
      author: "Sarah Martinez",
      role: "Acting Coach",
      location: "Los Angeles",
    },
    {
      quote:
        "The quality of leads I get from Child Actor 101 is unmatched. Parents trust this platform.",
      author: "Michael Chen",
      role: "Headshot Photographer",
      location: "New York",
    },
    {
      quote:
        "My business has grown 40% since joining. The featured placement really works.",
      author: "Jennifer Walsh",
      role: "Voice Coach",
      location: "Chicago",
    },
  ];

  return (
    <div>
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4 text-charcoal">
          What Our Vendors Say
        </h2>
        <p className="text-lg text-charcoal/70 max-w-2xl mx-auto">
          Real results from professionals who trust our platform
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {testimonials.map((testimonial, index) => (
          <div
            key={`testimonial-${testimonial.author}`}
            className="bg-cream border border-cream rounded-xl p-6 hover:shadow-lg transition-all duration-300"
          >
            <div className="mb-4">
              <svg
                className="w-8 h-8 text-retro-blue mb-4"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z" />
              </svg>
            </div>
            <blockquote className="text-charcoal/80 mb-6 italic">
              "{testimonial.quote}"
            </blockquote>
            <div className="border-t border-charcoal/10 pt-4">
              <div className="font-semibold text-charcoal">
                {testimonial.author}
              </div>
              <div className="text-sm text-charcoal/60">{testimonial.role}</div>
              <div className="text-sm text-charcoal/60">
                {testimonial.location}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
