const CreateAccount = () => {
  const ctx = React.useContext(UserContext);
  const elems = [
    {elem:"input", type:"input", label:"Name", name:"name", holder:"Enter name", value:"", focus:true},
    {elem:"input", type:"input", label:"Email address", name:"email", holder:"Enter email", value:""},
    {elem:"input", type:"password", label:"Password", name:"password", holder:"Enter password", value:""},
    {elem:"input", type:"hidden", name:"balance", value:"0"}
  ]

  const handle = (data) => {
    for (let i=0; i< ctx.length; i++) {
      if (ctx[i].email === data.email) {
        return "Error: email already exists";
        break
      }
    }
    data.balance = data.balance.length === 0 ? 0 : parseFloat(data.balance);
    data.transactions=[];
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