const CreateAccount = () => {
  const ctx = React.useContext(UserContext);
  const elems = [
    {elem:"input", type:"input", label:"Name", name:"name", holder:"Enter name", value:"", focus:true},
    {elem:"input", type:"input", label:"Email address", name:"email", holder:"Enter email", value:""},
    {elem:"input", type:"password", label:"Password", name:"password", holder:"Enter password", value:""},
    {elem:"input", type:"hidden", name:"balance", value:"0"}
  ]

  const handle = (data) => {
    ctx.push(data);
    return true;
  }

  return (
    <Form
      header="Create Account"
      submit="Create Account"
      success="Add another account"
      handle={handle}
      elems={elems}
    />
  )
}