import {
    Link,
} from 'remix';

type ModalDialogButtonsProps = {
    operationTitle: string
}

const ModalDialogButtons = ({ operationTitle }: ModalDialogButtonsProps) => {
    return (
        <>
            <div className='d-flex justify-content-evenly'>
                <Link className='navbar-link btn btn-primary text-decoration-none' to='/messenger'>
                    Cancel
                </Link>

                <button
                    className='btn btn-primary'
                    type='submit'
                >
                    {operationTitle}
                </button>
            </div>
        </>
    )
}

export default ModalDialogButtons