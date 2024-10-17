'use client';

import { Budget } from '../components/Budget';
import NavBar from '../components/NavBar';
import "../styles.scss";

export function Index() {
  return (
    <>
      <NavBar></NavBar>
      <Budget></Budget>
    </>
  );
}

export default Index;
