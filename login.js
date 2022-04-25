const Login = () => {
  const ctx = React.useContext(UserContext);  

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
      handle={handle}
    />
  )
}