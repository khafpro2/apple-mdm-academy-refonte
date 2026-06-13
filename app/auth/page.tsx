import { redirect } from "next/navigation";

export const metadata = {
  title: "Connexion",
};

export default function AuthRedirectPage() {
  redirect("/auth/login");
}
