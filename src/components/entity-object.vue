<template>
    <v-container fluid grid-list-md pa-0>
        <v-layout wrap v-for="item in properties" :key="item.name">
            <v-flex xs12>
                <entity-control :property="item" :entity="entity"/>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script lang="ts">
import Vue from 'vue';
import EntityControl from './entity-control.vue';
import {Property} from '@/model/Property';
import {getObjectProperties, getObjectByReferenceAsProperty} from '@/services/backend';
import Component from 'vue-class-component';

@Component({
    props: ['entityName', 'entity'],

    components: { EntityControl },
})
export default class EntityObject extends Vue {
  get properties(): Property[] {
    const REF: string = '$ref';
    console.log(this.$props.entityName);
    const props = getObjectProperties(this.$props.entityName);
    console.log(props);
    props.forEach((p, index, array) => {
      const p2 = p as any;
      const ref = p2[REF];
      if (ref) {
        const value = getObjectByReferenceAsProperty(ref);
        if (value) {
            value.name = p.name;
            const x = value as any;
            x.entityName = ref.substring(ref.lastIndexOf('/') + 1);
            array[index] = value;
        }
      }
    });
    return props;
  }
}
</script>
