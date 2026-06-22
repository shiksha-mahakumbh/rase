import { redirect } from "next/navigation";

export default function PeopleRedirectPage() {
  redirect("/speakers/directory");
}
