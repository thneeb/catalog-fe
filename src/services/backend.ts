import axios from 'axios';
import * as catalog from '../assets/json/swagger.json';
import {NameCount} from '@/model/NameCount';
import {NameDescription} from '@/model/NameDescription';
import {Property} from '@/model/Property';
import {Entity} from '@/model/Entity';
import { endpoint } from '@/config';

export function retrieveSwaggerFile(name: string): string {
  axios.get('/MessageService');
  return name;
}

export function getCatalog(): any {
  const c = catalog as any;
  console.log(c);
  const d = c.default.definitions;
  const definitions = Object.keys(d).map((key) => ({key, value: d[key]}));
  console.log(definitions);
  let counter = new Array<NameCount>();
  for (const def of definitions) {
    if (def.value.properties) {
      counter = merge(counter, findProperty(def.value.properties, '$ref'));
    }
  }
  console.log(counter);
  console.log(definitions.filter((def) => !counter.find(
    (f) => f.name.substring(f.name.lastIndexOf('/') + 1) === def.key)));
}

export function getObjects(): NameDescription[] {
  const c = catalog as any;
  const d = c.default.definitions;
  const definitions = Object.keys(d).map((key) => ({key, value: d[key]}));
  return definitions.map((f) => ({name: f.key, description: f.value.description}));
}

export function getObjectByRef(ref: string): NameDescription | undefined {
  return getObjects().find((f) => f.name === ref.substring(ref.lastIndexOf('/') + 1));
}

export function getMainObjects(): NameDescription[] {
  const c = catalog as any;
  const d = c.default.definitions;
  const definitions = Object.keys(d).map((key) => ({key, value: d[key]}));
  let counter = new Array<NameCount>();
  for (const def of definitions) {
    if (def.value.properties) {
      counter = merge(counter, findProperty(def.value.properties, '$ref'));
    }
  }
  const main = definitions.filter((def) => !counter.find(
    (f) => f.name.substring(f.name.lastIndexOf('/') + 1) === def.key));
  return main.map((f) => ({name: f.key, description: f.value.description}));
}

export function getFinderMethod(obj: NameDescription): string {
  const c = catalog as any;
  const p = c.default.paths;
  const paths = Object.keys(p).map((key) => ({key, value: p[key]}));
  const finderName = obj.name.substring(obj.name.lastIndexOf('/') + 1).toUpperCase();
  const finder = paths.find((f) => f.key.substring(f.key.lastIndexOf('/') + 1).toUpperCase() === finderName);
  if (finder && finder.value.get && finder.value.get.responses) {
    const result = finder.value.get.responses['200'];
    if (result.schema.type === 'array') {
      const resultType = result.schema.items.$ref;
      if (resultType.substring(resultType.lastIndexOf('/') + 1) === obj.name) {
        return finder.key;
      }
    }
  }
  return '';
}

export async function executeFinder(finder: string): Promise<Entity[]> {
  const result = await axios.get(endpoint + finder);
  return result.data as Entity[];
}

export function getObjectByReferenceAsProperty(reference: string): Property | undefined {
  const c = catalog as any;
  const d = c.default.definitions;
  const definitions = Object.keys(d).map((key) => ({key, value: d[key]}));
  console.log('reference', reference);
  const name = reference.substring(reference.lastIndexOf('/') + 1);
  const definition = definitions.find((f) => f.key === name);
  if (definition) {
    return definition.value as Property;
  }
}

export function getObjectProperties(name: string): Property[] {
  const c = catalog as any;
  const d = c.default.definitions;
  const definitions = Object.keys(d).map((key) => ({key, value: d[key]}));
  const definition = definitions.find((f) => f.key === name);
  const result = new Array<Property>();
  if (definition) {
    for (const prop of Object.keys(definition.value.properties).map(
        (key) => ({name: key, ...definition.value.properties[key]}))) {
      result.push(prop);
    }
  }
  return result;
}

function findProperty(root: any, property: string): NameCount[] {
  let counter = new Array<NameCount>();
  if (root === null) {
//    console.log('null');
  } else if (Array.isArray(root)) {
//    console.log('array');
  } else if (typeof root === 'object') {
//    console.log('object');
    for (const o of Object.keys(root).map((key) => ({key, value: root[key]}))) {
      if (o.key === property) {
        console.log('FOUND property ' + o.key + ' with value ' + o.value);
        counter = merge(counter, [{ name: o.value, count: 1}]);
      } else {
        counter = merge(counter, findProperty(o.value, property));
      }
    }
  } else {
//    console.log('primitive', root);
  }
  return counter;
}

function merge(counter1: NameCount[], counter2: NameCount[]): NameCount[] {
  const newArray = counter1.map((a) => ({name: a.name, count: a.count}));
  for (const c of counter2) {
    const v = newArray.findIndex((f) => f.name === c.name);
    if (v === -1) {
      newArray.push(c);
    } else {
      newArray[v].count += c.count;
    }
  }
  return newArray;
}


