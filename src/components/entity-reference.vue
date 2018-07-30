<template>
    <v-dialog v-model="dialog">
        <v-card>
            <v-card-title class="headline">
                Referenz hinzufügen
            </v-card-title>
            <v-card-text>                
                <v-data-table color="primary">

                </v-data-table>
                <small>* Pflichfeld</small> 
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue'
import { EditorConfig } from '@/model/EditorConfig';
import { Reference } from '@/model/Reference';
import * as config from '@/assets/editorconfig.json';
export default Vue.extend({
    props: ["entityName"],

    computed: {
        getEditorConfig() : EditorConfig {
            return config.default as EditorConfig;
        },

        getReferencedObjects() : Reference | undefined {
            return this.getEditorConfig.references.find((f) => f.definition === this.$props.entityName);
        },

        getObjectTypes(): string[] | undefined {
            if (this.getReferencedObjects) {
                return this.getReferencedObjects.targets.map((f) => f.topic);
            }
        }
    }
})
</script>
