import React, { useContext } from "react";
import { UserContext, Form } from './context';

const Login = () => {
  const ctx = useContext(UserContext);
  const elems = [
    {elem:"input", type:"input", label:"Email address", name:"email", holder:"Enter email", value:""},
    {elem:"input", type:"password", label:"Password", name:"password", holder:"Enter password", value:""}
  ]

  const handle = (data) => {
    ctx.map((user) => user.loggedIn = false)
    ctx.map((user) => {
      if (user.email === data.email && user.password === data.password) {
        user.loggedIn = true;
        document.getElementById('home').click();
        return true;
      }
    })
    return "Login Failed: invalid credentials";
  }
  
  return (
    <Form
      header="Login"
      handle={handle}
      elems={elems}
    />
  )
}

export default Login;