# Architecture rules
- Keep traffic provider initialization and privacy-safe event dispatch in `src/lib/traffic.ts`; one shared gate prevents duplicate tags and inconsistent permissions.
- Use `tracking-consent.ts` as the permission source and retain versioned local choices; analytics and advertising must remain independent.
- Mount the consent interface once inside the router and expose its settings from the footer so withdrawal is available on every page.
- Never include form values or query parameters in analytics events, and leave unverified advertising identifiers unset.