const Login = (props) => {
  const ctx = React.useContext(UserContext);
  const {setData} = props;
  const [show, setShow] = React.useState(true);
  const [status, setStatus] = React.useState('');
  const [employee, setEmployee] = React.useState(false);
  const [header, setHeader] = React.useState('Login');
  const [user, setUser] = React.useState(null);
  const [elems, setElems] = React.useState([
    {elem:"input", type:"email", label:"Email address", name:"email", holder:"Enter email", value:""},
    {elem:"input", type:"password", label:"Password", name:"password", holder:"Enter password", value:""}
  ]);

  const clearForm = () => {
    setShow(true);
    const path = employee ? "allData" : "transaction";
    window.location.href = `#/${path}/`;
    document.getElementById(path).click();
  }

  const handle = (data) => {
    setData(null);
    setStatus('');
    userLoggedOff();
    fetch(`/account/login/${data.email}/${btoa(data.password)}`, {method: 'POST'})
      .then(response => response.json())
      .then(user => {
        if (user.error !== undefined) {
          setStatus(user.error);
        } else {
          const auth = firebase.auth();
          auth.signInWithEmailAndPassword(data.email, data.password)
            .then(authUser => {
              let token = user.token;
              user = user.user;
              setHeader('Welcome ' + user.name);
              setEmployee(user.role === "employee");
              localStorage.setItem('aToken',token);
              if (user.role === 'employee') {
                setUser(user);
                setData(createUToken(user, null));
                setUser(user);
                setShow(false);
              } else {
                let accounts = [];
                user.accounts.map(account => {
                  accounts.push({id: account.actId, name: account.type, value: account.actId});
                });
                setElems([
                  {elem:"label", name:"accountSelection", value:"Select the account you want to view"},
                  {elem:"select", object:accounts, label:"Account(s)", name:"account", value:user.accounts.length > 0 ? user.accounts[0].actId : ""}
                ]);
                setUser(user);
                setShow(null);
              }
            })
            .catch(error => {
              setStatus("Login Failed: invalid credentials");
            });
        }
      })
      .catch(error => {
        setStatus("Login Failed: invalid email");
      })
  }
  
  const handle2 = (data) => {
    const urlHeader = {headers : {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Bearer '+localStorage.getItem("aToken")
    }}
    fetch(`/account/createToken/${document.getElementById("account").value}`, {method: 'POST', headers: urlHeader.headers})
      .then(response => response.json())
      .then(token => {
        if (token.error !== undefined) {
          setStatus(token.error);
        } else {
          setData(createUToken(user, document.getElementById("account").value));
          localStorage.setItem('aToken',token.token);
          const path = employee ? "allData" : "transaction";
          window.location.href = `#/${path}/`;
          document.getElementById(path).click();
        }
      })
      .catch(error => {
        setStatus(error.error);
      });
  }

  return (
    <Form
      header={header}
      success="Ok"
      handle={handle}
      handle2={handle2}
      clearForm={clearForm}
      show={show}
      status={status}
      elems={elems}
    />
  )
}