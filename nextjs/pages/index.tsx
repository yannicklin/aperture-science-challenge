
import React, { useState } from 'react';
import { useRouter } from 'next/router'
import styles from '../styles/Home.module.css'
import axios from 'axios';
import { parseCookies } from "../helpers/"

Home.getInitialProps = ({ req, res }: any) => {
  const cookies = parseCookies(req);
  return { XSRF_TOKEN: cookies["XSRF-TOKEN"] };
}

export default function Home(props: any) {
  const [ message, setFormMessage ] = useState('');
  const router = useRouter();

  const login = async (event: any) => {
    event.preventDefault()
    try {
      await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_API}/sanctum/csrf-cookie`,
        {
          withCredentials: true
        }
      ).then(async () => {
        await axios({
          method: "post",
          url: `${process.env.NEXT_PUBLIC_BASE_API}/login`,
          data: {
            "email": event.target.email.value,
            "password": event.target.password.value
          },
          withCredentials: true,
          headers: {
            "X-Requested-With": "XMLHttpRequest",
            "Accept": "application/json"
          }
        }).then(res => router.push('/subjects'))
        .catch(e => {
          if (e.response?.data?.message) {
            setFormMessage(e.response?.data?.message);
          } else {
            setFormMessage('An error occurred, please try again later.')
          }
        })
      });
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <h1>Please login</h1>
        <section className={styles.content}>
          <form id="login" onSubmit={login}>
            <div className={styles.inputGroup}>
              <label htmlFor="email">Email</label>
              <input id="email" type="email" name="email" />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="password">Password</label>
              <input id="password" type="password" name="password" />
            </div>
            {message && (
              <p>{message}</p>
            )}
            <div className={styles.inputGroup}>
              <input type="submit"/>
            </div>
          </form>
        </section>
      </div>
    </div>
  )
}
