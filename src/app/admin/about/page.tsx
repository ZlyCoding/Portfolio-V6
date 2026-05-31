import { getProfile } from "./actions";
import AboutClient from "./AboutClient";

export const metadata = {
  title: "Profile",
};

export default async function AboutPage() {
  const profile = await getProfile();

  return <AboutClient initialProfile={profile} />;
}