import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="fixed top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="text-lg font-semibold">CreatorOS</Link>
          <nav className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Sign in</Link>
            <Link
              href="/register"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      <section className="flex flex-1 items-center justify-center px-4 pt-24 pb-16">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Your personal brand,{" "}
            <span className="bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">powered by AI</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto">
            Generate a portfolio, resume, LinkedIn bio, and brand strategy in minutes.
            CreatorOS helps you build a consistent personal brand across every platform.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Link
              href="/register"
              className="rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
            >
              Start building for free
            </Link>
            <Link
              href="#features"
              className="rounded-lg border border-border px-6 py-3 text-sm font-medium hover:bg-muted transition-colors"
            >
              See how it works
            </Link>
          </div>
        </div>
      </section>

      <section id="features" className="border-t border-border px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-bold">Everything you need to build your brand</h2>
          <p className="mt-2 text-center text-muted-foreground">One platform. All your personal brand assets.</p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="rounded-lg border border-border p-6">
                <h3 className="font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border px-4 py-20 bg-muted/50">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-bold">How it works</h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {steps.map((step) => (
              <div key={step.title} className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground text-lg font-bold">
                  {step.number}
                </div>
                <h3 className="mt-4 font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border px-4 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold">Ready to build your brand?</h2>
          <p className="mt-3 text-muted-foreground">Join creators and developers building their personal brand with AI.</p>
          <Link
            href="/register"
            className="mt-6 inline-block rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
          >
            Get started free
          </Link>
          <p className="mt-3 text-xs text-muted-foreground">No credit card required. 20 generations free.</p>
        </div>
      </section>

      <footer className="border-t border-border px-4 py-8">
        <div className="mx-auto max-w-6xl text-center text-sm text-muted-foreground">
          CreatorOS — AI Personal Brand Builder
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    title: "Portfolio Copy",
    description: "Generate compelling portfolio content — hero sections, about me, services, and project descriptions that sell your skills.",
  },
  {
    title: "Resume Optimization",
    description: "ATS-friendly resume content optimized for your industry and target roles. Achievement-focused and keyword-rich.",
  },
  {
    title: "LinkedIn Bio",
    description: "A keyword-optimized LinkedIn profile that positions you as an authority in your field and attracts opportunities.",
  },
  {
    title: "Social Media Bios",
    description: "Platform-optimized bios for Twitter, GitHub, Instagram, and more. Consistent branding everywhere.",
  },
  {
    title: "Brand Strategy",
    description: "Positioning statement, niche, target audience, and content pillars to guide your personal brand.",
  },
  {
    title: "Content Engine",
    description: "Generate LinkedIn posts, tweets, and content ideas in batch to build your audience consistently.",
  },
];

const steps = [
  { number: 1, title: "Tell us about yourself", description: "Share your role, skills, experience, and goals in a few minutes." },
  { number: 2, title: "AI generates your assets", description: "Our AI creates portfolio copy, resume, LinkedIn bio, and more." },
  { number: 3, title: "Export and publish", description: "Copy, download as PDF or TXT, and publish across your platforms." },
];
