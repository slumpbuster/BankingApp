import React, { useContext } from "react";
import { UserContext, Form, Info, checkLogin } from './context';

const Deposit = () => {
  const ctx = useContext(UserContext);
  const header = "Deposit";
  const elems = [
    {elem:"header", label:"Balance $", name:"current_balance", user:true, value:"balance"},
    {elem:"input", type:"number", step:"0.01", label:"Deposit Amount", name:"transaction", holder:"Deposit Amount", value:"", focus:true},
    {elem:"input", type:"hidden", name:"email", user:true, value:"email"}
  ]

  const handle = (data) => {
    data.transaction = data.transaction.length === 0 ? 0 : parseFloat(data.transaction);
    for (let i=0; i< ctx.length; i++) {
      if (ctx[i].email === data.email) {
        let oldBalance = parseFloat(ctx[i].balance);
        let transaction = data.transaction;
        let newBalance = Math.round(((oldBalance + transaction) + Number.EPSILON) * 100) / 100;
        let transactions = [...ctx[i].transactions,...[{starting:oldBalance, transaction:transaction, ending:newBalance}]];
        ctx[i].transactions = [...transactions];
        ctx[i].balance = newBalance;
        return true;
        //break
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
        success={`Add another ${header.toLowerCase()}`}
        handle={handle}
        elems={elems}
        users={ctx}
      />
    )
  }
}

export default Deposit;