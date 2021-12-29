import { Button, Offcanvas, OffcanvasBody, OffcanvasHeader } from 'reactstrap';
import { useMessengerProvider } from '../Context/MessengerContext';

const Sidebar = () => {
  const { sidebarIsOpen, toggleSidebar } = useMessengerProvider();

  return (
    <>
      <Offcanvas
        color='primary'
        className='sidebar'
        fade={true}
        isOpen={sidebarIsOpen}
        toggle={toggleSidebar}
      >
        <OffcanvasHeader toggle={toggleSidebar}>Menu</OffcanvasHeader>
        <OffcanvasBody>
          <div className='py-2'>
            <Button color='info' onClick={() => toggleSidebar && toggleSidebar()}>
              <i className='bi-patch-question pe-1' />
              About
            </Button>
          </div>
          <div className='py-2'>
            <Button color='info' onClick={() => toggleSidebar && toggleSidebar()}>
              <i className='bi-speedometer pe-1' />
              Dashboard
            </Button>
          </div>
        </OffcanvasBody>
      </Offcanvas>
    </>
  );
};

export default Sidebar;
