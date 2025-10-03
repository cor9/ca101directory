export default function VendorValueProps() {
  const valueProps = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: "Reach 12k+ engaged families",
      description: "Connect with parents actively seeking acting professionals for their children"
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Build trust with parents",
      description: "Showcase your credentials and get verified by our team to build credibility"
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      title: "Grow your business with featured placements",
      description: "Get priority visibility and premium positioning to attract more clients"
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-r from-retro-blue/5 to-tomato-red/5">
      <Container>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-charcoal">Why List With Us</h2>
          <p className="text-lg text-charcoal/70 max-w-2xl mx-auto">
            Join thousands of professionals who trust us to connect them with families
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {valueProps.map((prop, index) => (
            <div key={`value-prop-${prop.title}`} className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-retro-blue to-tomato-red rounded-full mb-6 text-cream">
                {prop.icon}
              </div>
              <h3 className="text-xl font-semibold mb-4 text-charcoal">{prop.title}</h3>
              <p className="text-charcoal/70">{prop.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
