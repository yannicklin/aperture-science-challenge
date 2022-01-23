import React, { useEffect, useState } from "react";
import { NextPage, NextPageContext } from "next";
import { useCookies } from "react-cookie";
import styles from "../../styles/App.module.css";
import axios from "axios";
import { parseCookies, resolveApiHost } from "../../helpers/";
import { useRouter } from "next/router";
import Layout from "../../components/layout";

SingleSubject.getInitialProps = ({ req, res }: NextPageContext) => {
  const cookies = parseCookies(req);
  const { protocol, hostname } = resolveApiHost(req);
  return { XSRF_TOKEN: cookies["XSRF-TOKEN"], hostname, protocol };
};

export default function SingleSubject(
  props: NextPage & { XSRF_TOKEN: string; hostname: string; protocol: string }
) {
  const router = useRouter();
  const [authenticated, setAuth] = useState<Boolean>(!!props.XSRF_TOKEN);
  const [subject, setSubject] = useState<Object>();
  const [message, setErrorMessage] = useState<string>("");
  const [cookie, setCookie, removeCookie] = useCookies(["XSRF-TOKEN"]);
  const api = `${props.protocol}//${props.hostname}`;
  const { pid } = router.query;

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) {
      return "???";
    }
    const date = new Date(dateStr).toISOString().split("T")[0];
    return date;
  };

  useEffect(() => {
    if (authenticated) {
      axios
        .post(
          `${api}/graphql`,
          {
            query: `
              query($id:ID!) {
                subject(id: $id) {
                  id
                  name
                  test_chamber
                  date_of_birth
                  score
                  alive
                  created_at
                }
              }
            `,
            variables: {
              id: parseInt(pid as string),
            },
          },
          { withCredentials: true }
        )
        .then((response) => {
          let records = response.data?.data?.subject;

          if (records) {
            setSubject(records);
          }
        })
        .catch((e) => {
          console.log(e);
          if (e.response?.data?.message) {
            if (e.response?.data?.message === "CSRF token mismatch.") {
              return setErrorMessage(
                "Your session has expired, please log in again."
              );
            } else {
              return setErrorMessage(e.response?.data?.message);
            }
          } else {
            return setErrorMessage(
              "An error occurred, please try again later."
            );
          }
        });
    } else {
      router.push("/");
      return;
    }
  }, [authenticated]);

  const updateSubject = async (event: any) => {
    event.preventDefault();
    await axios
      .post(
        `${api}/graphql`,
        {
          query: `
            mutation($id:ID!, $name:String!, $dob:DateTime!, $testChamber:Int!, $score:Int!, $alive:Boolean!) {
                updateSubject(
                    id: $id
                    name: $name,
                    date_of_birth: $dob,
                    test_chamber: $testChamber,
                    score: $score,
                    alive: $alive,
                ) {
                    id
                    name
                    test_chamber
                    date_of_birth
                    score
                    alive
                    created_at
                }
            }
        `,
          variables: {
            id: event.target.id.value,
            name: event.target.name.value,
            dob: event.target.date_of_birth.value + " 00:00:00",
            testChamber: parseInt(event.target.test_chamber.value),
            score: parseInt(event.target.score.value),
            alive: event.target.alive.checked,
          },
        },
        { withCredentials: true }
      )
      .then((res) => console.log(res))
      .catch((e) => {
        if (e.response?.data?.message) {
          setErrorMessage(e.response?.data?.message);
        } else {
          setErrorMessage("An error occurred, please try again later.");
        }
      })
      .then((res) => router.push("/subjects"));
  };

  const deleteSubject = async (event: any) => {
    event.preventDefault();
    await axios
      .post(
        `${api}/graphql`,
        {
          query: `
            mutation($id:ID!) {
                deleteSubject(
                    id: $id
                ) {
                  id
                }
            }
        `,
          variables: {
            id: parseInt(pid as string),
          },
        },
        { withCredentials: true }
      )
      .then((res) => console.log(res))
      .catch((e) => {
        if (e.response?.data?.message) {
          setErrorMessage(e.response?.data?.message);
        } else {
          setErrorMessage("An error occurred, please try again later.");
        }
      })
      .then((res) => router.push("/subjects"));
  };

  return (
    <Layout>
      <h1>Update Subject : {pid}</h1>
      <section className={styles.content}>
        {subject && (
          <>
            <form
              id={`suject-id-${subject.id}`}
              onSubmit={updateSubject}
              data-testid="update-subject-form"
              key={subject.id}
            >
              <div className={styles.inputGroup}>
                <input
                  id="id"
                  type="hidden"
                  name="id"
                  defaultValue={subject.id}
                />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="name">Name</label>
                <input
                  id="name"
                  type="string"
                  name="name"
                  defaultValue={subject.name}
                />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="date_of_birth">DOB</label>
                <input
                  id="date_of_birth"
                  type="date"
                  name="date_of_birth"
                  defaultValue={formatDate(subject.date_of_birth)}
                />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="test_chamber">Test Chamber</label>
                <input
                  id="test_chamber"
                  type="number"
                  name="test_chamber"
                  defaultValue={parseInt(subject.test_chamber as string)}
                />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="score">Score</label>
                <input
                  id="score"
                  type="number"
                  name="score"
                  defaultValue={parseInt(subject.score as string)}
                />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="alive">Alive</label>
                <input
                  id="alive"
                  type="checkbox"
                  name="alive"
                  defaultChecked={subject.alive}
                />
              </div>
              {message && <p data-testid="error-msg">{message}</p>}
              <div className={styles.inputGroup}>
                <input
                  type="button"
                  onClick={() => router.back()}
                  value="Back"
                />
                <input id="submit" type="submit" value="Save" />
                <input type="button" onClick={deleteSubject} value="Delete" />
              </div>
            </form>
          </>
        )}
        {!subject && !message && (
          <div className={styles.skeleton} data-testid="skeleton">
            Data Fetching ....
          </div>
        )}
      </section>
    </Layout>
  );
}
