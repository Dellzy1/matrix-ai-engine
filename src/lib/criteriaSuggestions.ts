export type Suggestion = { name: string; isInverted: boolean };

// Each rule matches words in the decision title and suggests criteria.
// Suggestions are starting points only. The user adds, edits, or ignores them.
const RULES: { match: RegExp; items: Suggestion[] }[] = [
  {
    match: /hire|job|offer|salary|role|career|employee|contractor|agency/i,
    items: [
      { name: "Pay and benefits", isInverted: false },
      { name: "Growth opportunity", isInverted: false },
      { name: "Work-life balance", isInverted: false },
      { name: "Commute or location", isInverted: true },
      { name: "Company stability", isInverted: false },
    ],
  },
  {
    match: /vendor|supplier|provider|tool|software|saas|platform|app/i,
    items: [
      { name: "Price", isInverted: true },
      { name: "Ease of use", isInverted: false },
      { name: "Support quality", isInverted: false },
      { name: "Integration with existing tools", isInverted: false },
      { name: "Security and compliance", isInverted: false },
    ],
  },
  {
    match: /build|buy|in-house|outsource/i,
    items: [
      { name: "Upfront cost", isInverted: true },
      { name: "Time to deliver", isInverted: true },
      { name: "Control and customisation", isInverted: false },
      { name: "Long-term maintenance", isInverted: true },
    ],
  },
  {
    match: /invest|money|loan|savings|purchase|expense/i,
    items: [
      { name: "Expected return", isInverted: false },
      { name: "Risk of loss", isInverted: true },
      { name: "Fees and conditions", isInverted: true },
      { name: "How quickly I can access the money", isInverted: false },
    ],
  },
  {
    match: /business|startup|idea|launch|market|product/i,
    items: [
      { name: "Demand for the product", isInverted: false },
      { name: "Startup cost", isInverted: true },
      { name: "Time to first revenue", isInverted: true },
      { name: "Competition", isInverted: true },
    ],
  },
  {
    match: /study|school|course|university|program|degree|certificate/i,
    items: [
      { name: "Tuition and total cost", isInverted: true },
      { name: "Career relevance", isInverted: false },
      { name: "Time commitment", isInverted: true },
      { name: "Reputation of the institution", isInverted: false },
    ],
  },
  {
    match: /move|relocate|city|country|location/i,
    items: [
      { name: "Cost of living", isInverted: true },
      { name: "Career opportunities", isInverted: false },
      { name: "Safety", isInverted: false },
      { name: "Distance from family and friends", isInverted: true },
    ],
  },
];

export function suggestCriteria(title: string): Suggestion[] {
  const seen = new Set<string>();
  const out: Suggestion[] = [];
  for (const rule of RULES) {
    if (!rule.match.test(title)) continue;
    for (const item of rule.items) {
      const key = item.name.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(item);
    }
  }
  return out.slice(0, 6);
}