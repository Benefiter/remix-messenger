import { Dialog } from '@reach/dialog';
import VisuallyHidden from '@reach/visually-hidden';
import { animated, useSpring } from '@react-spring/web';
import { useNavigate } from 'remix';

type DialogModalProps = {
  children: React.ReactNode,
  modalTitle: string
}

const ModalDialog = ({ children, modalTitle }: DialogModalProps) => {
  const navigate=useNavigate()
  
  const close = () => navigate(-1);
  
  const style = useSpring({
    to: { opacity: 1 },
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    delay: 200,
  });
  return (
    <>
      <Dialog isOpen={true} onDismiss={close} aria-labelledby='modal-title'>
        <animated.div style={style}>
          <div className='d-flex'>
            <h3 id='modal-title'>{modalTitle}</h3>
            <button className='close-button ms-auto ' onClick={close}>
              <VisuallyHidden>Close</VisuallyHidden>
              <span aria-hidden>
                <i className='bi-x' />
              </span>
            </button>
          </div>
          {children}
        </animated.div>
      </Dialog>
    </>
  );
};

export default ModalDialog;
