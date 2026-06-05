import { redirect } from "next/navigation";

/** Redirection permanente vers la page tarifs à jour */
export default function TarifsRedirectPage() {
  redirect("/pricing");
}
