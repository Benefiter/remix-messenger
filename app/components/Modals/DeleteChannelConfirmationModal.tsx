import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import MessengerButton from '../Buttons/MessengerButton';

type DeleteChannelConfirmationModalProps = {
  title: string,
  message: string,
  confirmationAction: () => void,
  cancelAction: () => void,
  isOpen: boolean
}

const DeleteChannelConfirmationModal = ({
  title,
  message,
  confirmationAction,
  cancelAction,
  isOpen
}: DeleteChannelConfirmationModalProps) => {
  return (
    <Modal
      autoFocus={false}
      isOpen={isOpen}
    >
      <ModalHeader>{title}</ModalHeader>
      <ModalBody>
        {message}
      </ModalBody>
      <ModalFooter>
        <MessengerButton name='Cancel' color='secondary' clickHandler={() => cancelAction()}/>
        <MessengerButton
          name='OK'
          color='primary'
          clickHandler={() => confirmationAction()}/>
      </ModalFooter>
    </Modal>
  );
};

export default DeleteChannelConfirmationModal;
