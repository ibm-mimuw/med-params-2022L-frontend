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
  Loading,
} from "carbon-components-react";
import { useNavigate } from "react-router-dom";

import "./index.scss";

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
  const [displayData, setDisplayData] = useState([
    {
      id: 0,
    },
  ]);
  const [loading, setLoading] = useState(true);
  const [PAGE_SIZE, setPAGE_SIZE] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSwitcherOption, setSelectedSwitcherOption] = useState("0");
  const [selectedDropdownOption, setSelectedDropdownOption] = useState(" ");
  const [lookupValue, setLookupValue] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    setCurrentPage(1)
  },[selectedSwitcherOption, selectedDropdownOption, lookupValue]);

  useEffect(() => {
    setDisplayData(
      data.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE - 1)
    );
  },[PAGE_SIZE, currentPage, data]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        var url = `/rest/person/?status=${selectedSwitcherOption}&name=${lookupValue}&city=${selectedDropdownOption}`;

        await fetch(url)
          .then(function (response) {
            return response.json();
          })
          .then(function (data) {
            return data.sort(function (a, b) {
              return a.status > b.status ? 1 : -1;
            });
          })
          .then(function (jsonData) {
            setData(jsonData);
            setLoading(false);
          });
      } catch (error) {
        setLoading(false);
        console.error("Error fetching data:", error);
      }
    };

    const interval = setInterval(fetchData, 2000);

    return () => clearInterval(interval);
  }, [
    selectedSwitcherOption,
    selectedDropdownOption,
    lookupValue,
  ]);

  const handlePaginationChange = ({ page, pageSize}) => {
    setCurrentPage(page);
    setPAGE_SIZE(pageSize)
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
            <HeaderName href="#" prefix="Monitor">
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
          <div className="lookup-container">
            <TextInput
              id="lookup"
              placeholder="imię pacjenta"
              value={lookupValue}
              onChange={handleLookupChange}
            />
          </div>
        </div>

        <div className="table-container">
          <div className="pagination-container">
            <Pagination
              totalItems={data.length}
              page={currentPage}
              pageSize={PAGE_SIZE}
              pageSizes={[10, 20, 30, 40]} // Customize the available page sizes if desired
              onChange={handlePaginationChange}
            />
          </div>
          <DataTable
            rows={displayData}
            headers={[
              { key: "name", header: "Imię i nazwisko" },
              // { key: "surname", header: "Surname" },
              { key: "city", header: "Miasto" },
              { key: "birthdate", header: "Data urodzenia" },
              { key: "sex", header: "Płeć" },
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
                      <TableRow key={row.id} onClick={() => navigate(`${row.id}`)}>
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
        </div>
        <Loading active={loading} withOverlay={false} small={false} style={{marginLeft: 'auto', marginRight: 'auto'}} />
      </div>
    </>
  );
};

export default App;
