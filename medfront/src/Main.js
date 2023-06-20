import {
  Button,
} from "carbon-components-react";
import { Link } from "react-router-dom";

import "./index.scss";

const App = () => {
  return (
    <div style={{overflow: 'hidden', height: '100vh', width: '100vw'}}>
      <video src="background.mp4" autoPlay muted loop style={{opacity: '0.4'}}>
      </video>
      <div style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'}}>
        <h1 style={{fontSize: '75px', fontWeight: 'bolder', textAlign: 'center'}}>
          Przetwarzanie parametrów medycznych
        </h1>
        <Link to="/person">
          <Button style={{display: 'flex', marginLeft: 'auto', marginRight: 'auto', marginTop: '25px', fontSize: '20px'}}>
            Przejdź dalej
          </Button>
        </Link>
      </div>
    </div>
  )
};

export default App;
