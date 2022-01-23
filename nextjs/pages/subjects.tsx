import React, { useEffect, useState } from "react";
import { NextPage, NextPageContext } from "next";
import { useCookies } from "react-cookie";
import styles from "../styles/App.module.css";
import axios from "axios";
import { parseCookies, resolveApiHost } from "../helpers/";
import { useRouter } from "next/router";
import Link from "next/link";
import Layout from "../components/layout";

interface Subject {
  id: number;
  name: string;
  test_chamber?: number;
  date_of_birth?: string;
  score?: number;
  alive?: boolean;
  created_at?: string;
  updated_at?: string;
}

Subjects.getInitialProps = ({ req, res }: NextPageContext) => {
  const cookies = parseCookies(req);
  const { protocol, hostname } = resolveApiHost(req);
  return { XSRF_TOKEN: cookies["XSRF-TOKEN"], hostname, protocol };
};

const useSortableData = (items: Subject[], config = null) => {
  const [sortConfig, setSortConfig] = React.useState(config);

  const sortedItems = React.useMemo(() => {
    let sortableItems = items;
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [items, sortConfig]);

  const requestSort = (key) => {
    let direction = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  return { items: sortedItems, requestSort, sortConfig };
};

const Pagination = (props) => {
  const router = useRouter();
  const currentPage = props.data.currentPage;
  const lastPage = props.data.lastPage;

  const gotoNextPage = (direction) => {
    if ("previous" === direction && 1 < currentPage) {
      router.push({
        pathname: props.path,
        query: { nextpage: currentPage - 1 },
      });
    } else if ("next" == direction && lastPage > currentPage) {
      router.push({
        pathname: props.path,
        query: { nextpage: currentPage + 1 },
      });
    }
  };

  return (
    <div className="pagination">
      <button
        className={`page ${props.data.currentPage === 1 && "disabled"}`}
        onClick={() => gotoNextPage("previous")}
      >
        &larr;
      </button>
      <p>{props.data.currentPage}</p>
      <button
        className={`page ${
          props.data.currentPage === props.data.lastPage && "disabled"
        }`}
        onClick={() => gotoNextPage("previous")}
      >
        &rarr;
      </button>
    </div>
  );
};

export default function Subjects(
  props: NextPage & { XSRF_TOKEN: string; hostname: string; protocol: string }
) {
  const router = useRouter();
  const [authenticated, setAuth] = useState<Boolean>(!!props.XSRF_TOKEN);
  const [subjects, setSubjects] = useState<Array<Subject>>();
  const { items, requestSort, sortConfig } = useSortableData(subjects);
  const [pagination, setPagination] = useState<Object>();
  const [message, setErrorMessage] = useState<string>("");
  const [cookie, setCookie, removeCookie] = useCookies(["XSRF-TOKEN"]);
  const api = `${props.protocol}//${props.hostname}`;
  const recordsPerPage = 5;
  const { nextpage } = router.query;

  const logout = async () => {
    try {
      await axios({
        method: "post",
        url: `${api}/logout`,
        withCredentials: true,
      }).then((response) => {
        removeCookie("XSRF-TOKEN");
        setAuth(!(response.status === 204));
        return router.push("/");
      });
    } catch (e) {
      console.log(e);
    }
  };

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) {
      return "???";
    }
    const date = new Date(dateStr);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  useEffect(() => {
    if (authenticated) {
      axios
        .post(
          `${api}/graphql`,
          {
            query: `
              query {
                subjects(first: ${recordsPerPage}, page: ${nextpage ?? 1}) {
                  data {
                    id
                    name
                    test_chamber
                    date_of_birth
                    score
                    alive
                    created_at
                  }
                  paginatorInfo { 
                    currentPage
                    lastPage
                  }
                }
              }
            `,
          },
          { withCredentials: true }
        )
        .then((response) => {
          // const { subjects = [] } = response.data?.data?.subjectssssss?.data;
          let subjects = response.data?.data?.subjects?.data;
          let pagination = response.data?.data?.subjects?.paginatorInfo;

          if (subjects && subjects.length > 0) {
            setSubjects(subjects as Subject[]);
            setPagination(pagination);
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
  }, [authenticated, nextpage]);

  const getClassNamesFor = (name: string) => {
    if (!sortConfig) {
      return;
    }
    return sortConfig.key === name ? sortConfig.direction : undefined;
  };

  return (
    <Layout>
      <h1>Testing Subjects</h1>
      <section className={styles.content}>
        {message && <p data-testid="error-msg">{message}</p>}
        {pagination && subjects && subjects.length > 0 && (
          <>
            <table data-testid="subjects-table">
              <thead>
                <tr>
                  <td>ID</td>
                  <td>Name</td>
                  <td
                    onClick={() => requestSort("date_of_birth")}
                    className={getClassNamesFor("date_of_birth")}
                  >
                    DOB
                  </td>
                  <td>Alive</td>
                  <td>Score</td>
                  <td
                    onClick={() => requestSort("test_chamber")}
                    className={getClassNamesFor("test_chamber")}
                  >
                    Test Chamber
                  </td>
                </tr>
              </thead>
              <tbody>
                {subjects.map((subject) => (
                  <tr key={subject.id}>
                    <td>{subject.id}</td>
                    <td>{subject.name}</td>
                    <td>{formatDate(subject.date_of_birth)}</td>
                    <td>{subject.alive ? "Y" : "N"}</td>
                    <td>{subject.score}</td>
                    <td>{subject.test_chamber}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Pagination data={pagination} path={router.pathname} />
          </>
        )}
        {!subjects && !message && (
          <div className={styles.skeleton} data-testid="skeleton">
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
                {Array.from(Array(10).keys()).map((subject) => (
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
    </Layout>
  );
}
