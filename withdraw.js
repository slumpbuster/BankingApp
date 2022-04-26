const Withdraw = () => {
  const ctx = React.useContext(UserContext);
  const elems = [
    {elem:"header", label:"", name:"name", user:true, value:"name"},
    {elem:"header", label:"Balance $", name:"current_balance", user:true, value:"balance"},
    {elem:"input", type:"number", label:"Withdraw Amount", name:"transaction", holder:"Withdraw Amount", value:"", focus:true},
    {elem:"input", type:"hidden", name:"balance", user:true, value:"balance"},
    {elem:"input", type:"hidden", name:"email", user:true, value:"email"}
  ]

  const handle = (data) => {
    for (let i=0; i< ctx.length; i++) {
      if (ctx[i].email === data.email) {
        if ((ctx[i].balance - data.transaction) < 0) {
          return "amount cannot exceed balance";
          break;
        } else {
          ctx[i].balance -= data.transaction;
          return true;
          break;
        }
      }
    }
    return "user not found";
  }    

  return (
    <Form
      header="Withdraw"
      submit="Withdraw"
      success="Take another withdraw"
      handle={handle}
      elems={elems}
      users={ctx}
    />
  )
}
