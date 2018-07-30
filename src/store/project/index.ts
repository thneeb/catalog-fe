import axios from 'axios';
import { getStoreBuilder, BareActionContext } from 'vuex-typex';
import {Project, ProjectState} from '@/store/project/state';
import {RootState} from '@/store';

const initialState: ProjectState = {
  loading: false,
  projects: [],
  currentProject: {
    id: '',
    name: '',
    description: '',
  },
};

const projectModule = getStoreBuilder<RootState>().module<ProjectState>('project', initialState);

// getters
const getters = {
  getProjects: projectModule.read((state): Project[] => {
    return state.projects;
  }, 'getProjects'),

  getCurrentProject: projectModule.read((state): Project => {
    return state.currentProject;
  }, 'getCurrentProject'),

  isLoading: projectModule.read((state): boolean => {
    return state.loading;
  }, 'isLoading'),
};

// mutations
const mutations = {
  updateProject(state: ProjectState, payload: Project ) {
    const existingProj = state.projects.find((p) => p.id === payload.id);
    if (existingProj) {
      Object.assign(existingProj, payload);
    } else {
      state.projects.push(payload);
    }
  },

  removeProject(state: ProjectState, projectId: string ) {
    const existingProj = state.projects.findIndex((p) => p.id === projectId);
    if (existingProj >= 0) {
      state.projects.splice(existingProj, 1);
    }
  },

  currentProject(state: ProjectState, payload: Project) {
    state.currentProject = payload;
  },

  setProjects(state: ProjectState, projects: Project[]) {
    state.projects.splice(0, state.projects.length);
    state.projects.push(...projects);
  },

  setLoading(state: ProjectState, loading: boolean) {
    state.loading = loading;

  },

  resetProjects(state: ProjectState) {
    state.projects.splice(0, state.projects.length);
  },
};

// actions
const actions = {
  async createProject(context: BareActionContext<ProjectState, RootState>, data: Project): Promise<Project> {
    const resp = await axios.post('/api/v1/projects', data);

    project.commitUpdateProject(resp.data as Project);
    return resp.data as Project;
  },

  async deleteProject(context: BareActionContext<ProjectState, RootState>, projectId: string): Promise<void> {
    const resp = await axios.delete('/api/v1/projects/' + projectId);

    project.commitRemoveProject(projectId);
  },

  async loadProjects(context: BareActionContext<ProjectState, RootState>): Promise<Project[]> {
    project.commitSetLoading(true);
    try {
      project.commitResetProjects();
      const resp = await axios.get('/api/v1/projects');

      project.commitSetProjects(resp.data as Project[]);
      return resp.data as Project[];
    } finally {
      project.commitSetLoading(false);
    }
  },

  async updateProject(context: BareActionContext<ProjectState, RootState>, data: Project): Promise<Project> {
    const resp = await axios.put('/api/v1/projects/' + data.id, data);

    project.commitUpdateProject(resp.data as Project);
    return resp.data as Project;
  },
};

// state
const stateGetter = projectModule.state();

// exported 'project' module interface
const project = {
  // state
  get state() { return stateGetter(); },

  // getters (wrapped as real getters)
  get isLoading() { return getters.isLoading(); },
  get getProjects() { return getters.getProjects(); },
  get getCurrentProject() { return getters.getCurrentProject(); },

  // mutations
  commitSetLoading: projectModule.commit(mutations.setLoading),
  commitUpdateProject: projectModule.commit(mutations.updateProject),
  commitRemoveProject: projectModule.commit(mutations.removeProject),
  commitCurrentProject: projectModule.commit(mutations.currentProject),
  commitSetProjects: projectModule.commit(mutations.setProjects),
  commitResetProjects: projectModule.commit(mutations.resetProjects),

  // actions
  dispatchDeleteProject: projectModule.dispatch(actions.deleteProject),
  dispatchCreateProject: projectModule.dispatch(actions.createProject),
  dispatchLoadProjects: projectModule.dispatch(actions.loadProjects),
  dispatchUpdateProject: projectModule.dispatch(actions.updateProject),
};

export default project;
