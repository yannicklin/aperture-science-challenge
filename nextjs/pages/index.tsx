
import React, { useState } from 'react';
import { NextPage, NextPageContext } from 'next'
import { useRouter } from 'next/router'
import styles from '../styles/App.module.css'
import axios from 'axios';
import { parseCookies } from "../helpers/"
import Layout from "../components/layout"

Home.getInitialProps = ({ req, res }: NextPageContext) => {
  const cookies = parseCookies(req);
  return { XSRF_TOKEN: cookies["XSRF-TOKEN"] };
}

export default function Home(props: NextPage & {XSRF_TOKEN: string}) {
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
      setFormMessage('An error occurred, please try again later.')
      console.log(err);
    }
  }

  return (
    <Layout>
      <h1>Please login</h1>
      <section className={styles.content}>
        <form id="login" onSubmit={login} data-testid="login-form">
          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <input id="email" type="email" name="email" />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <input id="password" type="password" name="password" />
          </div>
          {message && (
            <p data-testid="error-msg">{message}</p>
          )}
          <div className={styles.inputGroup}>
            <input id="submit" type="submit"/>
          </div>
        </form>
      </section>
    </Layout>
  )
}
