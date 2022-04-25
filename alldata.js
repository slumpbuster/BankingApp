const AllData = () => {
  const ctx = React.useContext(UserContext);
  return (
    <>
    <h5>All Data in Store</h5>
    <br/>
    {JSON.stringify(ctx)}
    </>
  );
}
