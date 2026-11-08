export type ChecklistCategory = "career" | "business" | "money";

export const CHECKLISTS: Record<ChecklistCategory, { label: string; prompts: string[] }> = {
  career: {
    label: "Career",
    prompts: [
      "What skills will this role build that you'll still use in five years?",
      "What do you give up in income, time, or location to take it?",
      "What would you do if it didn't work out after six months?",
      "Does this role fit the work you want to be doing, or only the title?",
      "Who do you trust to give you an honest view of this choice?",
    ],
  },
  business: {
    label: "Business",
    prompts: [
      "How will your first paying customers find you?",
      "How much cash do you need before income starts, and how long will it last?",
      "What would make you stop, and have you decided that in advance?",
      "Have you tested demand with real people, or only with your own belief in the idea?",
      "What part of this do you not understand yet?",
    ],
  },
  money: {
    label: "Money",
    prompts: [
      "Can you afford to lose this amount without affecting essentials?",
      "What fees, lock-in periods, or conditions apply, and have you read them?",
      "How long could your savings cover you without any income?",
      "Where does the money come from if this doesn't pay back?",
      "Who benefits if you say yes, and are they being open about it?",
    ],
  },
};