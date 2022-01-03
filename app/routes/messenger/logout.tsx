import { LoaderFunction } from 'remix';
import { logout } from '~/utils/session.server';

export const loader: LoaderFunction = async ({ request }) => {
    return logout(request)
}