import { UserIdentity } from 'ra-core/src/types';

export interface User {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    remoteAddr: string;
    username: string;

    [key: string]: unknown;
}

export type UserIdentityType = User | UserIdentity;
