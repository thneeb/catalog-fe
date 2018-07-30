export interface Project {
  id: string;
  name: string;
  description: string;
}

export interface ProjectState {
  loading: boolean;
  projects: Project[];
  currentProject: Project;
}
