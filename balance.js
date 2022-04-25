const Balance = () => {
  const ctx = React.useContext(UserContext);
  
  return (
    <Info
      header="Balance"
      users={ctx}
    />
  )
}
