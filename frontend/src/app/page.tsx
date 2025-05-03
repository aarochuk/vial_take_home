"use client";
import Image from "next/image";
import styles from "./page.module.css";
import axios from "axios";
import { useState, useEffect, SetStateAction } from "react";
import { ActionIcon, Modal, TextInput, Button, Tooltip  } from '@mantine/core';
import { FaPlus } from 'react-icons/fa';

export default function Home() {
  const [formData, addFormData] = useState<any[]>([]);
  const [queryData, addQueryData] = useState([]);
  
  const [addModal, setAddModal] = useState(false);
  const [formIdAdd, setFormIdAdd] = useState<string>("");
  const [formQuestionAdd, setFormQuestionAdd] = useState<string>("");
  const [queryDesc, setQueryDesc] = useState<string>("");

  const [editModalOpened, setEditModalOpened] = useState(false);
  const [selectedQuery, setSelectedQuery] = useState<any>(null);
  const [editTitle, setEditTitle] = useState<string>("");
  const [editDescription, setEditDescription] = useState<string>("");
  const [editStatus, setEditStatus] = useState<string>("");
  const [editId, setEditId] = useState<string>("");

  const newStatusModal = (id: string, question: string) => {
    setFormIdAdd(id);
    setFormQuestionAdd(question);
    setAddModal(true);
  };

  const closeAddModal = () => {
    setAddModal(false);
    setQueryDesc("");
    setFormQuestionAdd("");
    setFormIdAdd("");
  };

  const newQuery = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:8080/query", {
        title: formQuestionAdd, description: queryDesc, status: "open", formDataId: formIdAdd
      });
      await populateTable();
    } catch (error) {
      console.log("Error Occured");
    }
    closeAddModal();
  };


  const editStatusModal = (query: any) => {
    setSelectedQuery(query);
    setEditTitle(query.title);
    setEditDescription(query.description || "");
    setEditStatus(query.status);
    setEditId(query.id);
    setEditModalOpened(true);
  };

  const closeStatusModal = () => {
    setEditModalOpened(false);
    setSelectedQuery(null);
    setEditTitle("");
    setEditDescription("");
    setEditId("");
    setEditStatus("");
  };

  const editStatusFunc = async () => {
    try {
      const response = await axios.put(`http://127.0.0.1:8080/query/${editId}`, {
        status: "resolved"
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
                    <Tooltip label="View Query" position="top" withArrow>
                      <ActionIcon variant="filled" color={data.query.status === "open"? "red" : "green"} onClick={() => editStatusModal(data.query)}>
                        {data.query.status}
                      </ActionIcon>
                    </Tooltip>
                    ):(
                      <Tooltip label="Add Query" position="top" withArrow>
                        <ActionIcon variant="filled" color="blue" onClick={() => newStatusModal(data.id, data.question)}>
                          <FaPlus />
                        </ActionIcon>
                      </Tooltip>
                    )}</td>
                </tr>
              )
            })}

            <Modal
              opened={addModal}
              onClose={closeAddModal}
              title={`Create a Query | ${formQuestionAdd}`}
              centered
            >
              <TextInput
                placeholder="Add a query description"
                value={queryDesc}
                onChange={(e) => setQueryDesc(e.target.value )}
                mb="md"
              />
              <Button onClick={newQuery}>
                Create
              </Button>
            </Modal>


            <Modal
              opened={editModalOpened}
              onClose={closeStatusModal}
              title={`Edit Query | ${selectedQuery?.title}`}
              centered
            >
                <Button onClick={editStatusFunc}>
                  Resolve
                </Button>
            </Modal>
          </tbody>
        </table> 
      </div>
    </div>
  );
}
