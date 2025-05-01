"use client";
import Image from "next/image";
import styles from "./page.module.css";
import axios from "axios";
import { useState, useEffect } from "react";

export default function Home() {
  const [formData, addFormData] = useState<any[]>([]);
  const [queryData, addQueryData] = useState([]);

  const populateTable = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8080/form-data");
      addFormData([...response.data.data.formData]);
    } catch (error) {
      console.log("Error Occured");
    }
  };

  useEffect(() => {
    populateTable();
  }, []);

  return (
    <div className={styles.body}>
      <header className={styles.header}>
        <h1>Query Management Application</h1>
      </header>
      
      <div className={styles.main}>
        <table>
          <colgroup>
            <col className={styles.column1}/>
            <col className={styles.column2}/>
            <col className={styles.column3}/>
          </colgroup>
          <tbody>
            <tr className={styles.tableHead}>
              <th className={styles.leftHead}>Question</th>
              <th>Answer</th>
              <th className={styles.rightHead}>Query</th>
            </tr>
            {formData.map((data, index)=>{
              return(
                <tr key={data.id}>
                  <td>{data.question}</td>
                  <td>{data.answer}</td>
                  <td></td>
                </tr>
              )
            })}
          </tbody>
        </table> 
      </div>
    </div>
  );
}
