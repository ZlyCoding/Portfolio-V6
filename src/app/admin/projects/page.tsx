import { getProjectsAndTypes } from "./actions";
import ProjectsClient from "./ProjectsClient";

export const metadata = {
  title: "Projects",
};

export default async function ProjectsPage() {
  const { projects, projectTypes } = await getProjectsAndTypes();

  return (
    <ProjectsClient
      initialProjects={projects}
      initialProjectTypes={projectTypes}
    />
  );
}
