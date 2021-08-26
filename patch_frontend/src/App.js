import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import SideBar from "./components/SideBar";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-bootstrap-table/dist/react-bootstrap-table-all.min.css";
import "./assets/css/style.css";
import "./assets/css/Themes/yellow.css";
import "@fortawesome/fontawesome-free/css/all.css";

function App() {
  return (
    <>
      <Header />

      <div className="sideNavBar">
        <SideBar />
      </div>
      <Footer />
    </>
  );
}

export default App;
