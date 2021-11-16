import React, {useContext} from 'react';
import styles from './NavBar.module.css';
import {Link} from 'react-router-dom';
import {myContext} from '../../Context';
import axios from 'axios';

export default function NavBar() {
  const userId = useContext(myContext);
  const logout = () => {
    axios.get('https://jys-aniapp-v1-server.herokuapp.com/auth/logout', {
      withCredentials: true
    }).then(res => {
      if (res.data === 'done') {
        window.location.href = '/'
        alert('Remember to revoke the access token.')
      }
    })
  }
  return (
    <div className={styles.navBarWrapper}>
      <ul className={styles.navBar}>
        <li><Link to='/'>Home</Link></li>
        {
          userId ? <li onClick={logout}>Logout</li> :  (
            <li><Link to='/login'>Login</Link></li>
          )
        }
        <li><Link to='/anime'>Anime</Link></li>
        <li><Link to='/manga'>Manga</Link></li>
      </ul>
    </div>
  )
}