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
    {loaded && 
      <UserContext.Provider value={data.users}>
        <NavBar/>
          <div className="container" style={{padding: "20px"}}>
            <Route path="/" exact component={Home} />
            <Route path="/createAccount/" component={CreateAccount} />
            <Route path="/login/" component={Login} />
            <Route path="/deposit/" component={Deposit} />
            <Route path="/withdraw/" component={Withdraw} />
            <Route path="/allData/" component={AllData} />
          </div>
        </UserContext.Provider>
      }
    </HashRouter>
  );
}

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(<Spa/>);
/*ReactDOM.render(
  <Spa/>,
  document.getElementById('root')
);*/
