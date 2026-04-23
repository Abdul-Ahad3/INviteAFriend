import Header from '../components/Header';
import Footer from '../components/Footer';
import { Outlet } from 'react-router-dom';


function DashLayout() {
  return (
    <div className="pub-layout">
      <Header title={'Dashboard'} buttons={['Switch Profiles', 'My Profile', 'Logout']} />
      <Outlet />
      <Footer />
    </div>
  );
}

export default DashLayout;