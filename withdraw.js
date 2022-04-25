const Withdraw = () => {
  const ctx = React.useContext(UserContext);

  const handle = (data) => {
    for (let i=0; i< ctx.length; i++) {
      if (ctx[i].email === data.email) {
        ctx[i].balance -= data.transaction;
        return true;
        break;
      }
    }
    return "user not found";
  }    

  return (
    <Form
      header="Withdraw"
      handle={handle}
      users={ctx}
    />
  )
}
