import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import React from 'react';
import {
  startSignalRConnection,
  stopSignalRConnection,
} from '../../services/signalR/signalrClient';
import MessengerButton from '../Buttons/MessengerButton';
import { Channel, ChannelMessage } from '~/messenger-types';
import { LoaderFunction, useLoaderData } from 'remix';
import { HubConnection } from '@microsoft/signalr';

type AddChannelConfirmationModalProps = {
  confirmationAction: () => void;
  cancelAction: () => void;
  isOpen: boolean;
};

export const loader: LoaderFunction = async ({params}) => {
  console.log('***params');
  console.log({params});
  return {connection: startSignalRConnection()}
};


const AddChannelConfirmationModal = ({
  confirmationAction,
  cancelAction,
  isOpen,
}: AddChannelConfirmationModalProps) => {
  const {connection} = useLoaderData();
  const [name, setName] = React.useState('');
  const [activate, setActivate] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [clientConnection] =
    React.useState<HubConnection | null>(connection);

  console.log('AddchannelConfirmationModal ');
  console.log({clientConnection})

  React.useEffect(() => {
    console.log('AddchannelConfiramtionModl useEffect *****')
    return () => {
      clientConnection && stopSignalRConnection(clientConnection);
    };
  }, []);

  // React.useEffect(() => {
  //   setError(channels?.some(c => c.name === name));
  // }, [name]);

  React.useEffect(() => {
    if (!isOpen) {
      setName('');
      setActivate(false);
      setError(false);
    }
  }, [isOpen]);

  const messageAddedCallbackWrapper = (msg: ChannelMessage) => {};

  const messageDeletedCallbackWrapper = (messageId: Number) => {};

  const subscribeToChannelMessageUpdates = (channelId: Number) => {
    if (clientConnection) {
      clientConnection.invoke('SubscribeToMessageChannel', channelId);

      clientConnection.on('messageAdded', messageAddedCallbackWrapper);

      clientConnection.on('messageDeleted', messageDeletedCallbackWrapper);

      // Already being handle from the channel changes subscription
      // clientConnection.on('channelDeleted', channelId => {
      //   dispatch({ type: actions.removeChannel, payload: channelId });
      // });
    }
  };

  const addChannel = () => {
    if (clientConnection) {
      clientConnection
        .invoke('AddChannel', { name })
        .then((channel: Channel) => {
          subscribeToChannelMessageUpdates(channel.channelId);
          confirmationAction()
        });
    }
  };

  return (
    <Modal autoFocus={false} isOpen={isOpen}>
      <ModalHeader>Create Channel</ModalHeader>
      <ModalBody>
        <h4 className='pe-2 pb-2'>Channel Name</h4>
        <input
          autoFocus
          className='w-100'
          type='text'
          placeholder='Enter Channel Name'
          value={name}
          onChange={e => setName(e.target.value)}
        />
        {error && (
          <div className='chan-error'>Channel name already exists.</div>
        )}
        <label className='p-2 align-middle' id='activate'>
          Activate
        </label>
        <input
          className={`mt-1 align-middle`}
          id='activate'
          type='checkbox'
          checked={activate}
          onChange={e => setActivate(e.target.checked)}
        />
      </ModalBody>
      <ModalFooter>
        <MessengerButton
          name='Cancel'
          color='secondary'
          clickHandler={() => cancelAction()}
        />
        <MessengerButton
          disabled={name === '' || error}
          color='primary'
          clickHandler={() => addChannel()}
          name='OK'
        />
      </ModalFooter>
    </Modal>
  );
};

export default AddChannelConfirmationModal;
