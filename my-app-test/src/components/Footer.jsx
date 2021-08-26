import React from "react";

const Footer = () => {
  return (
    <>
      <br />
      <br />
      <footer>
        <nav className="navbar fixed-bottom-footer navbar-light bg-dark">
          <div className="container">
            <div className="copyright">
              <span>&copy; DXC Technology. All right reserved</span>
            </div>
            <div className="copyright">
              <span>Innovation & DevOps (Hybrid Cloud)</span>
            </div>
            <div className="credits">
              <ul className="social-network">
                <li>
                  <a
                    href="https://www.facebook.com/DXCTechnology"
                    data-placement="bottom"
                    title="Facebook"
                  >
                    <i className="fab fa-facebook-f icon-white"></i>
                  </a>
                </li>
                <li>
                  <a
                    href="https://twitter.com/dxctechnology"
                    data-placement="bottom"
                    title="Twitter"
                  >
                    <i className="fab fa-twitter icon-white"></i>
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.linkedin.com/company/dxctechnology"
                    data-placement="bottom"
                    title="Linkedin"
                  >
                    <i className="fab fa-linkedin icon-white"></i>
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.instagram.com/DxcTechnology/"
                    data-placement="bottom"
                    title="Instagram"
                  >
                    <i className="fab fa-instagram  icon-white"></i>
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.youtube.com/DXCTechnology"
                    data-placement="bottom"
                    title="YouTube"
                  >
                    <i className="fab fa-youtube icon-white"></i>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </footer>
    </>
  );
};

export default Footer;
