import NavBar from './Navbar/NavBar';
import Sidebar from './Sidebar/Sidebar';
import React from 'react'
import Footer from './Footer/Footer';
import { SessionState } from '~/routes/messenger';

type LayoutProps = {
  children: React.ReactNode,
  sessionState: SessionState
}

const Layout = ({sessionState, children}: LayoutProps) => {
  const [sidebarIsOpen, setSidebarIsOpen] = React.useState(false);
  const toggleSidebar = () => {
    setSidebarIsOpen((state: boolean) => !state);
  };

  return (
    <div>
      <main>
        <NavBar sessionState={sessionState} toggleSidebar={toggleSidebar}></NavBar>
        <Sidebar sidebarIsOpen={sidebarIsOpen} toggleSidebar={toggleSidebar}/>
        {children}
        <Footer/>
      </main>
    </div>
  );
};

export default Layout;
