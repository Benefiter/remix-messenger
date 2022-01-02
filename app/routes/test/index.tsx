import { ActionFunction, redirect } from 'remix';

export let action: ActionFunction = ({request}) => redirect('/login')