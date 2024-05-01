import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Weather from './Weather';
import HourlyForecast from './HourlyForecast';

function App() {
    return (
        <Router>
            <Switch>
                <Route path="/" exact component={Weather} />
                <Route path="/hourly-forecast" component={HourlyForecast} />
            </Switch>
        </Router>
    );
}

export default App;
s