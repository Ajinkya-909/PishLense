import {
  ShieldAlert,
  Mail,
  Link2,
  Brain,
  Eye,
  Lock,
  AlertTriangle,
  UserX,
} from "lucide-react";

const techniques = [
  {
    icon: AlertTriangle,
    title: "Urgency & Fear",
    description:
      "Phishing emails often create a sense of urgency ('Your account will be suspended in 24 hours!') or fear ('Unauthorized access detected') to pressure you into acting without thinking.",
    examples: [
      "Act now or your account will be closed",
      "Unusual sign-in detected — verify immediately",
      "Your payment failed — update within 24 hours",
    ],
  },
  {
    icon: UserX,
    title: "Impersonation",
    description:
      "Attackers pretend to be trusted organizations like banks, tech companies, or even your employer. They use lookalike domains and official-looking templates.",
    examples: [
      "paypa1.com instead of paypal.com (number 1 vs letter l)",
      "micros0ft.com (zero instead of o)",
      "support@company-secure.net (fake domain)",
    ],
  },
  {
    icon: Link2,
    title: "Malicious Links",
    description:
      "Links may display one URL but redirect to another. Hovering over a link reveals the actual destination. Shortened URLs (bit.ly) are also used to hide destinations.",
    examples: [
      "Display: 'Click here to verify' → goes to fake-login.com",
      "Shortened links that hide the real domain",
      "Links with misspelled domain names",
    ],
  },
  {
    icon: Brain,
    title: "Social Engineering",
    description:
      "Attackers exploit human psychology — curiosity, helpfulness, authority, and greed. They craft messages that appeal to emotions rather than logic.",
    examples: [
      "Congratulations! You've won a prize (greed)",
      "Your CEO needs this done urgently (authority)",
      "Please help me transfer funds (helpfulness)",
    ],
  },
];

const tips = [
  {
    icon: Eye,
    title: "Check the Sender's Email",
    text: "Look at the actual email address, not just the display name. Legitimate companies use their official domain.",
  },
  {
    icon: Link2,
    title: "Hover Before You Click",
    text: "Always hover over links to see the actual URL before clicking. If it doesn't match the claimed destination, don't click.",
  },
  {
    icon: Lock,
    title: "Never Share Sensitive Info via Email",
    text: "Legitimate organizations will never ask for passwords, SSNs, or bank details via email.",
  },
  {
    icon: Mail,
    title: "Verify Through Official Channels",
    text: "If an email seems suspicious, contact the organization directly through their official website or phone number.",
  },
  {
    icon: ShieldAlert,
    title: "Look for Generic Greetings",
    text: "'Dear Customer' or 'Dear User' instead of your name is a red flag. Legitimate companies usually address you by name.",
  },
];

export default function LearnPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-foreground">
          Phishing Awareness
        </h2>
        <p className="text-sm text-muted-foreground">
          Learn how attackers manipulate users and how to protect yourself
        </p>
      </div>

      {/* Techniques */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">
          Common Phishing Techniques
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          {techniques.map((t) => (
            <div
              key={t.title}
              className="rounded-lg border border-border bg-card p-5 space-y-3"
            >
              <div className="flex items-center gap-2">
                <t.icon className="h-5 w-5 text-primary" />
                <h4 className="font-semibold text-card-foreground">
                  {t.title}
                </h4>
              </div>
              <p className="text-sm text-muted-foreground">{t.description}</p>
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">
                  Examples:
                </p>
                {t.examples.map((ex, i) => (
                  <p
                    key={i}
                    className="flex gap-2 text-xs text-card-foreground font-mono"
                  >
                    <span className="text-muted-foreground">→</span> {ex}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tips */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">
          How to Identify Phishing
        </h3>
        <div className="space-y-3">
          {tips.map((tip) => (
            <div
              key={tip.title}
              className="flex gap-4 rounded-lg border border-border bg-card p-4"
            >
              <tip.icon className="h-5 w-5 shrink-0 text-primary mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-card-foreground">
                  {tip.title}
                </h4>
                <p className="text-sm text-muted-foreground">{tip.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
