import { Channel, ChannelMessage } from '~/messenger-types';
import NavBar from './Navbar/NavBar';
import Sidebar from './Sidebar/Sidebar';
import { HubConnection } from '@microsoft/signalr';
import React from 'react'
import { Outlet } from 'remix';

type LayoutProps = {
  children: React.ReactNode,
  existingChannels: Channel[],
  existingMessages: ChannelMessage[],
  loginUser: string,
  clientConnection: HubConnection | null
}

const Layout = ({ children, existingChannels, existingMessages, loginUser, clientConnection } : LayoutProps) => {
  const [sidebarIsOpen, setSidebarIsOpen] = React.useState(false);
  const toggleSidebar = () => {
    setSidebarIsOpen((state: boolean) => !state);
  };

  return (
    <div>
      <main>
        <NavBar existingChannels={existingChannels} existingMessages={existingMessages} loginUser={loginUser} clientConnection={clientConnection} toggleSidebar={toggleSidebar}></NavBar>
        <Sidebar sidebarIsOpen={sidebarIsOpen} toggleSidebar={toggleSidebar}/>
        {children}
      </main>
    </div>
  );
};

export default Layout;
