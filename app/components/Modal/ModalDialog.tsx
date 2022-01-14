import { Dialog } from '@reach/dialog';
import VisuallyHidden from '@reach/visually-hidden';
import { animated, useSpring } from '@react-spring/web';
import { useNavigate } from 'remix';

type DialogModalProps = {
  children: React.ReactNode,
  modalTitle: string
}

const ModalDialog = ({ children, modalTitle }: DialogModalProps) => {
  const navigate = useNavigate()

  const close = () => navigate(-1);

  const style = useSpring({
    to: { opacity: 1 },
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    delay: 200,
  });
  return (
    <Dialog isOpen={true} onDismiss={close} aria-labelledby='modal-title' style={{ padding: '20px', width: '25vw', borderRadius: '5px'}} className='border border-1 border-dark shadow rounded'>
      <animated.div style={style}>
        <div className='float-end'>
          <i className='fs-6 bi-x-lg modal-closer' onClick={close} title='Close' />
        </div>
        <h3 id='modal-title'>{modalTitle}</h3>
        {children}
      </animated.div>
    </Dialog>
  );
};

export default ModalDialog;
