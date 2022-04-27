const Withdraw = () => {
  const ctx = React.useContext(UserContext);
  const header = "Withdraw";
  const elems = [
    {elem:"header", label:"Balance $", name:"current_balance", user:true, value:"balance"},
    {elem:"input", type:"number", step:"0.01", label:"Withdraw Amount", name:"transaction", holder:"Withdraw Amount", value:"", focus:true},
    {elem:"input", type:"hidden", name:"email", user:true, value:"email"}
  ];

  const handle = (data) => {
    data.transaction = data.transaction.length === 0 ? 0 : parseFloat(data.transaction);
    for (let i=0; i< ctx.length; i++) {
      if (ctx[i].email === data.email) {
        if ((ctx[i].balance - data.transaction) < 0) {
          return "Transaction Failed: amount cannot exceed balance";
          break;
        } else {
          let oldBalance = parseFloat(ctx[i].balance);
          let transaction = data.transaction * -1;
          let newBalance = oldBalance + transaction;
          let transactions = [...ctx[i].transactions,...[{starting:oldBalance, transaction:transaction, ending:newBalance}]];
          ctx[i].transactions = [...transactions];
          ctx[i].balance = newBalance;
          return true;
          break;
        }
      }
    }
    return "Error: user not found";
  }

  if (!(checkLogin(ctx, "Deposit"))) {
    return (
      <Info
        header={header}
        title="No user logged in"
        text={`Please log in to make a ${header.toLowerCase()}.`}
      />
    )
  } else {
    return (
      <Form
        header={header}
        submit={header}
        success={`Take another ${header.toLowerCase()}`}
        handle={handle}
        elems={elems}
        users={ctx}
      />
    )
  }
}
