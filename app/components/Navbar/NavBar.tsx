import {
  Collapse,
  Nav,
  Navbar,
  NavbarBrand,
  NavbarToggler,
} from 'reactstrap';
import { Channel, ChannelMessage } from '~/messenger-types';

import ChannelAdmin from '../Messenger/ChannelAdmin';
import { HubConnection } from '@microsoft/signalr';
import { Outlet } from 'remix';

type NavBarProps = {
  existingChannels: Channel[],
  existingMessages: ChannelMessage[],
  loginUser: string,
  clientConnection: HubConnection | null,
  toggleSidebar: () => void
}

const NavBar = ({existingChannels, existingMessages, loginUser, clientConnection, toggleSidebar}: NavBarProps) => {
 
  return (
    <div>
      <Navbar id='navbar' color='secondary' expand='md' dark>
        <NavbarBrand>
          <i
            className='bi-chat-left-dots-fill'
            onClick={() => toggleSidebar()}
            title='open/close Sidebar'
          />
        </NavbarBrand>
        <NavbarToggler onClick={toggleSidebar} />
        <Collapse navbar>
          <Nav className='me-auto' navbar>
              <h4 className='lh-base'> User: {loginUser}</h4>
          </Nav>
          <ChannelAdmin existingChannels={existingChannels} existingMessages={existingMessages} connection={clientConnection}/>
        </Collapse>
      </Navbar>
    </div>
  );
};

export default NavBar;
