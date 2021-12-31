import { Collapse, Nav, Navbar, NavbarBrand, NavbarToggler } from 'reactstrap';
import { SessionState } from '~/routes/messenger';
import ChannelAdmin from '../Messenger/ChannelAdmin';

type NavBarProps = {
  sessionState: SessionState;
  toggleSidebar: () => void;
};

const NavBar = ({ sessionState, toggleSidebar }: NavBarProps) => {
  const { loginUser, channels } = sessionState;
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
          <ChannelAdmin channels={channels} />
        </Collapse>
      </Navbar>
    </div>
  );
};

export default NavBar;
