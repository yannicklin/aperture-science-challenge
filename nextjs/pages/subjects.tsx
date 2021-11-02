
import React, { useEffect, useState } from 'react';
import { useCookies } from "react-cookie"
import styles from '../styles/Home.module.css'
import axios from 'axios';
import { parseCookies } from "../helpers/"
import { useRouter } from 'next/router'

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

Subjects.getInitialProps = ({ req, res }: any) => {
  const cookies = parseCookies(req);
  return { XSRF_TOKEN: cookies["XSRF-TOKEN"] };
}

export default function Subjects(props: any) {
  const router = useRouter();
  const [ authenticated, setAuth ] = useState<Boolean>(!!props.XSRF_TOKEN);
  const [ subjects, setSubjects ] = useState<Array<Subject>>();
  const [cookie, setCookie, removeCookie] = useCookies(["XSRF-TOKEN"])

  const logout = async () => {
    try {
      await axios({
        method: "post",
        url: `${process.env.NEXT_PUBLIC_BASE_API}/logout`,
        withCredentials: true
      }).then((response) => {
        removeCookie("XSRF-TOKEN");
        setAuth(!(response.status === 204))
        return router.push('/');
      })
    } catch (e) {
      console.log(e);
    }
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
                  id
                  name
                  test_chamber
                  date_of_birth
                  score
                  alive
                  created_at
                }
              }
            `
        }
      }).then(response => {
        const { subjects } = response.data?.data
        if (subjects && subjects.length > 0) {
          setSubjects(subjects as Subject[]);
        }
      })
    } else {
      router.push('/');
    }
  }, [authenticated]);

  return (
    <div className={styles.container}>
      <div className={styles.main}>
        {authenticated && <h1>Testing Subjects</h1>}
        <section className={styles.content}>
          {subjects && subjects.length > 0 && (
            <table>
              <thead>
                <tr>
                  <td>ID</td>
                  <td>Name</td>
                  <td>DOB</td>
                  <td>Alive</td>
                  <td>Score</td>
                  <td>Test Chamber</td>
                </tr>
              </thead>
              <tbody>
                {subjects.map(subject => (
                  <tr key={subject.id}>
                    <td>{subject.id}</td>
                    <td>{subject.name}</td>
                    <td>{subject.date_of_birth}</td>
                    <td>{subject.alive ? 'Y' : 'N'}</td>
                    <td>{subject.score}</td>
                    <td>{subject.test_chamber}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {!subjects && (
            <div className={styles.skeleton}>
              <table>
              <thead>
                <tr>
                  <td>ID</td>
                  <td>Name</td>
                  <td>DOB</td>
                  <td>Alive</td>
                  <td>Score</td>
                  <td>Test Chamber</td>
                </tr>
              </thead>
              <tbody>
                {[1,2,3,4,5,6,7,8,9,10].map(subject => (
                  <tr key={subject}>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          )}
          {authenticated && <button onClick={logout}>Log out</button>}
        </section>
      </div>
    </div>
  )
}
