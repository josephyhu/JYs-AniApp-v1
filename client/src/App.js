import React, {useContext} from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import Homepage from './Components/Homepage/Homepage';
import LoginPage from './Components/LoginPage/LoginPage';
import AnimePage from './Components/AnimePage/AnimePage';
import MangaPage from './Components/MangaPage/MangaPage';
import NavBar from './Components/NavBar/NavBar';
import './GlobalStyles.css';
import {myContext} from './Context';

function App() {
  const userId = useContext(myContext);
  return (
    <BrowserRouter>
      <NavBar />
      <Switch>
        <Route path='/' exact component={Homepage} />
        {
          userId ? null : (
            <Route path='/login' component={LoginPage} />
          )
        }
        <Route path='/anime' component={AnimePage} />
        <Route path='/manga' component={MangaPage} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
