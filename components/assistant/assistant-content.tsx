"use client";

import { useState } from "react";
import { Card, Button, SectionHeading, Badge } from "@/components/ui";
import { assistantCapabilities, assistantArchitecture, demoResponses } from "@/lib/ai/assistant-config";

export function AssistantContent() {
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; text: string }[]>([
    { role: "assistant", text: "Bonjour ! Je suis Apple MDM Assistant. Posez-moi une question sur MDM, Jamf, Intune ou la sécurité Apple." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  function send() {
    if (!input.trim()) return;
    const question = input.trim();
    setInput("");
    setMessages((m) => [...m, { role: "user", text: question }]);
    setLoading(true);
    setTimeout(() => {
      const reply = demoResponses[Math.floor(Math.random() * demoResponses.length)];
      setMessages((m) => [...m, { role: "assistant", text: reply }]);
      setLoading(false);
    }, 800);
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 lg:py-16">
      <SectionHeading
        label="IA pédagogique"
        title="Apple MDM Assistant"
        description="Réponses aux questions, explications, révisions et recommandations de labs — architecture IA préparée."
      />
      <div className="mt-10 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="flex h-[480px] flex-col p-0">
            <div className="flex-1 space-y-4 overflow-y-auto p-6">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                    msg.role === "user"
                      ? "ml-auto bg-accent text-white"
                      : "bg-surface text-ink-secondary"
                  }`}
                >
                  {msg.text}
                </div>
              ))}
              {loading && <p className="text-sm text-ink-tertiary">Réflexion…</p>}
            </div>
            <div className="flex gap-2 border-t border-border-light p-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Ex : Comment fonctionne ADE avec Jamf ?"
                className="flex-1 rounded-full border border-border-light px-4 py-2 text-sm outline-none focus:border-accent"
              />
              <Button onClick={send} disabled={loading}>Envoyer</Button>
            </div>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <h3 className="font-bold text-ink">Fonctions</h3>
            <ul className="mt-4 space-y-3">
              {assistantCapabilities.map((c) => (
                <li key={c.id} className="flex items-start justify-between gap-2 text-sm">
                  <div>
                    <p className="font-medium text-ink">{c.title}</p>
                    <p className="text-ink-tertiary">{c.description}</p>
                  </div>
                  <Badge variant={c.status === "ready" ? "accent" : "default"}>{c.status}</Badge>
                </li>
              ))}
            </ul>
          </Card>
          <Card>
            <h3 className="font-bold text-ink">Architecture</h3>
            <p className="mt-2 text-xs text-ink-tertiary">{assistantArchitecture.version}</p>
            <ul className="mt-3 space-y-1 text-xs text-ink-secondary">
              <li>Frontend: {assistantArchitecture.stack.frontend}</li>
              <li>LLM: {assistantArchitecture.stack.llm}</li>
              <li>Context: {assistantArchitecture.stack.context}</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
