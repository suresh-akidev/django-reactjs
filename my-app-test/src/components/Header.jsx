import React from "react";
import logo from "./../assets/img/dxc_logo_hz_wht_rgb_150.png";
import { Tooltip, OverlayTrigger } from "react-bootstrap";
const Header = () => {
  return (
    <>
      <header>
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark justify-content-between d-flex fixed-top-header">
          <div className="container">
            <a className="navbar-brand" href="./">
              <img src={logo} alt=""></img>
            </a>
            <div className="copyright">
              <h5 className="mb-0">Patch Automation</h5>
            </div>

            <div className="justify-content-end">
              <div className="credits">
                <ul className="social-network">
                  <li>
                    <OverlayTrigger
                      placement="bottom"
                      overlay={<Tooltip id="Home">Home</Tooltip>}
                    >
                      <a href="/" data-placement="bottom">
                        <i className="fas fa-home fa-lg icon-white"></i>
                      </a>
                    </OverlayTrigger>
                  </li>
                  <li></li>
                  <li>
                    <OverlayTrigger
                      placement="bottom"
                      overlay={<Tooltip id="logout">Sign Out</Tooltip>}
                    >
                      <a href="/logout" data-placement="bottom">
                        <i className="fas fa-door-open fa-lg icon-white"></i>
                      </a>
                    </OverlayTrigger>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
};

export default Header;
