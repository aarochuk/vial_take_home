// components/EditQueryModal.tsx
"use client";
import { Modal, Button } from '@mantine/core';
import styles from "./modals.module.css";
import { TiTick } from 'react-icons/ti';
import { FaCircle } from "react-icons/fa";

interface EditQueryModalProps {
  opened: boolean;
  onClose: () => void;
  selectedQuery: any;
  onSubmit: () => void;
}

export default function EditQueryModal({
  opened,
  onClose,
  selectedQuery,
  onSubmit
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
      <div className={styles.modal_content}>
        <div className={styles.info_holder}>
          <div className={styles.info}>
            <p className={styles.info_title}>Query Status</p>
            <p className={styles.info_val}>
              <FaCircle color={selectedQuery?.status === "OPEN" ? "red" : "green"}/>
              <span>{selectedQuery?.status}</span>
            </p>
          </div>
          <div className={styles.info}>
            <p className={styles.info_title}>Created On</p>
            <p className={styles.info_val}>{selectedQuery?.createdAt?.split('T')[0]}</p>
          </div>
          <div className={styles.info}>
            <p className={styles.info_title}>Last Updated</p>
            <p className={styles.info_val}>{selectedQuery?.updatedAt?.split('T')[0]}</p>
          </div>
        </div>
        <div className={styles.resolve_holder}>
          {selectedQuery?.status === "OPEN" ?
            <Button onClick={onSubmit}>
              <TiTick />
              <span className={styles.buttonSpan}>
                Resolve
              </span>
            </Button> : <></>
          }
        </div>
      </div>

    </Modal>
  );
}