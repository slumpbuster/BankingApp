import React, { useState, useContext } from "react";
import { UserContext, checkLogin } from './context';

const NavBar = () => {
  const ctx = useContext(UserContext);
  const [selected, SetSelected] = useState("home");
  const links = [
    {name:"createAccount", href:"#/createAccount/", text:"Create Account", tooltip:"Create a new bank account user"},
    {name:"login", href:"#/login/", text:"Login", tooltip:"Login as a bank account user"},
    {name:"deposit", href:"#/deposit/", text:"Deposit", tooltip:"Deposit funds into a logged in user's account", userhref:"#/login/", username:"login"},
    {name:"withdraw", href:"#/withdraw/", text:"Withdraw", tooltip:"Withdraw funds from a logged in user's account", userhref:"#/login/", username:"login"},
    {name:"allData", href:"#/allData/", tooltip:"View all accounts information", text:"All Data"},
  ];
  
  const handleNav = (element) => (event) => {
    let link = checkLogin(ctx, element.name) ? element.name : element.username;
    SetSelected(link);
    window.location.href = checkLogin(ctx, element.name) ? element.href : element.userhref;
  }
  
  return(
    <nav className="navbar navbar-dark bg-dark navbar-expand-md" style={{padding: "0.75em"}} role="navigation">
      <a id="home" className="linkHover navbar-brand" onClick={handleNav({name:"home",href:"#"})} data-toggle="tooltip" data-placement="bottom" title="Main/Home Page" data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show">BadBank</a>
      <button className="navbar-toggler collapsed ms-auto" data-bs-toggle="collapse" data-bs-target="#navbar-collapse">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbar-collapse">
        <ul className="navbar-nav">
          {links.map((element, index) => (
            <li key={element.name} className="nav-item" data-toggle="tooltip" data-placement="bottom" title={element.tooltip}>
              <a id={element.name} className={selected === element.name ? "linkNavActive nav-link" : "linkHover nav-link"} data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show" onClick={handleNav(element)}>{element.text}</a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

export default NavBar;