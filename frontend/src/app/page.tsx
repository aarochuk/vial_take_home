"use client";
import styles from "./page.module.css";
import axios from "axios";
import { useState, useEffect } from "react";
import { ActionIcon, Tooltip } from '@mantine/core';
import { FaPlus } from 'react-icons/fa';
import { TiTick } from "react-icons/ti";
import { FaQuestion } from "react-icons/fa";

import AddQueryModal from '../components/AddQueryModal';
import EditQueryModal from '../components/EditQueryModal';

interface Query {
  id: string;
  title: string;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
  status: string;
  formDataId: string;
}

interface FormData {
  id: string;
  question: string;
  answer: string;
  query?: Query | null; 
}


export default function Home() {
  const [formData, addFormData] = useState<FormData[]>([]);

  const [addModal, setAddModal] = useState(false);
  const [queryDesc, setQueryDesc] = useState<string>("");
  const [selectedFD, setSelectedFD] = useState<FormData | null>(null);

  const [editModalOpened, setEditModalOpened] = useState(false);
  const [selectedQuery, setSelectedQuery] = useState<Query | null>(null);

  const newQueryModal = (formData: FormData) => {
    setSelectedFD(formData);
    setAddModal(true);
  };

  const closeAddModal = () => {
    setAddModal(false);
    setQueryDesc("");
    setSelectedFD(null);
  };

  // make request to API to create a new query
  const newQuery = async () => {
    try {
      await axios.post("http://127.0.0.1:8080/query", {
        title: selectedFD?.question, description: queryDesc, formDataId: selectedFD?.id
      });
      await populateTable();
    } catch (error) {
      console.log(`Error Occured: ${error}`);
    }
    closeAddModal();
  };

  const editQueryModal = (query: Query | null | undefined) => {
    if (query){
      setSelectedQuery(query);
    }
    setEditModalOpened(true);
  };

  const closeStatusModal = () => {
    setEditModalOpened(false);
    setSelectedQuery(null);
  };

  // make request to API to delete a query
  const deleteQuery = async () => {
    try {
      await axios.delete(`http://127.0.0.1:8080/query/${selectedQuery?.id}`);
      await populateTable();
    } catch (error) {
      console.log(`Error Occured ${error}`);
    }
    closeStatusModal();
  };

  // make request to API to change the status of a query always from OPEN to RESOLVED
  const editStatusFunc = async () => {
    try {
      await axios.put(`http://127.0.0.1:8080/query/${selectedQuery?.id}`, {
        status: "RESOLVED"
      });
      await populateTable();
    } catch (error) {
      console.log(`Error Occured: ${error}`);
    }
    closeStatusModal();
  };

  // make request to API to get all the form data, and also any associated query data,
  // which is used to populate the table created below
  const populateTable = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8080/form-data");
      addFormData([...response.data.data.formData]);
    } catch (error) {
      console.log(`Error Occured: ${error}`);
    }
  };

  // populate the table on any change, so that table data is the most current
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
            <col className={styles.column1} />
            <col className={styles.column2} />
            <col className={styles.column3} />
          </colgroup>
          <tbody>
            <tr className={styles.tableHead}>
              <th className={styles.leftHead}>Question</th>
              <th>Answer</th>
              <th className={styles.rightHead}>Query</th>
            </tr>
            {formData.map((data, index) => {
              return (
                <tr className={`${data.query ? (data.query.status === "OPEN" ? styles.open : styles.resolved) : styles.tableRow}`} key={index}>
                  {/** On hover background color depends on the status */}
                  <td>{data.question}</td>
                  <td>{data.answer}</td>
                  <td className={styles.center_td}>{data.query ? (
                    <Tooltip label="View Query" position="top" withArrow>
                      {data.query.status === "OPEN" ? 
                        <ActionIcon variant="filled" color="red" onClick={() => editQueryModal(data.query)}>
                          <FaQuestion />
                        </ActionIcon> : 
                        <ActionIcon variant="filled" color="green" onClick={() => editQueryModal(data.query)}>
                          <TiTick />
                        </ActionIcon>
                        }
                    </Tooltip>
                  ) : (
                    <Tooltip label="Add Query" position="top" withArrow>
                      <ActionIcon variant="filled" color="blue" onClick={() => newQueryModal(data)}>
                        <FaPlus />
                      </ActionIcon>
                    </Tooltip>
                  )}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {/**Add query modal opened when creating a new query */}
        <AddQueryModal
          opened={addModal}
          onClose={closeAddModal}
          selectedFD={selectedFD}
          queryDesc={queryDesc}
          setQueryDesc={setQueryDesc}
          onSubmit={newQuery}
        />

        {/**Edit query modal opened when editing a query */}
        <EditQueryModal
          opened={editModalOpened}
          onClose={closeStatusModal}
          selectedQuery={selectedQuery}
          onSubmit={editStatusFunc}
          deleteQuery={deleteQuery}
        />

      </div>
    </div>
  );
}
