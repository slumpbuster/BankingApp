const Login = () => {
  const ctx = React.useContext(UserContext);
  const elems = [
    {elem:"input", type:"input", label:"Email address", name:"email", holder:"Enter email", value:""},
    {elem:"input", type:"password", label:"Password", name:"password", holder:"Enter password", value:""}
  ]

  const handle = (data) => {
    ctx.map((user) => user.loggedIn = false)
    ctx.map((user) => {
      if (user.email === data.email && user.password === data.password) {
        user.loggedIn = true;
        location.href='#/balance/'
        return true;
      }
    })
    return "invalid credentials";
  }
  
  return (
    <Form
      header="Login"
      submit="Login"
      handle={handle}
      elems={elems}
    />
  )
}