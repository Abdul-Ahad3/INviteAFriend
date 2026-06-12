import Header from '../components/Header';
import Footer from '../components/Footer';
import { Outlet } from 'react-router-dom';


function DashLayout() {
  return (
    <div className="pub-layout">
      <Header
        title="Dashboard"
        links={[
          { label: 'Switch Profiles', to: '/dashboard' },
          { label: 'My Profile', to: '/dashboard' },
          { label: 'Logout', to: '/' },
        ]}
      />
      <Outlet />
      <Footer />
    </div>
  );
}

export default DashLayout;
