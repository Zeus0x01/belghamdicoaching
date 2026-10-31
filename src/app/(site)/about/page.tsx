"use client";

import { Reveal } from "@/components/ui/Reveal";
import { Dumbbell, GraduationCap, Heart } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="pt-32 pb-28">
      <div className="max-w-6xl mx-auto px-6 lg:px-10">
        <Reveal>
          <p className="eyebrow mb-4">About</p>
          <h1 className="heading-xl text-4xl md:text-7xl max-w-4xl">
            A coach obsessed with the <span className="text-copper">process.</span>
          </h1>
          <p className="body-lg mt-6 max-w-2xl">
            Belghamdi Coaching exists to bring scientific training to people who want real
            outcomes — structured programming, honest accountability, and progress you can
            measure week over week.
          </p>
        </Reveal>

        <div className="mt-20 grid md:grid-cols-3 gap-6">
          {[
            {
              icon: Dumbbell,
              title: "Coach-led programs",
              copy: "Every training split and full program is designed and reviewed by the coach — never recycled templates.",
            },
            {
              icon: GraduationCap,
              title: "Education first",
              copy: "Clients learn why exercises are chosen. Workout education and exercise explanations are part of the plan.",
            },
            {
              icon: Heart,
              title: "Community + accountability",
              copy: "A fitness community and structured check-ins keep progress social, honest, and consistent.",
            },
          ].map((c, i) => (
            <Reveal key={c.title} delay={i * 0.1} className="card-surface p-10">
              <c.icon className="h-7 w-7 text-copper" />
              <h2 className="font-display font-semibold text-xl text-bone mt-6">{c.title}</h2>
              <p className="text-sm text-wgray mt-3 leading-relaxed">{c.copy}</p>
            </Reveal>
          ))}
        </div>

        <div className="mt-24 border-l-2 border-copper pl-10 py-4">
          <p className="font-serif text-3xl lg:text-4xl text-bone max-w-2xl leading-snug">
            &ldquo;Build beyond your limits — but build in a way you can sustain for the next
            decade.&rdquo;
          </p>
          <p className="text-wgray mt-4 font-display uppercase tracking-widest text-sm">
            — Coach Belghamdi
          </p>
        </div>
      </div>
    </div>
  );
}
