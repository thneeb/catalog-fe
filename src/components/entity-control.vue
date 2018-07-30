<template>
    <v-select :label="property.title || property.name"
              v-model="entity[property.name]"
              :items="property.enum"
              v-if="property.type === 'string' && property.enum"
    />
    <v-text-field :label="property.title || property.name" 
                v-model="entity[property.name]"
                v-else-if="property.type === 'string'"
    />
    <v-checkbox :label="property.title || property.name"
                v-model="entity[property.name]"
                v-else-if="property.type === 'boolean'"
    />
    <div style="border: 1px"
        v-else-if="property.type === 'object' || property.type === undefined"
    >        
        <p>
            {{property.title || property.name}}
            <v-btn @click="deleteObject" v-if="entity[property.name]">Delete object</v-btn>
            <v-btn @click="createObject" v-else>Define object</v-btn>
        </p>
        <entity-object :entityName="property.entityName" 
                       :entity="entity[property.name]" 
                       v-if="entity[property.name]"
        />
    </div>
    <p v-else>{{property.title || property.name}} {{property.type || 'object'}}</p>
</template>

<script lang="ts">
import Vue from 'vue';
import {Property} from '@/model/Property';
import {Entity} from '@/model/Entity';

export default Vue.extend({
    props: ['property', 'entity'],

    methods: {
        deleteObject() {
            this.$props.entity[this.$props.property.name] = undefined;
        },

        createObject() {
            this.$props.entity[this.$props.property.name] = {};
        },
    },
});
</script>
