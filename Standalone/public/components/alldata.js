const AllData = () => {
  const ctx = React.useContext(UserContext);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);
  const [allUsers, setAllUsers] = React.useState([]);
  const [users, setUsers] = React.useState([]);
  const [accounts, setAccounts] = React.useState([]);
  const [employee, setEmployee] = React.useState(false);
  const [isDisabled, setIsDisabled] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [header, setHeader] = React.useState("Transactions");
  const [headers, setHeaders] = React.useState(["name", "balance"]);
  const [actHeaders, setActHeaders] = React.useState(["type", "balance"]);
  const [transactions, setTransactions] = React.useState(["date", "type", "starting", "transaction", "ending", "image"]);  
  const urlHeader = {headers : {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': 'Bearer '+localStorage.getItem("aToken")
  }}

  React.useEffect(() => {
    fetch(`/account/findAuth/`, urlHeader)
      .then(response => response.json())
      .then(data => {
        if (!invalid(data)) {
          setLoading(false);
          setEmployee(data.role === "employee");
          if (data.role === "employee") {
            setHeader("All Users Data");
            setHeaders(["authId", "name", "email", "password", "status", "balance"]);
            setTransactions(["transId", "date", "type", "starting", "transaction", "ending", "image"]);
            fetch(`/account/all/`, urlHeader)
              .then(response => response.json())
              .then(data => {
                if (!invalid(data)) {
                  setAllUsers(data);
                  filterItems();
                }
            });
          } else {
            setHeader("Transactions");
            setAllUsers([data]);
            setUsers([data]);
            setAccounts([data.accounts]);
            filterAccount();
          }
        } else {
          setError(true);
        }
      })
      .catch(error => {
        setLoading(false);
        setError(true);
      });
  }, []);
  React.useEffect(() => {
    filterItems();
  }, [allUsers, query, isDisabled, ctx]);
  React.useEffect(() => {
    filterAccount();
  }, [accounts, ctx]);

  const filterAccount = () => {
    if (ctx!==null && ctx.account!==undefined) {
      let filteredEvents = [];
      let filter = [...accounts];
      if (filter.length > 0) {
        filter.map(flt => {
          for (let i = 0; i < flt.length; i++) {
            if (flt[i].actId === ctx.account) {
              filteredEvents.push(flt[i]);
              break;
            }
          }
        });
        filter = [...users];
        filter[0].accounts = filteredEvents;
        setUsers(filter);
      }
    }
  }
  const filterDisabled = (e) => {
    setIsDisabled(e.target.checked);
  }
  const filterItems = () => {
    let filteredEvents = [];
    let filter = [...allUsers];
    let act = isDisabled;
    let searchValue = query.toLowerCase();
    if (act) filter = filter.filter((flt) => flt.status.toLowerCase().includes('disabled'));
    if (searchValue.length === 0) {
      filteredEvents = filter;
    } else {
      filteredEvents = filter.filter((fltr) => String(fltr.email).toLowerCase().indexOf(searchValue) >= 0 || String(fltr.name).toLowerCase().indexOf(searchValue) >= 0);
    }
    setUsers(filteredEvents);
  };

  const viewImage  = (transId) => {
    const storage = firebase.storage();
    const storageRef = storage.ref();
    const ref = storage.ref(transId);
    ref.getDownloadURL()
      .then(function(url) {
        let filter = [...allUsers];
        const display = () => {
          for (let i=0; i<filter.length; i++) {
            if (filter[i].transactions !==undefined) {
              for (let j=0; j<filter[i].transactions.length; j++) {
                if (filter[i].transactions[j].transId === transId) {
                  return `Deposit on ${filter[i].transactions[j].date} for $${filter[i].transactions[j].transaction}`
                  break;
                }
              }
            }
          }
          return `Transaction: ${transId}`;
        }
        modalImgDisplay(url, display());
      })
      .catch(function(error){
        console.log(error)
      });
  }
  const enableUer = (e, authId, curStatus) => {
    let elem = e.target;
    let filter = [...allUsers].filter((flt) => flt.authId===authId);
    var proceed = confirm(`Are you sure you want to change ${filter[0].name} account's status to ${e.target.value}?`);
    if (proceed) {
      fetch(`/account/status/${e.target.value==="active" ? 0 : 6}/${authId}`, urlHeader)
        .then(response => response.json())
        .then(data => {
          if (!invalid(data)) {
            let tmpUser = [...allUsers];
            tmpUser.forEach((user) => {
              if (user.authId === data.authId) {
                user.status = data.status;
                user.failedAttempts = data.failedAttempts;
              }
            });
            setAllUsers(tmpUser);
            filterItems();
          }
        });
    } else {
      e.target.value = curStatus;
    }
  }
  
  /*users.map((user) => {
    user.transactions !== undefined &&
    user.transactions.sort(function(a, b) {
      var dateA = new Date(a.date), dateB = new Date(b.date)
      return dateA - dateB;
    });
  });*/
  if (employee) {
    users.sort(function(a, b) {
      if (a.email < b.email) { return -1; }  
      if (a.email > b.email) { return 1; }  
      return 0;
    });
  }

  if (loading) {
    return (
      <Info
        header="BadBank MERN Application"
        title="Please wait while we load your account information."
        body={(<img src="./assets/images/Loading.gif" className="img-fluid" alt="Loading"/>)}
      />
    )
  } else if (error) {
    return (
      <Info
        header="BadBank MERN Application"
        title="An Error has occured. Please try logging in again."
        body={(<img src="./assets/images/Error.jpg" className="img-fluid" alt="Error"/>)}
      />
    ) 
  } else {
    return (
      <Info
        headerbgcolor="secondary"
        headertxtcolor="dark"
        txtcolor="dark"
        maxWidth="70rem"
        header={header}
        body=
          {<>
            {employee &&
              <div className="nav">
                <div className="nav" style={{display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px", gridAutoRows: "minmax(50px, auto)"}}>
                  <div className="navslider" style={{gridColumn: 1}}>
                    <label style={{margin: `0px 2px`}}>Only Disabled</label>
                    <label className="switch" style={{marginLeft: 6+`px`}}>
                      <input id={'isDisabled'} type="checkbox" checked={isDisabled} onChange={(e)=>{filterDisabled(e)}}/>
                      <span className="slider round"></span>
                    </label>
                  </div>
                  <div className="navbutton" style={{marginBottom: "12px", display: "inline"}}>
                    <span>Filter by name/email: </span>
                    <input id="search" type="text" value={query} onChange={event => setQuery(event.target.value)} style={{flexGrow: 1}}/>
                    <button onClick={(e) => filterItems()} className="btn btn-secondary btn-sm" style={{flex: `0 0 75px`, float: `right`, marginLeft: `4px`}}>Filter</button>
                  </div>
                </div>
              </div>
            }
            {users.filter(user => user.role!=="employee").map((user, index) => (
              <table key={`User_${user.authId}`} className="table">
                <thead className="thead-dark bg-dark text-light">
                  <tr>
                    {headers.map((hdr) => (
                      <th key={hdr} scope="col">{hdr.toUpperCase()}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {headers.map((hdr) => (
                      <td key={`${hdr}_${index}`}>
                        {hdr==="status" ?
                          <select id={`${hdr}_${index}`} defaultValue={user[hdr]} onChange={(e) => {enableUer(e, user['authId'], user[hdr])}}>
                            <option value="active">Active</option>
                            <option value="disabled">Disabled</option>
                          </select>
                        : user[hdr]!==undefined ?
                          hdr==="balance" ?
                            "$" + parseFloat(user[hdr]).toString()
                          : user[hdr].toString()
                        : <></>}
                      </td>
                    ))}
                  </tr>
                  <tr>
                    <td colSpan={headers.length}>
                      {user.accounts.map((account, index) => (                          
                        <table key={`Account_${account.actId}`} className="table">
                          <thead className="thead-secondary bg-secondary text-dark">
                            <tr>
                              {actHeaders.map((hdr) => (
                                <th key={hdr} scope="col">{hdr.toUpperCase()}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              {actHeaders.map((hdr) => (
                                <td key={`${hdr}_${index}`}>
                                  {account[hdr]!==undefined ?
                                    hdr==="balance" ?
                                      "$" + parseFloat(account[hdr]).toString()
                                    : account[hdr].toString()
                                  : <></>}
                                </td>
                              ))}
                            </tr>
                            <tr>
                              <td colSpan={actHeaders.length}>                                
                                <table className="table">
                                  <thead className="thead-light bg-light">
                                    <tr>
                                      {transactions.map((hdr) => (
                                        <th key={hdr} scope="col">{hdr.toUpperCase()}</th>
                                      ))}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {account.transactions!==undefined && account.transactions.map((transaction, i) => (
                                      <tr key={`Trans_${index}._${i}`}>
                                        {transactions.map((hdr) => (
                                          <td key={`${hdr}_${index}`}>
                                            {transaction[hdr]!==undefined ?
                                              hdr==="date" ?
                                                formatDate(transaction[hdr])
                                              : ["starting", "transaction", "ending"].includes(hdr) ?
                                                "$"+parseFloat(transaction[hdr]).toString()
                                              : hdr!=="image" ?
                                                transaction[hdr].toString()
                                              : hdr==="image" && transaction[hdr] ?
                                                <a onClick={(e) => viewImage(transaction['transId'])} target="_blank" rel="noopener noreferrer" className="linkNavActive linkHover">View</a>
                                                : <></>
                                            : <></>}
                                          </td>
                                        ))}
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      ))}
                    </td>
                  </tr>
                </tbody>
              </table>
            ))}
            <div id="myModal" className="modal">
              <span className="close">&times;</span>
              <img className="modal-content" id="imgModal" alt="transaction"/>
              <div id="caption"></div>
            </div>
          </>
        }
      />
    );
  }
}