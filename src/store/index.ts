import Vue from 'vue';
import Vuex from 'vuex';
import {getStoreBuilder} from 'vuex-typex';
import {UserState} from '@/store/user/state';
import {ProjectState} from '@/store/project/state';
import {DeviceState} from '@/store/device/state';
import {StructureState} from '@/store/structure/state';
import {EntityState} from '@/store/entity/state';

Vue.use(Vuex);

export interface RootState {
  user: UserState;
  project: ProjectState;
  device: DeviceState;
  structure: StructureState;
  entity: EntityState;
}

export const buildStore = () => getStoreBuilder<RootState>().vuexStore();
