import React from 'react';
import { Actions } from '../../reducers/message/actions';
import {
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from 'reactstrap';
import MessengerButton from '../Buttons/MessengerButton';
import DeleteChannelConfirmationModal from './../Modals/DeleteChannelConfirmationModal';
import AddChannelConfirmationModal from './../Modals/AddChannelConfirmationModal';
import { Channel, ChannelMessage } from '~/messenger-types';
import { startSignalRConnection, stopSignalRConnection } from '~/services/signalR/signalrClient';
import { HubConnection } from '@microsoft/signalr';
import { LoaderFunction, redirect, useLoaderData } from 'remix';

export const loader: LoaderFunction = async ({params}) => {
  console.log('***ChannelAdmin params');
  console.log({params});
  return {connection: startSignalRConnection()}
};

type ChannelAdminProps = {
  existingChannels: Channel[];
  existingMessages: ChannelMessage[];
}
const ChannelAdmin = ({existingChannels, existingMessages}: ChannelAdminProps) => {
  const {connection} = useLoaderData()
  const [channels, setChannels] = React.useState<Channel[]>(existingChannels);
  const [messages, setMessages] = React.useState<ChannelMessage[]>(existingMessages)
  // const { dispatch, connected, getChannelIdFromName } =
  //   useMessengerProvider();
  const [deleteActiveChannel, setDeleteActiveChannel] = React.useState(false);
  const [addChannel, setAddChannel] = React.useState(false);
  const [activeChannel, setActiveChannel] = React.useState(channels.length > 0 ? channels[0].name : '');
  const [clientConnection] = React.useState<HubConnection | null>(connection);
  // const { channels, activeChannel, clientConnection } = state;

  console.log({addChannel})
  const hasChannels = channels?.length > 0;

  const messageAddedCallbackWrapper = (msg: ChannelMessage) => {

  }

  
  const messageDeletedCallbackWrapper = (messageId: Number) => {

  };

  React.useEffect(() => {

    return () => {clientConnection && stopSignalRConnection(clientConnection)};
  },[])

  React.useEffect(() => {
    if (hasChannels && channels.length === 1) {
      setActiveChannel(channels[0].name);
    }
  }, [channels, activeChannel]);

  const unsubscribeFromChannelMessageUpdated = (channelId: string) => {
    if (clientConnection) {
      clientConnection?.off(
        'messageAdded',
        messageAddedCallbackWrapper
      );

      clientConnection?.off(
        'messageDeleted',
        messageDeletedCallbackWrapper
      );
    }
  };

  const getChannelIdFromName = (name: string) => {
    const channel = channels?.find((c: Channel) => c.name === name);

    return channel ? Number(channel.channelId) : 0;
  };

  const deleteChannel = () => {
    if (clientConnection == null) return;

    const channelId = getChannelIdFromName && getChannelIdFromName(activeChannel);
    clientConnection?.invoke('RemoveChannel', channelId).then((_: any) => {
      unsubscribeFromChannelMessageUpdated(channelId?.toString() ?? '0');
      setChannels(channels.filter(c => c.name !== activeChannel))
      redirect('/messenger')
    });

    setDeleteActiveChannel(false);
  };

  // const setActiveChannel = (channel: string) => {
  //   dispatch && dispatch({
  //     type: Actions.setActiveChannel,
  //     payload: { activeChannel: channel },
  //   });
  // };

  // const addChannel = () => {
  //   if (clientConnection) {
  //     clientConnection.invoke('AddChannel', { name }).then((channel: Channel) => {
  //       subscribeToChannelMessageUpdates(channel.channelId);
  //       dispatch && dispatch({ type: Actions.addChannel, payload: channel });
  //       activate && dispatch &&
  //         dispatch({
  //           type: Actions.setActiveChannel,
  //           payload: { activeChannel: name },
  //         });
  //     });
  //   }

  //   setAddChannel(false);
  // };



  return (
    <div className='p-2 d-flex align-items-center'>
      <UncontrolledDropdown disabled={!hasChannels}>
        <DropdownToggle
          disabled={!hasChannels}
          color='bg-dark'
          caret={hasChannels}
        >
          {hasChannels ? (
            'Channels'
          ) : (
            <div>
              {`Please Add Channel `}
              <i className='bi-arrow-right-square-fill'></i>
            </div>
          )}
        </DropdownToggle>
        <DropdownMenu>
          {channels.map(c => (
            <DropdownItem key={c.channelId.toString()} onClick={() => setActiveChannel(c.name)}>
              {c.name}
            </DropdownItem>
          ))}
        </DropdownMenu>
      </UncontrolledDropdown>
      {hasChannels && (
        <MessengerButton
          name='Delete'
          disabled={activeChannel === ''}
          clickHandler={() => setDeleteActiveChannel(true)}
          title='Delete Active Channel'
        />
      )}
      <MessengerButton
        clickHandler={() => setAddChannel(true)}
        className='ms-2'
        title='Add Channel'
        name='Add'
      />
      <DeleteChannelConfirmationModal
        isOpen={deleteActiveChannel}
        title={'Confirm Deletion'}
        message={`Are  you sure you want to delete channel ${activeChannel} ?`}
        confirmationAction={() => {
          deleteChannel();
        }}
        cancelAction={() => setDeleteActiveChannel(false)}
      />
      <AddChannelConfirmationModal
        confirmationAction={() => {
          setAddChannel(false);
          redirect('/messenger')
        }}
        cancelAction={() => setAddChannel(false)}
        isOpen={addChannel}
      />
    </div>
  );
};

export default ChannelAdmin;
