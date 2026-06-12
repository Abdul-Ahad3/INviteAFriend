import { Link } from 'react-router-dom';
import '../App.css';

type HeaderLink = {
  label: string;
  to: string;
};

type HeaderProps = {
  title: string;
  links: HeaderLink[];
};

const Header = ({ title, links }: HeaderProps) => {
  return (
    <header className="header">
      <Link to="/" className="header-logo">
        {title}
      </Link>
      <nav className="header-links" aria-label="Primary navigation">
        {links.map((link) => (
          <Link key={link.to} to={link.to} className="btn btn-outline">
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
};

export default Header;
