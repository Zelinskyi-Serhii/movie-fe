import { Outlet } from "react-router-dom";
import styles from "./App.module.scss";
import { Header } from "./components/Header";

export const Layout = () => (
  <main className={styles.main}>
    <Header />
    <div className={styles.container}>
      <Outlet />
    </div>
  </main>
);