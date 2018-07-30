import { Target } from './Target';

export interface Reference {
    definition: string;
    name: string;
    targets: Target[];
}