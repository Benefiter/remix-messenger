import { Channel } from '~/messenger-types';
import NavBar from './Navbar/NavBar';
import Sidebar from './Sidebar/Sidebar';

type LayoutProps = {
  children: React.ReactNode,
  existingChannels: Channel[],
  existingMessages: ChannelMessage[],
  loginUser: string
}

const Layout = ({ children, existingChannels, existingMessages, loginUser } : LayoutProps) => {
  return (
    <div>
      <main>
        <NavBar existingChannels={existingChannels} existingMessages={existingMessages} loginUser={loginUser}></NavBar>
        <Sidebar/>
        {children}
      </main>
    </div>
  );
};

export default Layout;
