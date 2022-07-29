const NavBar = (data) => {
  const [selected, setSelected] = React.useState("home");
  const [user, setUser] = React.useState(null);
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [admin, setAdmin] = React.useState(false);
  const links = [
    {name:"createAccount", href:"#/createAccount/", text:"Create Account", tooltip:"Create a new bank account user", visible: true, admin: true},
    {name:"login", href:"#/login/", text:"Login", tooltip:"Login to account", visible: !loggedIn, admin: true},
    {name:"deposit", href:"#/deposit/", text:"Deposit", tooltip:"Deposit funds into account", userhref:"#/login/", username:"login", visible: (loggedIn && !admin), admin: true},
    {name:"withdraw", href:"#/withdraw/", text:"Withdraw", tooltip:"Withdraw funds from account", userhref:"#/login/", username:"login", visible: (loggedIn && !admin), admin: true},
    {name:"transaction", href:"#/transaction/", text:"Transactions", tooltip:"See History of Transactions", userhref:"#/login/", username:"login", visible: (loggedIn && !admin), admin: true},
    {name:"allData", href:"#/allData/", tooltip:"View all accounts information", text:"All Data", visible: loggedIn, admin: admin},
    {name:"Logoff", href:"#/", text:"Logoff", tooltip:"Logoff", visible: loggedIn, admin: true}
  ];
  const urlHeader = {headers : {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': 'Bearer '+localStorage.getItem("aToken")
  }}
  
  React.useEffect(() => {
    let token = localStorage.getItem("aToken");
    if (token !== null) {
      fetch(`/account/findAuth/`, urlHeader)
        .then(response => response.json())
        .then(data => {
          if (!invalid(data)) setUser(data);
      });
    }
  }, [data]);
  React.useEffect(() => {
    if (user !== null) {
      setLoggedIn(user.name!==undefined ? true : false);
      setAdmin((user.role!==undefined && user.role==="admin") ? true : false);
    }
  }, [user]);

  const handleNav = (element) => (event) => {
    let link = checkLogin(element.name) ? element.name : element.username;
    if (link === "Logoff") {
      userLoggedOff();
      setLoggedIn(false);
      setAdmin(false);
      setUser(null);
      window.location.href = "#/";
      document.getElementById('home').click();
    } else {
      setSelected(link);
      window.location.href = checkLogin(element.name) ? element.href : element.userhref;
    }
  }
  
  return(
    <div className="bg-dark sticky-top">
      <nav className="navbar navbar-dark bg-dark navbar-expand-md" style={{padding: "0.75em"}} role="navigation">
        <a id="home" className="linkHover navbar-brand" onClick={handleNav({name:"home",href:"#"})} data-toggle="tooltip" data-placement="bottom" title="Main/Home Page" data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show">BadBank</a>
        <button className="navbar-toggler collapsed ms-auto" data-bs-toggle="collapse" data-bs-target="#navbar-collapse">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbar-collapse">
          <ul className="navbar-nav">
            {links.map((element, index) => (
              <li key={element.name} className={`nav-item ${!element.admin ? "d-none" : !element.visible ? "d-none" : "d-block"}`} data-toggle="tooltip" data-placement="bottom" title={element.tooltip}>
                <a id={element.name} className={selected === element.name ? "linkNavActive nav-link" : "linkHover nav-link"} data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show" onClick={handleNav(element)}>{element.text}</a>
              </li>
            ))}
          </ul>
        </div>
      </nav>
      <div className="text-white" style={{textAlign: "right", margin: "0px 13px"}}>{user!==null && `${user.name}`}{(user!==null && user.balance!==undefined && !admin) && ` - $${user.balance}`}</div>
    </div>
  );
}