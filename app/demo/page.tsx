import { redirect } from "next/navigation";

export const metadata = {
  title: "Démo",
};

export default function DemoRedirectPage() {
  redirect("/training-center");
}
