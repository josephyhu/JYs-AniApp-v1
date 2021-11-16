import React from 'react'
import styles from './LoginPage.module.css';

export default function LoginPage() {

  const login = () => {
    window.open("https://jys-aniapp-v1-server.herokuapp.com/auth/anilist", "_self");
  }

  return (
    <div className={styles.loginPage}>
      <h1>Login</h1>
      <div className={styles.loginContainer} onClick={login}>
        <p>Login with AniList</p>
      </div>
    </div>
  )
}