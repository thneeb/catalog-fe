import axios from 'axios';
import { getStoreBuilder, BareActionContext } from 'vuex-typex';
import {UserState, UserData} from '@/store/user/state';
import {RootState} from '@/store';
import * as Firebase from 'firebase';
import {firebase} from '@/services/firebase';

const initialState: UserState = {
  initalizing: true,
  loggedIn: false,
  loading: false,
  users: [],
};

const userModule = getStoreBuilder<RootState>().module<UserState>('user', initialState);

// getters
const getters = {
  isLoggedIn: userModule.read((state): boolean => {
    return state.loggedIn;
  }, 'isLoggedIn'),

  isInitializing: userModule.read((state): boolean => {
    return state.initalizing;
  }, 'isInitializing'),

  isLoading: userModule.read((state): boolean => {
    return state.loading;
  }, 'isLoading'),

  getUsers: userModule.read((state): UserData[] => {
    return state.users;
  }, 'getUsers'),
};

// mutations
const mutations = {
  setLoading(state: UserState, loading: boolean ) {
    state.loading = loading;
  },

  setLoggedIn(state: UserState, loginState: boolean ) {
    state.loggedIn = loginState;
    state.initalizing = false;
  },

  setUsers(state: UserState, users: UserData[] ) {
    state.users.splice(0, state.users.length);
    state.users.push(...users);
  },

  removeUser(state: UserState, userId: string) {
    const userIdx = state.users.findIndex((u) => u.id === userId);
    if (userIdx >= 0) {
      state.users.splice(userIdx, 1);
    }
  },

  updateUser(state: UserState, userData: UserData ) {
    const userIdx = state.users.findIndex((u) => u.id === userData.id);
    if (userIdx >= 0) {
      Object.assign(state.users[userIdx], userData);
    } else {
      state.users.push(userData);
    }
  },

  resetUsers(state: UserState) {
    state.users.splice(0, state.users.length);
  },
};

// actions
const actions = {
  async login(context: BareActionContext<UserState, RootState>,
              payload: { username: string, password: string }): Promise<void> {
    return firebase.auth()
      .setPersistence(Firebase.auth.Auth.Persistence.SESSION)
      .then(() => firebase.auth()
        .signInWithEmailAndPassword(payload.username, payload.password));
  },

  async logout(context: BareActionContext<UserState, RootState>): Promise<void> {
    return firebase.auth().signOut();
  },

  async loadUsers(context: BareActionContext<UserState, RootState>): Promise<UserData[]> {

    user.commitSetLoading(true);
    try {
      user.commitResetUsers();
      const resp = await axios.get('/api/v1/users');

      user.commitSetUsers(resp.data as UserData[]);
      return resp.data as UserData[];
    } finally {
      user.commitSetLoading(false);
    }
  },

  async createUser(context: BareActionContext<UserState, RootState>, userData: UserData): Promise<UserData> {
    const resp = await axios.post('/api/v1/users', userData);

    const newUser = resp.data as UserData;
    user.commitUpdateUser(newUser);
    return newUser;
  },

  async deleteUser(context: BareActionContext<UserState, RootState>, userId: string): Promise<void> {
    const resp = await axios.delete('/api/v1/users/' + userId);

    user.commitRemoveUser(userId);
  },

  async updateUser(context: BareActionContext<UserState, RootState>, userData: UserData): Promise<UserData> {
    const resp = await axios.put('/api/v1/users/' + userData.id, userData);
    user.commitUpdateUser(userData);

    return userData;
  },

  async resetPassword(context: BareActionContext<UserState, RootState>, email: string): Promise<void> {
    await firebase.auth().sendPasswordResetEmail(email, {
      url: location.href,
    });
  },
};

// state
const stateGetter = userModule.state();

// exported 'user' module interface
export const user = {
  // state
  get state() { return stateGetter(); },

  // getters (wrapped as real getters)
  get isLoggedIn() { return getters.isLoggedIn(); },
  get isLoading() { return getters.isLoading(); },
  get isInitializing() { return getters.isInitializing(); },
  get getUsers() { return getters.getUsers(); },

  // mutations
  commitSetLoading: userModule.commit(mutations.setLoading, 'setLoading'),
  commitSetLoggedIn: userModule.commit(mutations.setLoggedIn, 'setLoggedIn'),
  commitSetUsers: userModule.commit(mutations.setUsers, 'setUsers'),
  commitRemoveUser: userModule.commit(mutations.removeUser, 'removeUser'),
  commitUpdateUser: userModule.commit(mutations.updateUser, 'updateUser'),
  commitResetUsers: userModule.commit(mutations.resetUsers, 'resetUsers'),

  // actions
  dispatchLogin: userModule.dispatch(actions.login, 'login'),
  dispatchLogout: userModule.dispatch(actions.logout, 'logout'),
  dispatchLoadUsers: userModule.dispatch(actions.loadUsers, 'loadUsers'),
  dispatchCreateUser: userModule.dispatch(actions.createUser, 'createUser'),
  dispatchDeleteUser: userModule.dispatch(actions.deleteUser, 'deleteUser'),
  dispatchUpdateUser: userModule.dispatch(actions.updateUser, 'updateUser'),
  dispatchResetPassword: userModule.dispatch(actions.resetPassword, 'resetPassword'),
};

export default user;
