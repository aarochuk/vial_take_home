"use client";
import Image from "next/image";
import styles from "./page.module.css";
import axios from "axios";
import { useState, useEffect, SetStateAction } from "react";
import { ActionIcon, Modal, TextInput, Button, Group  } from '@mantine/core';
import { FaPlus } from 'react-icons/fa';

export default function Home() {
  const [formData, addFormData] = useState<any[]>([]);
  const [queryData, addQueryData] = useState([]);
  
  const [modalOpened, setModalOpened] = useState(false);
  const [modalId, setModalId] = useState<string>("");
  const [modalQuestion, setModalQuestion] = useState<string>("");
  const [queryDesc, setQueryDesc] = useState<string>("");

  const handleOpenModal = (id: string, question: string) => {
    setModalId(id);
    setModalQuestion(question);
    setModalOpened(true);
  };

  const handleCloseModal = () => {
    setModalOpened(false);
    setQueryDesc("");
    setModalQuestion("");
    setModalId("");
  };

  const handleSaveQuery = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:8080/query", {
        title: modalQuestion, description: queryDesc, status: "open", formDataId: modalId
      });
      await populateTable();
    } catch (error) {
      console.log("Error Occured");
    }
    handleCloseModal();
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
                <tr className={styles.tableRow} key={data.id}>
                  <td>{data.question}</td>
                  <td>{data.answer}</td>
                  <td>{data.query ? (
                    data.query.status
                    ):(
                      <ActionIcon variant="filled" color="blue" onClick={() => handleOpenModal(data.id, data.question)}>
                        <FaPlus />
                      </ActionIcon>
                    )}</td>
                </tr>
              )
            })}

            <Modal
              opened={modalOpened}
              onClose={handleCloseModal}
              title={`Create a Query | ${modalQuestion}`}
              centered
            >
              <TextInput
                placeholder="Add a query description"
                value={queryDesc}
                onChange={(e) => setQueryDesc(e.target.value )}
                mb="md"
              />
              <Button onClick={handleSaveQuery}>
                Create
              </Button>
            </Modal>
          </tbody>
        </table> 
      </div>
    </div>
  );
}
