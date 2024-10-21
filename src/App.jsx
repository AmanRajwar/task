//did not know how to find all the submission there is no such data in the api otherwise I would have implemented it  


import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [data, setData] = useState({});
  const [option, setOption] = useState('all');
  const [fromDate, setFromDate] = useState('2024-04-01');
  const [toDate, setToDate] = useState('2024-06-30');
  const [totalCost, setTotalCost] = useState(0);
  const [isLoading, setIsLoading] = useState(true); // Added loading state

  const fetchData = async () => {
    setIsLoading(true); // Show loading indicator
    try {
      const response = await fetch(`https://napi.authkey.io/api/react_test?from_date=${fromDate}&to_date=${toDate}`);
      if (!response.ok) {
        throw new Error("Error in fetching data");
      }

      const result = await response.json();
      setData(result.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false); // Hide loading indicator when data is fetched
    }
  };

  // Fetching data at initial mount
  useEffect(() => {
    fetchData();
  }, []);

  // Finding total cost
  useEffect(() => {
    let total = 0;
    Object.entries(data).map(([companyName, value1]) => {
      Object.entries(value1).map(([countryCode, value2]) => {
        Object.entries(value2).map(([key3, value3]) => {
          total += value3.totalcost;
        });
      });
    });
    setTotalCost(total.toFixed(5));
  }, [data]);

  // Handling option changes for company
  const handleOptionChange = (event) => {
    setOption(event.target.value);
  };

  // Form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    fetchData();
  };

  // Handle reset button
  const handleReset = () => {
    fetchData();
    setFromDate('2024-04-01');
    setToDate('2024-06-30');
  };

  // Filter data
  const filterByCompanyKey = () => {
    if (option === 'all') {
      handleReset();
      return;
    }

    const result = {
      success: data.success,
      data: {}
    };

    for (const key in data) {
      if (key === option) {
        result.data[key] = data[key];
      }
    }

    setData(result.data);
  };

  useEffect(() => {
    filterByCompanyKey();
  }, [option]);

  return (
    <>
      <div className="container">
        <h2>Customer Billing</h2>
        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label htmlFor="company">Company:</label>
            <select id="company" name="company" value={option} onChange={handleOptionChange}>
              <option value="" disabled>Select Company</option>
              <option value="all">All Company</option>
              {Object.entries(data).map(([companyName]) => (
                <option value={companyName} key={companyName}>{companyName}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="from-date">From Date:</label>
            <input type="date" id="from-date" name="from-date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="to-date">To Date:</label>
            <input type="date" id="to-date" name="to-date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
          </div>

          <div className="btn-group">
            <button type="submit">Search</button>
            <button type="reset" onClick={handleReset}>Reset</button>
          </div>
        </form>
      </div>

      <div className="container">
        {isLoading ? (
          <p>Loading...</p> // Display "Loading" when data is being fetched
        ) : (
          <>
            <div>
              <p className="main-heading">Total Cost of <span className="blue">All Company</span> is <span className="cyan item">{totalCost}</span> and Total Submission is <span className="cyan item">999</span></p>
            </div>
            {Object.entries(data).map(([companyName, value1]) => (
              <>
                {Object.entries(value1).map(([countryCode, value2]) => (
                  <>
                    {Object.entries(value2).map(([key3, value3]) => (
                      <div className="wrapper" key={key3}>
                        <div className="company-details-wrapper">
                          <div className="text20 company"> {companyName} </div>

                          <div className="text20">Total Cost : </div>
                          <div className="cyan item text20"> {value3.totalcost.toFixed(5)}</div>
                          <div className="text20">Total Submission :</div>
                          <div className="cyan item text20">5</div>
                        </div>

                        <div>
                          <h className="country-name">({countryCode})</h>
                        </div>

                        <table>
                          <thead>
                            <tr>
                              <th>TOTAL COST</th>
                              <th>SMS COST</th>
                              <th>DELIVERED</th>
                              <th>FAILED</th>
                              <th>OTHER</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>{value3.totalcost ? value3.totalcost : '0'}</td>
                              <td>{value3.smscost ? value3.smscost : '0'}</td>
                              <td>{value3.delivered ? value3.delivered : '0'}</td>
                              <td>{value3.failed ? value3.failed : '0'}</td>
                              <td>{value3.other ? value3.other : '0'}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    ))}
                  </>
                ))}
              </>
            ))}
          </>
        )}
      </div>
    </>
  );
}

export default App;
