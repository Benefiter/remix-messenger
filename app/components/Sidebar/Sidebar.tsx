import { Offcanvas, OffcanvasBody, OffcanvasHeader } from 'reactstrap';
import { Link, Form } from 'remix'

type SidebarProps = {
  sidebarIsOpen: boolean,
  toggleSidebar: () => void
}
const Sidebar = ({ sidebarIsOpen, toggleSidebar }: SidebarProps) => {

  return (
    <>
      <Offcanvas
        color='primary'
        className='sidebar'
        fade={true}
        isOpen={sidebarIsOpen}
        toggle={toggleSidebar}
        style={{width: 'fit-content', minWidth: '200px'}}
      >
        <OffcanvasHeader toggle={toggleSidebar}>Menu</OffcanvasHeader>
        <OffcanvasBody>
          <Form method='post'>
            <Link onClick={() => toggleSidebar && toggleSidebar()} className='navbar-link btn btn-primary text-decoration-none' to='/sidebar/about'>
              About
            </Link>
            <Link onClick={() => toggleSidebar && toggleSidebar()} className='navbar-link btn btn-primary text-decoration-none' to='/sidebar/dashboard'>
              Dashboard
            </Link>
          </Form>
        </OffcanvasBody>
      </Offcanvas>
    </>
  );
};

export default Sidebar;
