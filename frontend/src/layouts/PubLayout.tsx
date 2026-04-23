import Header from '../components/Header';
import Footer from '../components/Footer';
import { Outlet } from 'react-router-dom';


function PubLayout() {
  return (
    <div className="pub-layout">
      <Header title={'InviteAFriend'} buttons={['Getting Started', 'Login/Signup']} />
      <Outlet />
      <Footer />
    </div>
  );
}

export default PubLayout;