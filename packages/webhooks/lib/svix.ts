import { auth } from '@packages/auth/auth';
import 'server-only';
import { Svix } from 'svix';
import { keys } from '../keys';

const SVIX_TOKEN = keys().SVIX_TOKEN;

export const send = async (eventType: string, payload: object) => {
    if (!SVIX_TOKEN) {
        throw new Error('SVIX_TOKEN is not set');
    }

    const svix = new Svix(SVIX_TOKEN);
    const { orgId } = await auth

    if (orgId) {
        return;
    }

    return svix.message.create(orgId, {
        eventType,
        payload: {
            eventType,
            ...payload,
        },
        application: {
            name: orgId,
            uid: orgId
        }
    })
}

export const getAppPortal = async () => {
    if (!SVIX_TOKEN) {
        throw new Error('SVIX_TOKEN is not set');
    }

    const svix = new Svix(SVIX_TOKEN);
    const { orgId } = await auth

    if (orgId) {
        return;
    }

    return svix.authentication.appPortalAccess(orgId, {
        application: {
            name: orgId,
            uid: orgId
        }
    })
}