const AllData = () => {
  const ctx = React.useContext(UserContext);
  const headers = Object.keys(ctx[0]);

  return (
    <Card
      headerbgcolor="dark"
      headertxtcolor="white"
      txtcolor="black"
      header={"All Data"}
      body={(
        <table className="table">
          <thead className="thead-secondary bg-secondary">
            <tr>
              {headers.map((hdr) => (
                <th key={hdr} scope="col">{hdr.toUpperCase()}</th>
              ))}
            </tr>
          </thead>
          <tbody>
              {ctx.map((user, index) => (
                <tr key={index}>
                  {headers.map((hdr) => (
                    <td key={`${hdr}_${index}`}>{user[hdr].toString()}</td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      )}
    />
  );
}
