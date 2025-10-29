import { Link, useLocation } from 'react-router-dom';

export function NavBar() {
  const location = useLocation();

  const hideButtons = location.pathname === '/driver-service/add-new-service-global';

  return (
    <nav className="navbar navbar-expand-lg bg-dark border-bottom border-body" data-bs-theme="dark">
      <div className="container">
        <Link className="navbar-brand" to="/driver-service/add-new-service-global">
          <img src="/plan-list-svgrepo-com.svg" alt="..." width="50" className="me-2" />
          {/** This is a comment */}
          {/** Navbar name below */}
          ServeMySeat
        </Link>

        {!hideButtons && (
          <div className="collapse navbar-collapse show" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link" aria-current="page" to="/Dashboard">
                  Dashboard
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link" to="/driver-service/index">
                  Service List
                </Link>
              </li>
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false">
                  Tools
                </a>
                <ul className="dropdown-menu">
                  <li>
                    <Link className="dropdown-item" to="/driver/index">
                      Drivers
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/department/index">
                      Departments
                    </Link>
                  </li>
                </ul>
              </li>
            </ul>

            <ul className="navbar-nav me-5">
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false">
                  Admin
                </a>
                <ul className="dropdown-menu">
                  <li>
                    <Link className="dropdown-item" to="/Profile">
                      Profile
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="#">
                      E-mail
                    </Link>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <Link className="dropdown-item" to="#">
                      Logout
                    </Link>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
}
