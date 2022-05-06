import React, { useContext } from "react";
import { UserContext , Info } from './context';

const AllData = () => {
  const ctx = useContext(UserContext);
  //const headers = Object.keys(ctx[0]).filter((header) => header != 'transactions');
  const headers = ["name", "email", "password", "balance"];
  const transactions = ["starting", "transaction", "ending"];

  return (
    <Info
      headerbgcolor="secondary"
      headertxtcolor="dark"
      txtcolor="dark"
      maxWidth="60rem"
      header={"All Data"}
      body=
        {ctx.map((user, index) => (
          <table key={`data_${index}`} className="table">
            <thead className="thead-dark bg-dark text-light">
              <tr>
                {headers.map((hdr) => (
                  <th key={hdr} scope="col">{hdr.toUpperCase()}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr key={`User_${index}`}>
                {headers.map((hdr) => (
                  <td key={`${hdr}_${index}`}>{user[hdr].toString()}</td>
                ))}
              </tr>
              <tr>
                <td colSpan={headers.length}>
                  <table className="table">
                    <thead className="thead-light bg-light">
                      <tr>
                        {transactions.map((hdr) => (
                          <th key={hdr} scope="col">{hdr.toUpperCase()}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {user.transactions.map((transaction, i) => (
                        <tr key={`Trans_${index}._${i}`}>
                          {transactions.map((hdr) => (
                            <td key={`${hdr}_${index}`}>{transaction[hdr].toString()}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>
        )
      )}
    />
  );
}

export default AllData;