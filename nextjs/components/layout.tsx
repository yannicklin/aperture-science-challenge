import Head from 'next/head';
import { ReactNode } from 'react';
import styles from '../styles/App.module.css'

interface LayoutType {
    children: ReactNode,
    title?: string,
    description?: string
}

const Layout = ({children, title="Aperture Science Enrichment Center | Subject Management", description="intelliHR technical challenge"}: LayoutType) => {
    return (
      <>
        <Head>
            <meta name="description" content={description} />
            <title>{title}</title>
            <link
                href="https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@700&display=swap"
                rel="stylesheet"
                />
        </Head>
        <main>
            <div className={styles.container}>
                <div className={styles.main}>
                    {children}
                </div>
            </div>
        </main>
      </>
    );
}

export default Layout;