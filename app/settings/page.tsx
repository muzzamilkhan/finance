"use client";

import { AddForm } from "../components/Settings/AddForm";
import NavBar from "../components/NavBar";
import { Particulars } from "../components/Settings/Particulars";
import { Overrides } from "../components/Settings/Overrides";
import { useState } from "react";
import Planner from "../components/Settings/Planner";
import { prune } from "../api/overrides";
import "../styles.scss";

export function Index() {
  const onReset = () => {
    if (!confirm("Are you sure?")) return;

    // reset();
  };

  const onPrune = async () => {
    if (!confirm("Are you sure?")) return;

    await prune();
  };

  const [selected, setSelected] = useState<string>("particulars");
  return (
    <>
      <NavBar></NavBar>
      <Planner></Planner>
      <div className="settings-options">
        <button onClick={() => setSelected("particulars")}>Particulars</button>
        <button onClick={() => setSelected("overrides")}>Overrides</button>
      </div>
      <div className="forms">
        {selected === "particulars" && (
          <>
            <Particulars></Particulars>
            <button onClick={() => onReset()}>Reset Defaults</button>
            <AddForm type="expense"></AddForm>
            <AddForm type="income"></AddForm>
          </>
        )}
        {selected === "overrides" && (
          <>
            <button onClick={() => onPrune()}>Remove Old</button>
            <Overrides></Overrides>
          </>
        )}
      </div>
    </>
  );
}

export default Index;
