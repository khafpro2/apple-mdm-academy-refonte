import { PageShell } from "@/components/layout";
import { AssistantContent } from "@/components/assistant/assistant-content";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "Apple MDM Assistant",
  description: "Assistant IA pédagogique — questions, explications, révisions et recommandations de labs.",
  path: "/assistant",
});

export default function AssistantPage() {
  return (
    <PageShell>
      <AssistantContent />
    </PageShell>
  );
}
