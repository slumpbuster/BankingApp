const Deposit = () => {
  const ctx = React.useContext(UserContext);
  const elems = [
    {elem:"header", label:"Balance $", name:"current_balance", user:true, value:"balance"},
    {elem:"input", type:"number", step:"0.01", label:"Deposit Amount", name:"transaction", holder:"Deposit Amount", value:"", focus:true},
    {elem:"input", type:"hidden", name:"email", user:true, value:"email"}
  ]

  const handle = (data) => {
    data.transaction = data.transaction.length === 0 ? 0 : parseFloat(data.transaction);
    for (let i=0; i< ctx.length; i++) {
      if (ctx[i].email === data.email) {
        ctx[i].balance = parseFloat(ctx[i].balance) + data.transaction;
        return true;
        break
      }
    }
    return "Error: user not found";
  }

  return (
    <Form
      header="Deposit"
      submit="Deposit"
      success="Add another deposit"
      handle={handle}
      elems={elems}
      users={ctx}
    />
  )
}
