// components/EditQueryModal.tsx
// Created to make styling modal easier

"use client";
import { Modal, Button, Tooltip, ActionIcon } from '@mantine/core';
import styles from "./modals.module.css";
import { TiTick } from 'react-icons/ti';
import { FaCircle } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";

interface Query {
  id: string;
  title: string;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
  status: string;
  formDataId: string;
}

interface EditQueryModalProps {
  opened: boolean;
  onClose: () => void;
  selectedQuery: Query | null;
  onSubmit: () => void;
  deleteQuery: ()=> void;
}

export default function EditQueryModal({
  opened,
  onClose,
  selectedQuery,
  onSubmit,
  deleteQuery
}: EditQueryModalProps) {

  

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={`Edit Query | ${selectedQuery?.title}`}
      centered
      size={"40em"}
      classNames={{
        title: styles.title,
        body: `${styles.body} ${selectedQuery?.status === "OPEN" ? styles.open : styles.resolved}`,
        header: styles.header,
        content: styles.content,
        close: styles.close
      }}
    >
      {/**Background color dependent on the status of the query */}
      <div className={styles.modal_content}>
        <div className={styles.info_holder}>
          <div className={styles.info}>
            <p className={styles.info_title}>Query Status</p>
            <p className={styles.info_val}>
              {/**Display the circle shown in sample image beside query status */}
              <FaCircle color={selectedQuery?.status === "OPEN" ? "red" : "green"} />
              <span>{selectedQuery?.status}</span>
            </p>
          </div>
          <div className={styles.info}>
            <p className={styles.info_title}>Created On</p>
            {/**Do not display the time with the date, the time is also stored 
             * in the database but only the date is shown so that it matches what
             * appears in the sample image
             */}
            <p className={styles.info_val}>{selectedQuery?.createdAt?.split('T')[0]}</p>
          </div>
          <div className={styles.info}>
            <p className={styles.info_title}>Last Updated</p>
            <p className={styles.info_val}>{selectedQuery?.updatedAt?.split('T')[0]}</p>
          </div>
        </div>
        <div className={styles.resolve_holder}>
          {/**Resolve button only displayed if the status is OPEN, because you cannot resolve 
           * A query if it is already resolved
           */}
          {selectedQuery?.status === "OPEN" ?
            <Button onClick={onSubmit}>
              <TiTick />
              <span className={styles.buttonSpan}>
                Resolve
              </span>
            </Button> : <></>
          }
          <Tooltip label="Delete Query" position="top" withArrow>
            <ActionIcon variant="filled" color="blue" onClick={deleteQuery}>
              <FaTrash />
            </ActionIcon>
          </Tooltip>
        </div>
      </div>
      <div>
        {selectedQuery?.description ?
          <div>
            <p className={styles.info_title}>Description</p>
            <p className={styles.desc}>
              {selectedQuery?.description}
            </p>
          </div> : <></>
        }
      </div>

    </Modal>
  );
}