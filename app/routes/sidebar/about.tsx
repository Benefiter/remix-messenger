import { useNavigate } from 'remix'

const About = () => {
    const navigate = useNavigate()
    return <>
        <h1>About page</h1>
        <button className='btn btn-primary' onClick={(e) => navigate(-1)}>
            Back
        </button>
    </>
}

export default About