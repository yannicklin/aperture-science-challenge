
import React, { useEffect, useState } from 'react';
import Cookies from 'cookies';
import { useCookies } from "react-cookie"
import styles from '../styles/Home.module.css'
import axios from 'axios';

interface Subject {
  id: number,
  name: string,
  test_chamber?: number,
  date_of_birth?: string,
  score?: number,
  alive?: boolean,
  created_at?: string,
  updated_at?: string
}

Home.getInitialProps = ({ req, res }: any) => {
  const cookies = new Cookies(req, res)
  const XSRF_TOKEN = cookies.get('XSRF-TOKEN') || null;
  return { XSRF_TOKEN };
}

export default function Home(props: any) {
  const [ authenticated, setAuth ] = useState<Boolean>(!!props.XSRF_TOKEN);
  const [ subjects, setSubjects ] = useState<Array<Subject>>();
  const [cookie, setCookie, removeCookie] = useCookies(["XSRF-TOKEN"])

  const login = async (event: any) => {
    event.preventDefault()

    try {
      const auth = await axios.get(
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
      setAuth(!!(auth.status === 200))
    } catch (e) {
      console.log(e);
    }
  }

  const logout = async () => {
    // clear cookies here
    try {
      await axios({
        method: "post",
        url: `${process.env.NEXT_PUBLIC_BASE_API}/logout`,
        withCredentials: true
      }).then((response) => {
        removeCookie("XSRF-TOKEN");
        setAuth(!(response.status === 204))
      })
    } catch (e) {
      console.log(e);
    }
    return;
  }

  useEffect(() => {
    if (authenticated) {
      axios({
        url: `${process.env.NEXT_PUBLIC_BASE_API}/graphql`,
        method: 'post',
        withCredentials: true,
        data: {
          query: `
              query {
                subjects {
                  data {
                    id
                    name
                    test_chamber
                    date_of_birth
                    score
                    alive
                    created_at
                  }
                }
              }
            `
        }
      }).then(response => {
        if (response?.data?.data?.subjects?.data && response.data.data.subjects.data.length > 0) {
          setSubjects(response.data.data.subjects.data as Subject[]);
        }
      })
    } else {
      setSubjects([])
    }
  }, [authenticated]);

  return (
    <div className={styles.container}>
      {!authenticated && (
        <React.Fragment>
          <h1>Please login</h1>
          <form id="login" onSubmit={login}>
            <input id="email" type="email" name="email" />
            <input id="password" type="password" name="password" />
            <input type="submit"/>
          </form>
        </React.Fragment>
      )}
      {authenticated && <h1>Welcome!</h1>}
      {subjects && subjects.length > 0 && subjects.map(subject => (
        <p key={subject.id}>{subject.name}</p>
      ))}
      {authenticated && <button onClick={logout}>Log out</button>}
    </div>
  )
}
