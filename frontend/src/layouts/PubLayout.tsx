import Header from '../components/Header';
import Footer from '../components/Footer';
import { Outlet } from 'react-router-dom';


function PubLayout() {
  return (
    <div className="pub-layout">
      <Header
        title="InviteAFriend"
        links={[
          { label: 'Get Started', to: '/tutorial' },
          { label: 'Login/Signup', to: '/logsign' },
        ]}
      />
      <Outlet />
      <Footer />
    </div>
  );
}

export default PubLayout;
