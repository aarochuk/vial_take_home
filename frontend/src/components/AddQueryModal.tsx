// components/AddQueryModal.tsx
"use client";
import { Modal, Textarea, Button } from '@mantine/core';
import styles from "./modals.module.css";

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

interface AddQueryModalProps {
  opened: boolean;
  onClose: () => void;
  selectedFD: FormData | null;
  queryDesc: string;
  setQueryDesc: (value: string) => void;
  onSubmit: () => void;
}

export default function AddQueryModal({
  opened,
  onClose,
  selectedFD,
  queryDesc,
  setQueryDesc,
  onSubmit
}: AddQueryModalProps) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={`Create a Query | ${selectedFD?.question}`}
      centered
      size={"40em"}
      classNames={{
        title: styles.title,
        body: styles.body,
        header: styles.header,
        content: styles.content,
        close: styles.close
      }}
    >
      <Textarea
        placeholder="Add a query description"
        value={queryDesc}
        className={styles.descInput}
        onChange={(e) => setQueryDesc(e.target.value)}
        mb="md"
        minRows={3}
        autosize
        maxRows={6}
      />
      <Button onClick={onSubmit} className={styles.addCreate}>
        Create
      </Button>
    </Modal>
  );
}