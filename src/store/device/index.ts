import axios from 'axios';
import { getStoreBuilder, BareActionContext } from 'vuex-typex';
import {Device, DeviceState, DeviceIoTState} from '@/store/device/state';
import {RootState} from '@/store';

const initialState: DeviceState = {
  devices: [],
  loading: false,
};

const deviceModule = getStoreBuilder<RootState>().module<DeviceState>('device', initialState);

// getters
const getters = {
  getDevices: deviceModule.read((state): Device[] => {
    return state.devices;
  }, 'getDevices'),

  isLoading: deviceModule.read((state): boolean => {
    return state.loading;
  }, 'isLoading'),
};

// mutations
const mutations = {
  updateDevice(state: DeviceState, deviceData: Device ) {
    const existingProj = state.devices.find((d) => d.id === deviceData.id);
    if (existingProj) {
      Object.assign(existingProj, deviceData);
    } else {
      state.devices.push(deviceData);
    }
  },

  removeDevice(state: DeviceState, deviceId: string) {
    const existingProj = state.devices.findIndex((d) => d.id === deviceId);
    if (existingProj >= 0) {
      state.devices.splice(existingProj, 1);
    }
  },

  setDevices(state: DeviceState, devices: Device[] ) {
    state.devices.splice(0, state.devices.length);
    state.devices.push(...devices);
  },

  setLoading(state: DeviceState, loading: boolean) {
    state.loading = loading;
  },

  resetDevices(state: DeviceState) {
    state.devices.splice(0, state.devices.length);
  },
};

// actions
const actions = {
  async createDevice(context: BareActionContext<DeviceState, RootState>, data: Device): Promise<Device> {
    const resp = await axios.post('/api/v1/projects/' + context.rootState.project.currentProject.id +
      '/devices', data);

    device.commitUpdateDevice(resp.data as Device);
    return resp.data as Device;
  },

  async deleteDevice(context: BareActionContext<DeviceState, RootState>, deviceId: string): Promise<void> {
    const resp = await axios.delete('/api/v1/projects/'  + context.rootState.project.currentProject.id +
      '/devices/' + deviceId);

    device.commitRemoveDevice(deviceId);
  },

  async loadDevices(context: BareActionContext<DeviceState, RootState>): Promise<Device[]> {
    device.commitSetLoading(true);
    try {
      device.commitResetDevices();
      const resp = await axios.get('/api/v1/projects/' + context.rootState.project.currentProject.id + '/devices');

      device.commitSetDevices(resp.data as Device[]);
      return resp.data as Device[];
    } finally {
      device.commitSetLoading(false);
    }
  },

  async getDeviceIoTState(context: BareActionContext<DeviceState, RootState>, deviceId: string):
    Promise<DeviceIoTState> {
    const resp = await axios.get('/api/v1/projects/'  + context.rootState.project.currentProject.id +
      '/devices/' + deviceId + '/status');

    return resp.data as DeviceIoTState;
  },

  async updateDevice(context: BareActionContext<DeviceState, RootState>, data: Device): Promise<Device> {
    const resp = await axios.put('/api/v1/projects/' + context.rootState.project.currentProject.id +
      '/devices/' + data.id, data);

    device.commitUpdateDevice(resp.data as Device);
    return resp.data as Device;
  },
};

// state
const stateGetter = deviceModule.state();

// exported 'device' module interface
const device = {
  // state
  get state() { return stateGetter(); },

  // getters (wrapped as real getters)
  get getDevices() { return getters.getDevices(); },
  get isLoading() { return getters.isLoading(); },

  // mutations
  commitUpdateDevice: deviceModule.commit(mutations.updateDevice),
  commitRemoveDevice: deviceModule.commit(mutations.removeDevice),
  commitSetDevices: deviceModule.commit(mutations.setDevices),
  commitSetLoading: deviceModule.commit(mutations.setLoading),
  commitResetDevices: deviceModule.commit(mutations.resetDevices),

  // actions
  dispatchDeleteDevice: deviceModule.dispatch(actions.deleteDevice),
  dispatchCreateDevice: deviceModule.dispatch(actions.createDevice),
  dispatchLoadDevices: deviceModule.dispatch(actions.loadDevices),
  dispatchGetDeviceIoTState: deviceModule.dispatch(actions.getDeviceIoTState),
  dispatchUpdateDevice: deviceModule.dispatch(actions.updateDevice),
};

export default device;
