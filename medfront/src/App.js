import React, { useEffect, useState } from "react";
import {
  DataTable,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  Pagination,
  ContentSwitcher,
  Switch,
  HeaderContainer,
  Header,
  HeaderName,
  Dropdown,
  TextInput,
} from "carbon-components-react";

import "./index.scss";

const PAGE_SIZE = 10; // Number of items to display per page

const cities = [
  " ",
  "Gdańsk",
  "Poznań",
  "Warszawa",
  "Wrocław",
  "Lublin",
  "Łódź",
  "Katowice",
  "Kraków",
  "Rzeszów",
  "Białystok",
];

const App = () => {
  const [data, setData] = useState([
    {
      id: 0,
    },
  ]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSwitcherOption, setSelectedSwitcherOption] =
    useState("option1");
  const [selectedDropdownOption, setSelectedDropdownOption] =
    useState("default");
  const [lookupValue, setLookupValue] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        var url = `/rest/person/?status=${selectedSwitcherOption}&city=${selectedDropdownOption}`;

        await fetch(url)
          .then(function (response) {
            return response.json();
          })
          .then(function (datta) {
            return datta.map((elem, index) => ({ id: index, ...elem }));
          })
          .then(function (jsonData) {
            setData(jsonData);
          });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const interval = setInterval(fetchData, 1000); // Refresh data every second

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [currentPage, selectedSwitcherOption, selectedDropdownOption]);

  const handlePaginationChange = ({ page }) => {
    setCurrentPage(page);
  };

  const handleSwitcherChange = (event) => {
    setSelectedSwitcherOption(event.name);
  };

  const handleLookupChange = (event) => {
    setLookupValue(event.target.value);
  };

  const handleDropdownChange = (event) => {
    setSelectedDropdownOption(event.selectedItem.id);
  };

  return (
    <>
      <HeaderContainer
        render={({ isSideNavExpanded, onClickSideNavExpand }) => (
          <Header aria-label="App header">
            <HeaderName href="#" prefix="monitor">
              stanu pacjenta
            </HeaderName>
          </Header>
        )}
      />
      <br></br>
      <br></br>
      <br></br>

      <div className="content-container">
        <h1 className="table-title">Pacjenci</h1>
        <br></br>
        <div className="header-content">
          <div className="content-switcher-container">
            <ContentSwitcher onChange={handleSwitcherChange} selectedIndex={0}>
              <Switch name="0" text="Alert on" />
              <Switch name="1" text="Alert off" />
            </ContentSwitcher>
          </div>
          <div className="dropdown-container">
            <Dropdown
              id="dropdown-options"
              label="Dropdown Options"
              items={cities.map((city) => ({
                id: city,
                text: city,
              }))}
              itemToElement={(item) =>
                item ? (
                  <span className="test" style={{ color: "black" }}>
                    {item.text}
                  </span>
                ) : (
                  ""
                )
              }
              selectedItem={selectedDropdownOption}
              onChange={handleDropdownChange}
            />
          </div>
          <div>
            <TextInput
              id="lookup"
              placeholder="imię pacjenta"
              value={lookupValue}
              onChange={handleLookupChange}
            />
          </div>
        </div>

        <div className="table-container">
          <DataTable
            rows={data}
            headers={[
              { key: "name", header: "Name" },
              // { key: "surname", header: "Surname" },
              { key: "city", header: "City" },
              { key: "birthdate", header: "Birthdate" },
              { key: "sex", header: "Sex" },
              { key: "status", header: "Status" },
            ]}
          >
            {({ rows, headers, getHeaderProps, getTableProps }) => (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      {headers.map((header) => (
                        <TableHeader {...getHeaderProps({ header })}>
                          {header.header}
                        </TableHeader>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((row) => (
                      <TableRow key={row.id}>
                        {row.cells.map((cell) => (
                          <TableCell key={cell.id}>{cell.value}</TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </DataTable>
          <div className="pagination-container">
            <Pagination
              totalItems={data.length}
              page={currentPage}
              pageSize={PAGE_SIZE}
              pageSizes={[10, 20, 30, 40]} // Customize the available page sizes if desired
              onChange={handlePaginationChange}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
