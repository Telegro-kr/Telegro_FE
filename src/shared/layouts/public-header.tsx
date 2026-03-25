import { Link } from 'react-router-dom';

const linkClass =
  'title6 text-gray-900 no-underline transition-underline hover:underline';

const PublicHeader = () => {
  return (
    <header className="fixed top-0 z-10 w-full border-b border-[#eee] bg-white px-[3rem] py-[1.6rem]">
      <nav className="flex gap-[3rem] px-[3rem]">
        <Link to="/" className={linkClass}>
          Home
        </Link>
        <Link to="/products" className={linkClass}>
          Product
        </Link>
        <Link to="/notices" className={linkClass}>
          Notice
        </Link>
      </nav>
    </header>
  );
};

export default PublicHeader;
