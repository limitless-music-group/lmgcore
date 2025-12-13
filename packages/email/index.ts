import { Resend } from 'resend';
import { keys } from './keys';

export const email = new Resend(keys().RESEND_TOKEN)