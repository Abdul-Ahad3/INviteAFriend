import Header from '../components/Header';
import Footer from '../components/Footer';
import { Outlet } from 'react-router-dom';


function DashLayout() {
  return (
    <div className="pub-layout">
      <Header
        title="Dashboard"
        links={[
          { label: 'Profile', to: '/dashboard' },
        ]}
        actions={[{ label: 'Visitor Mode', onClick: () => undefined, active: true }]}
        theme="light"
        onToggleTheme={() => undefined}
      />
      <Outlet />
      <Footer />
    </div>
  );
}

export default DashLayout;
