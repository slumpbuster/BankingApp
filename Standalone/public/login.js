const Login = (props) => {
  const setData = props.setData;
  const [show, setShow] = React.useState(true);
  const [status, setStatus] = React.useState('');
  const [admin, setAdmin] = React.useState(false);
  const elems = [
    {elem:"input", type:"input", label:"Email address", name:"email", holder:"Enter email", value:""},
    {elem:"input", type:"password", label:"Password", name:"password", holder:"Enter password", value:""}
  ]

  const clearForm = () => {
    setShow(true);
    const path = admin ? "allData" : "transaction";
    window.location.href = `#/${path}/`;
    document.getElementById(path).click();
  }

  const handle = (data) => {
    setData(null);
    setStatus('');
    userLoggedOff();
    fetch(`/account/login/${data.email}/${btoa(data.password)}`)
      .then(response => response.json())
      .then(user => {
        if (user.error !== undefined) {
          setStatus(user.error);
        } else {
          const auth = firebase.auth();
          auth.signInWithEmailAndPassword(data.email, data.password)
            .then(authUser => {
              let encUser = btoa(JSON.stringify({name: user.name, role: user.role, balance: user.balance}));
              localStorage.setItem('uToken',encUser);
              localStorage.setItem('aToken',user.token);
              setData({"user":user.role, "balance":user.balance});
              setAdmin(user.role === "admin");
              setShow(false);
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
  
  return (
    <Form
      header="Login"
      success="Ok"
      handle={handle}
      clearForm={clearForm}
      show={show}
      status={status}
      elems={elems}
    />
  )
}