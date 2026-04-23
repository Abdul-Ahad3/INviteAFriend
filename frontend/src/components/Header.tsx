import { Link } from 'react-router-dom';
import '../App.css';

type HeaderProps = {
  title: string;
  buttons: string[];
};

const Header = ({ title, buttons }: HeaderProps) => {
  return (
    <header className="header">
      <Link to="/" className="header-logo">
        <div className="header-logo">{title}</div>
      </Link>
      <div className="header-links">
        {buttons.map((button, index) => (
          <button key={index} className="btn btn-outline">
            {button}
          </button>
        ))}

        <Link to="/logsign" className="btn btn-outline">
          Login/Signup
        </Link>
        <Link to="/tutorial" className="btn btn-outline">
          Get Started
        </Link>
      </div>
    </header>
  );
};

export default Header;