import {
  Collapse,
  Nav,
  Navbar,
  NavbarBrand,
  NavbarToggler,
} from 'reactstrap';
import { Channel, ChannelMessage } from '~/messenger-types';

import { useMessengerProvider } from '../Context/MessengerContext';
import ChannelAdmin from '../Messenger/ChannelAdmin';

type NavBarProps = {
  existingChannels: Channel[],
  existingMessages: ChannelMessage[],
  loginUser: string
}

const NavBar = ({existingChannels, existingMessages, loginUser}: NavBarProps) => {
  const { state, toggleSidebar } = useMessengerProvider();

  return (
    <div>
      <Navbar id='navbar' color='primary' expand='md' light>
        <NavbarBrand>
          <i
            className='bi-chat-left-dots-fill'
            onClick={() => toggleSidebar && toggleSidebar()}
            title='open/close Sidebar'
          />
        </NavbarBrand>
        <NavbarToggler onClick={function noRefCheck() {}} />
        <Collapse navbar>
          <Nav className='me-auto' navbar>
              <h4 className='lh-base'> User: {loginUser}</h4>
          </Nav>
          <ChannelAdmin existingChannels={existingChannels} existingMessages={existingMessages}/>
        </Collapse>
      </Navbar>
    </div>
  );
};

export default NavBar;
