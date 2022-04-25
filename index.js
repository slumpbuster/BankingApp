const Spa = () => {
  const [data, setData] = React.useState(null);
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
      async function getData() {
          const response = await fetch('./users.json');
          const json     = await response.json();
          setData(json);
          setLoaded(true);
      }
      getData();
  },[])

  return (
    <HashRouter>
      <NavBar/>
      {loaded && 
        <UserContext.Provider value={data.users}>
          <div className="container" style={{padding: "20px"}}>
            <Route path="/" exact component={Home} />
            <Route path="/createAccount/" component={CreateAccount} />
            <Route path="/login/" component={Login} />
            <Route path="/deposit/" component={Deposit} />
            <Route path="/withdraw/" component={Withdraw} />
            <Route path="/balance/" component={Balance} />
            <Route path="/allData/" component={AllData} />
          </div>
        </UserContext.Provider>
      }
    </HashRouter>
  );
}

ReactDOM.render(
  <Spa/>,
  document.getElementById('root')
);
