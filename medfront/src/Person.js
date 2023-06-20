import React, { useEffect, useState } from "react";
import {
  HeaderContainer,
  Header,
  HeaderName,
  Button,
  Modal,
  Loading,
} from "carbon-components-react";
import { useParams } from "react-router-dom";
import { LineChart } from "@carbon/charts-react";

import "./index.scss";
import "@carbon/charts/styles.css";

const Person = () => {
  const { id } = useParams();
  
  const initData = () => ({
    alcohol: [],
    co2: [],
    cortizol: [],
    diastolic_bp: [],
    oxygen: [],
    pulse: [],
    respirations_rpm: [],
    sugar: [],
    systolic_bp: [],
    temperature: [],
    wbc: [],
  });
  const labels = {
    alcohol: "Alkohol",
    co2: "CO2",
    cortizol: "Kortyzol",
    diastolic_bp: "Rozkurczowe",
    oxygen: "Saturacja",
    pulse: "Puls",
    respirations_rpm: "Oddechy na minutę",
    sugar: "Cukier",
    systolic_bp: "Skurczowe",
    temperature: "Temperatura ciała",
    wbc: "Krwinki białe",
  }
  const units = {
    alcohol: "Promile (‰)",
    co2: "",
    cortizol: "Nanomole na litr (nmol/L)",
    oxygen: "Procent (%)",
    pulse: "Uderzenia na minutę (bpm)",
    respirations_rpm: "Oddechy na minutę (bpm)",
    sugar: "Miligramy na decylitr (mg/dl)",
    temperature: "Stopnie Celsjusza (°C)",
    wbc: "Komórki na mikrolitr (cpm)",
  };
  const [data, setData] = useState(initData());
  const [personData, setPersonData] = useState({
    birthdate: '',
    city: '',
    name: '',
    sex: '',
    status: '',
  });
  const [modalOpen, setModalOpen] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        var url = `/rest/person/${id}`;

        await fetch(url)
          .then(function (response) {
            return response.json();
          })
          .then(function (jsonData) {
            setPersonData(jsonData);
          });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        var url = `/rest/person/${id}/medical`;

        await fetch(url)
          .then(function (response) {
            return response.json();
          })
          .then(function (data) {
            const jsonData = initData();
            data.forEach(dp => {
              Object.entries(dp).forEach(
                ([key, value]) => {
                  if (key !== 'timestamp') {
                    jsonData[key].push({ group: labels[key], timestamp: dp.timestamp, value });
                  }
                }
              );
            });

            setData(jsonData);
          });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const interval = setInterval(fetchData, 5000);

    return () => clearInterval(interval);
  }, [id]);

  const options = (title, unit) => ({
    animations: true,
    title,
    axes: {
      bottom: {
        title: "Znacznik czasu",
        mapsTo: "timestamp",
        scaleType: "time"
      },
      left: {
        mapsTo: "value",
        title: unit,
        scaleType: "linear"
      }
    },
    height: "400px",
  });

  return (
    <>
      <HeaderContainer
        render={({ isSideNavExpanded, onClickSideNavExpand }) => (
          <Header aria-label="App header">
            <HeaderName href="/" prefix="Monitor">
              stanu pacjenta
            </HeaderName>
            <Button onClick={() => setModalOpen(true)}>Locust</Button>
          </Header>
        )}
      />
      <Modal
        open={modalOpen}
        modalHeading="Ruch z IoT"
        onRequestClose={() => setModalOpen(false)}
        passiveModal
        style={{ width: '100%', height: '100%' }}
      >
        <iframe style={{ width: '100%', height: '100%' }} title="Locust" src="http://localhost:8089"></iframe>
      </Modal>
      <br></br>
      <br></br>
      <br></br>

      <div className="content-container">
        <h1 className="table-title">Pacjent {personData.name}</h1>
        <div className="header-content">
        </div>
        <LineChart
          data={data['systolic_bp'].concat(data['diastolic_bp'])}
          options={options("Ciśnienie krwi", "Milimetry słupa rtęci (mmHg)")}
        />
        <br />
        {Object.keys(labels).filter(key => !key.includes("_bp")).map(key =>
          <div key={key}>
            <LineChart
              data={data[key]}
              options={options(labels[key], units[key])}
            />
            <br />
          </div>
        )}
      </div>
    </>
  );
};

export default Person;
