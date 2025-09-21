# GUARDRAILS.md

## ✅ Allowed

- **Airtable Integration**: Use `src/lib/airtable.ts` and `src/data/airtable-item.ts` for all data operations
- **Airtable as ONLY CMS**: No Sanity, Supabase, or other databases
- **Child Actor 101 Branding**: Use defined colors (#FF6B35, #004E89, #F7931E) and Inter font
- **Stripe Checkout**: Use configured payment plans from `src/config/price.ts`
- **Slug Routing**: Use slug parameter for listing detail pages
- **Approved Listings Only**: Only display listings with `Status: Approved`
- **Mobile-First Design**: Responsive, parent-friendly interface
- **Environment Variables**: Use proper env vars for API keys and configuration

## 🚫 Forbidden

- **NO Sanity Dependencies**: Do not import or use any Sanity-related code
- **NO Static JSON Files**: Do not generate or suggest static content files
- **NO Hardcoded Keys**: Do not hardcode Stripe keys, API keys, or sensitive data
- **NO Database Models**: Do not use Prisma, SQL, or other database ORMs
- **NO Auto-Approval**: Do not automatically approve vendor submissions
- **NO Login Required**: Do not add authentication barriers for vendors
- **NO Review/Rating Features**: Do not add review systems without explicit approval
- **NO Blog Functionality**: Blog features are disabled during Sanity migration

## 🧠 Brand & UX Guidelines

### Design Principles
- **Minimal & Clean**: Simple, uncluttered interface
- **Mobile-First**: Optimize for mobile devices first
- **Parent-Friendly**: Language and design for non-tech-savvy parents
- **Child-Safe**: All content must be appropriate for youth acting

### Visual Elements
- **Icons**: Friendly, colorful, not corporate
- **Colors**: Use Child Actor 101 color palette consistently
- **Typography**: Inter font for readability
- **Cards**: Include logo, name, tagline, and clear CTA

### User Experience
- **One-Page Checkout**: Simple Stripe checkout flow
- **Clear Navigation**: Easy to find categories and listings
- **Trust Signals**: "101 Approved" badges and verification status
- **Contact Flow**: Direct communication with professionals

## 🧪 Development Guidelines

### Code Standards
- **TypeScript**: Use proper typing throughout
- **Error Handling**: Graceful fallbacks for missing data
- **Performance**: Optimize for fast loading and good UX
- **Accessibility**: Follow WCAG guidelines

### Data Handling
- **Airtable First**: All content comes from Airtable
- **Conditional Loading**: Handle missing API keys gracefully
- **Caching**: Implement appropriate caching strategies
- **Error States**: Show meaningful error messages

### Security
- **Environment Variables**: Never commit sensitive data
- **API Keys**: Use proper environment variable management
- **Input Validation**: Validate all user inputs
- **HTTPS Only**: Ensure all connections are secure

## 🚀 Future Considerations

### Planned Features
- **Stripe Webhooks**: Automated payment processing
- **Vendor Authentication**: Supabase auth for vendors
- **Admin Dashboard**: Replace Airtable-only admin workflow
- **Advanced Search**: Location-based filtering
- **Booking System**: Integrated scheduling

### Technical Debt
- **Sanity Cleanup**: Complete removal of Sanity dependencies
- **Component Updates**: Update remaining components for Airtable
- **Type Safety**: Ensure all Airtable data is properly typed
- **Testing**: Add comprehensive test coverage

## 📋 Current Limitations

- **No Real-time Updates**: Airtable changes require manual refresh
- **No User Accounts**: Vendors cannot manage their own listings
- **No Payment Automation**: Manual approval process required
- **Limited Search**: Basic filtering only
- **No Reviews**: No user feedback system

## 🎯 Success Metrics

- **Page Load Speed**: < 3 seconds on mobile
- **Conversion Rate**: > 5% checkout completion
- **User Engagement**: > 2 minutes average session
- **Mobile Usage**: > 70% mobile traffic
- **Parent Satisfaction**: Positive feedback on ease of use