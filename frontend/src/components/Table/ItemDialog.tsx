import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Toolbar } from 'primereact/toolbar';
import React, { FormEvent, useRef, useState } from 'react';

type ItemDialogType = {
  onSave: (e: FormEvent<HTMLFormElement>) => void | Promise<void>;
  dialogForm: React.ReactNode;
};

export function ItemDialog({
  onSave,
  dialogForm,
}: ItemDialogType) {
  const formRef = useRef<HTMLFormElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  const hideDialog = () => {
    setIsVisible(false);
  };

  const openDialog = () => {
    setIsVisible(true);
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    await onSave(e);
    hideDialog();
  };

  const submitForm = () => {
    formRef.current?.requestSubmit();
  };

  return (
    <>
      <Toolbar start={(
        <div className="flex flex-wrap gap-2">
          <Button label="New" icon="pi pi-plus" severity="success" onClick={openDialog} />
        </div>
      )}
      />
      <Dialog
        visible={isVisible}
        onHide={hideDialog}
        footer={(
          <>
            <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" onClick={submitForm} />
          </>
        )}
      >
        <form ref={formRef} onSubmit={onSubmit}>
          {dialogForm}
        </form>
      </Dialog>
    </>
  );
}
