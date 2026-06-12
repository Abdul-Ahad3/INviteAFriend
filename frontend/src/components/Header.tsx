import { Link } from 'react-router-dom';
import '../App.css';

type HeaderLink = {
  label: string;
  to: string;
};

type HeaderAction = {
  label: string;
  onClick: () => void;
  active?: boolean;
};

type HeaderProps = {
  title: string;
  links?: HeaderLink[];
  actions?: HeaderAction[];
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
};

const Header = ({
  title,
  links = [],
  actions = [],
  theme,
  onToggleTheme,
}: HeaderProps) => {
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
        {actions.map((action) => (
          <button
            key={action.label}
            type="button"
            className={`btn btn-outline ${action.active ? 'active' : ''}`}
            onClick={action.onClick}
          >
            {action.label}
          </button>
        ))}
        <button type="button" className="btn btn-outline" onClick={onToggleTheme}>
          {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
        </button>
      </nav>
    </header>
  );
};

export default Header;
