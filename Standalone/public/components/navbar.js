const NavBar = (props) => {
  const {setData} = props;
  const ctx = React.useContext(UserContext);
  const [selected, setSelected] = React.useState("home");
  const [user, setUser] = React.useState(null);
  const [account, setAccount] = React.useState(null);
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [employee, setEmployee] = React.useState(false);
  const links = [
    {name:"createAccount", href:"#/createAccount/", text:"Create Account", tooltip:"Create a new bank account user", visible: (!loggedIn || employee), employee: true},
    {name:"editAccount", href:"#/editAccount", text:"Edit Account", tooltip:"Edit acount", visible: false, employee: false},
    {name:"login", href:"#/login/", text:"Login", tooltip:"Login to account", visible: !loggedIn, employee: true},
    {name:"deposit", href:"#/deposit/", text:"Deposit", tooltip:"Deposit funds into account", userhref:"#/login/", username:"login", visible: (loggedIn && !employee), employee: true},
    {name:"withdraw", href:"#/withdraw/", text:"Withdraw", tooltip:"Withdraw funds from account", userhref:"#/login/", username:"login", visible: (loggedIn && !employee), employee: true},
    {name:"transfer", href:"#/transfer/", text:"Transfer", tooltip:"Transfer funds between accounts", userhref:"#/login/", username:"login", visible: (loggedIn && !employee && user!==null && user.accounts!==undefined && user.accounts.length > 1), employee: true},
    {name:"transaction", href:"#/transaction/", text:"Transactions", tooltip:"See History of Transactions", userhref:"#/login/", username:"login", visible: (loggedIn && !employee), employee: true},
    {name:"allData", href:"#/allData/", tooltip:"View all accounts information", text:"All Data", visible: loggedIn, employee: employee},
    {name:"Logoff", href:"#/", text:"Logoff", tooltip:"Logoff", visible:loggedIn, employee:true}
  ];
  const urlHeader = {headers : {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': 'Bearer '+localStorage.getItem("aToken")
  }}
  
  React.useEffect(() => {
    let token = localStorage.getItem("aToken");
    if (token !== null) {
      fetch(`/account/findAuth/`, {method: 'GET', headers: urlHeader.headers})
        .then(response => response.json())
        .then(data => {
          if (!invalid(data)) {
            if (data.balance !== undefined) data.balance = data.balance.length === 0 ? 0 : parseFloat(data.balance);
            setUser(data);
            if (data !== null) {
              setLoggedIn(data.name!==undefined ? true : false);
              setEmployee((data.role!==undefined && data.role==="employee") ? true : false)
              let tmpAccount = decrypt(localStorage.getItem("uToken"),"account");
              setAccount(tmpAccount);
              if (ctx===null) setData(createUToken(data, tmpAccount));
            }
          }
      });
    }
  }, [ctx]);

  const handleNav = (element) => (event) => {
    let link = checkLogin(element.name) ? element.name : element.username;
    if (link === "Logoff") {
      userLoggedOff();
      setLoggedIn(false);
      setEmployee(false);
      setUser(null);
      window.location.href = "#/";
      document.getElementById('home').click();
    } else {
      setSelected(link);
      window.location.href = checkLogin(element.name) ? element.href : element.userhref;
    }
  }

  const onChange = (event) => {
    event.preventDefault();
    let tmpAccount = event.target.value;
    fetch(`/account/createToken/${event.target.value}`, {method: 'POST', headers: urlHeader.headers})
      .then(response => response.json())
      .then(token => {
        setAccount(tmpAccount);
        if (token.error === undefined) {
          let tmpCtx = {"name": user.name, "role":user.role, "balance":user.balance.length === 0 ? 0 : parseFloat(user.balance), account:tmpAccount};
          setData(tmpCtx);
          let encUser = btoa(JSON.stringify(tmpCtx));
          localStorage.setItem('uToken',encUser);
          localStorage.setItem('aToken',token.token);
        }
      })
      .catch(err => {
        console.log(err)
      });
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
              <li key={element.name} className={`nav-item ${!element.employee ? "d-none" : !element.visible ? "d-none" : "d-block"}`} data-toggle="tooltip" data-placement="bottom" title={element.tooltip}>
                <a id={element.name} className={selected === element.name ? "linkNavActive nav-link" : "linkHover nav-link"} data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show" onClick={handleNav(element)}>{element.text}</a>
              </li>
            ))}
          </ul>
        </div>
      </nav>
      <div className="bg-dark text-white" style={{display: "inline", textAlign: "right", margin: "4px 4px"}}>
        {user!==null ?
          employee ? <div  style={{display: "inline", float: "right", margin: "-4px 13px 4px 0px"}}>{user.name}</div>
          : <div style={{display: "inline", float: "right", margin: "-4px 13px 4px 0px"}}>
              <a id="editAccount" style={{display: "inline", textDecoration: "underline", fontWeight: 600, color: "#fff"}} data-bs-toggle="collapse" data-bs-target=".navbar-collapse.show" onClick={handleNav(links.find(elem => elem.name==="editAccount"))}>{user.name}</a>
              <p style={{display: "inline"}}> (${user.balance})</p>
              {account !== null || decrypt(localStorage.getItem("uToken"), "account") !== null ?
                <select id="account" style={{display: "inline", float: "right", marginLeft: "8px", width: "150px"}} defaultValue={account!==null && account!==undefined ? account : decrypt(localStorage.getItem("uToken"), "account") !== null ? decrypt(localStorage.getItem("uToken"), "account") : ""} onChange={(e) => {onChange(e)}}>
                  {user.accounts.map((account, index) => (
                    <option key={index} value={account.actId}>{`${account.type} ($${parseFloat(account.balance).toString()})`}</option>
                  ))}
                </select>
              : <></>}
            </div>
        : ""}
      </div>
    </div>
  );
}