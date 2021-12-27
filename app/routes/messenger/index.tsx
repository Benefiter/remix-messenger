
import { LoaderFunction, useLoaderData } from 'remix';
import { getSession } from '~/sessions';
export const loader: LoaderFunction = async ({ request }) => {

    console.log('loader for messenger')
    console.log(request.headers)
    const session = await getSession(request.headers.get('Cookie'))

    session.get('userId');
    console.log('session had userId');
    console.log(session.has('userId'))
  
    return {user: session.has('userId') ? await session.get('userId') : null }
}

const Index = () => {
    const {user} = useLoaderData()

    return (
        <div> Logged in user is ${user} </div>
    )
}

export default Index;