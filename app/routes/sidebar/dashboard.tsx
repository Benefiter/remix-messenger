import { useNavigate } from 'remix'

const Dashboard = () => {
    const navigate = useNavigate()
    return <>
        <h1>Dashboard page</h1>
        <button className='btn btn-primary' onClick={(e) => navigate(-1)}>
            Back
        </button>
    </>
}

export default Dashboard