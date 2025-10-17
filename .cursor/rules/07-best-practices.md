# Best Practices

### Code Quality
- One purpose per component  
- Use server components when possible  
- Always type with `interface` or `type` definitions  
- Reuse logic through `/lib` utilities  

### Performance
- Lazy-load heavy components  
- Optimize Supabase queries with proper indexes  
- Use Vercel Edge caching where safe  

### Styling
- Follow **Bauhaus styling guide**  
- No light text on light backgrounds  
- No dark text on navy background  
- Use Tailwind utility classes, not inline styles  

### Workflow
- Run `pnpm lint && pnpm format` before committing  
- Write meaningful commit messages  
- Update `/for cursor/context_decisions.md` after every major modification
