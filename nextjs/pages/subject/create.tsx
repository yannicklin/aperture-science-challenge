import React, { useState } from "react";
import { NextPage, NextPageContext } from "next";
import { useCookies } from "react-cookie";
import { parseCookies, resolveApiHost } from "../../helpers";
import styles from "../../styles/App.module.css";
import axios from "axios";
import { useRouter } from "next/router";
import Layout from "../../components/layout";

CreateNewSubject.getInitialProps = ({ req, res }: NextPageContext) => {
  const cookies = parseCookies(req);
  const { protocol, hostname } = resolveApiHost(req);
  return { XSRF_TOKEN: cookies["XSRF-TOKEN"], hostname, protocol };
};

export default function CreateNewSubject(
  props: NextPage & { XSRF_TOKEN: string; hostname: string; protocol: string }
) {
  const router = useRouter();
  const [message, setErrorMessage] = useState<string>("");
  const [cookie, setCookie, removeCookie] = useCookies(["XSRF-TOKEN"]);
  const api = `${props.protocol}//${props.hostname}`;

  const createSubject = async (event: any) => {
    event.preventDefault();
    await axios
      .post(
        `${api}/graphql`,
        {
          query: `
            mutation($name:String!, $dob:DateTime!, $testChamber:Int!, $score:Int!, $alive:Boolean!) {
                createSubject(
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

  return (
    <Layout>
      <h1>Create New Subject</h1>
      <section className={styles.content}>
        <form
          id="newSubject"
          onSubmit={createSubject}
          data-testid="new-subject-form"
        >
          <div className={styles.inputGroup}>
            <label htmlFor="name">Name</label>
            <input id="name" type="string" name="name" />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="date_of_birth">DOB</label>
            <input id="date_of_birth" type="date" name="date_of_birth" />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="test_chamber">Test Chamber</label>
            <input id="test_chamber" type="number" name="test_chamber" />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="score">Score</label>
            <input id="score" type="number" name="score" />
          </div>
          <div className={styles.inputGroup}>
            <label htmlFor="alive">Alive</label>
            <input id="alive" type="checkbox" name="alive" />
          </div>
          {message && <p data-testid="error-msg">{message}</p>}
          <div className={styles.inputGroup}>
            <input type="button" onClick={() => router.back()} value="Back" />
            <input id="submit" type="submit" />
          </div>
        </form>
      </section>
    </Layout>
  );
}
