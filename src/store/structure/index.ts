import {getStoreBuilder} from 'vuex-typex';
import {StructureState} from '@/store/structure/state';
import {RootState} from '@/store';

const initialState: StructureState = {
  mainObjects: [],
};

const structureModule = getStoreBuilder<RootState>().module<StructureState>('structure', initialState);

const stateGetter = structureModule.state();

const structure = {
  get state() { return stateGetter(); },
};

export default structure;
