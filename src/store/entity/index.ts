import {getStoreBuilder, BareActionContext} from 'vuex-typex';
import {EntityState} from '@/store/entity/state';
import {RootState} from '@/store';
import {Entity} from '@/model/Entity';

const initialState: EntityState = {
  entities: [],
};

const entityModule = getStoreBuilder<RootState>().module<EntityState>('structure', initialState);

const stateGetter = entityModule.state();

const actions = {
  createEntity(context: BareActionContext<EntityState, RootState>, payload: Entity): Promise<Entity> {
    return Promise.resolve<Entity>(payload);
  },

  deleteEntity(context: BareActionContext<EntityState, RootState>, payload: string) {
    payload = payload;
  },

  updateEntity(context: BareActionContext<EntityState, RootState>, payload: Entity): Promise<Entity> {
    return Promise.resolve<Entity>(payload);
  },
};

const mutations = {
  updateEntity(state: EntityState, e: Entity ) {
    const userIdx = state.entities.findIndex((u) => u.id === e.id);
    if (userIdx >= 0) {
      Object.assign(state.entities[userIdx], e);
    } else {
      state.entities.push(e);
    }
  },

  removeEntity(state: EntityState, id: string ) {
    const userIdx = state.entities.findIndex((u) => u.id === id);
    if (userIdx >= 0) {
      state.entities.splice(userIdx, 1);
    }
  },
};

const entity = {
  get state() { return stateGetter(); },

  commitUpdateEntity: entityModule.commit(mutations.updateEntity, 'updateEntity'),
  commitRemoveEntity: entityModule.commit(mutations.removeEntity, 'removeEntity'),

  dispatchCreateEntity: entityModule.dispatch(actions.createEntity, 'createEntity'),
  dispatchDeleteEntity: entityModule.dispatch(actions.deleteEntity, 'deleteEntity'),
  dispatchUpdateEntity: entityModule.dispatch(actions.updateEntity, 'updateEntity'),
};

export default entity;
