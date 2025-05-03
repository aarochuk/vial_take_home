"use client";
import styles from "./page.module.css";
import axios from "axios";
import { useState, useEffect, SetStateAction } from "react";
import { ActionIcon, Badge, Tooltip } from '@mantine/core';
import { FaPlus } from 'react-icons/fa';
import { TiTick } from "react-icons/ti";
import { FaQuestion } from "react-icons/fa";

import AddQueryModal from '../components/AddQueryModal';
import EditQueryModal from '../components/EditQueryModal';

export default function Home() {
  const [formData, addFormData] = useState<any[]>([]);

  const [addModal, setAddModal] = useState(false);
  const [queryDesc, setQueryDesc] = useState<string>("");
  const [selectedFD, setSelectedFD] = useState<any>(null);

  const [editModalOpened, setEditModalOpened] = useState(false);
  const [selectedQuery, setSelectedQuery] = useState<any>(null);

  const newStatusModal = (formData: any) => {
    setSelectedFD(formData);
    setAddModal(true);
  };

  const closeAddModal = () => {
    setAddModal(false);
    setQueryDesc("");
    setSelectedFD(null);
  };

  const newQuery = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:8080/query", {
        title: selectedFD.question, description: queryDesc, status: "OPEN", formDataId: selectedFD.id
      });
      await populateTable();
    } catch (error) {
      console.log("Error Occured");
    }
    closeAddModal();
  };

  const editStatusModal = (query: any) => {
    setSelectedQuery(query);
    setEditModalOpened(true);
  };

  const closeStatusModal = () => {
    setEditModalOpened(false);
    setSelectedQuery(null);
  };

  const editStatusFunc = async () => {
    try {
      const response = await axios.put(`http://127.0.0.1:8080/query/${selectedQuery.id}`, {
        status: "RESOLVED"
      });
      await populateTable();
    } catch (error) {
      console.log("Error Occured");
    }
    closeStatusModal();
  };

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
                <tr className={`${data.query ? (data.query.status === "OPEN" ? styles.open : styles.resolved) : styles.tableRow}`} key={data.id}>
                  <td>{data.question}</td>
                  <td>{data.answer}</td>
                  <td className={styles.center_td}>{data.query ? (
                    <Tooltip label="View Query" position="top" withArrow>
                      {data.query.status === "OPEN" ? 
                        <ActionIcon variant="filled" color="red" onClick={() => editStatusModal(data.query)}>
                          <FaQuestion />
                        </ActionIcon> : 
                        <ActionIcon variant="filled" color="green" onClick={() => editStatusModal(data.query)}>
                          <TiTick />
                        </ActionIcon>
                        }
                    </Tooltip>
                  ) : (
                    <Tooltip label="Add Query" position="top" withArrow>
                      <ActionIcon variant="filled" color="blue" onClick={() => newStatusModal(data)}>
                        <FaPlus />
                      </ActionIcon>
                    </Tooltip>
                  )}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <AddQueryModal
          opened={addModal}
          onClose={closeAddModal}
          selectedFD={selectedFD}
          queryDesc={queryDesc}
          setQueryDesc={setQueryDesc}
          onSubmit={newQuery}
        />


        <EditQueryModal
          opened={editModalOpened}
          onClose={closeStatusModal}
          selectedQuery={selectedQuery}
          onSubmit={editStatusFunc}
        />

      </div>
    </div>
  );
}
