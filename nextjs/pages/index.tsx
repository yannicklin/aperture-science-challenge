
import React, { useEffect, useState } from 'react';
import Cookies from 'cookies';
import { useRouter } from 'next/router'
import styles from '../styles/Home.module.css'
import axios from 'axios';
import { parseCookies } from "../helpers/"

Home.getInitialProps = ({ req, res }: any) => {
  const cookies = parseCookies(req);
  return { XSRF_TOKEN: cookies["XSRF-TOKEN"] };
}

export default function Home(props: any) {
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
        return await axios({
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
        })
      });
      router.push('/subjects')
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div className={styles.container}>
      <React.Fragment>
        <h1>Please login</h1>
        <form id="login" onSubmit={login}>
          <input id="email" type="email" name="email" />
          <input id="password" type="password" name="password" />
          <input type="submit"/>
        </form>
      </React.Fragment>
    </div>
  )
}
