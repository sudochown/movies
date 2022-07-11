import React, { FC } from 'react';
import { GridToolbar, GridToolbarContainer } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import { Button } from '@mui/material';

interface EditToolbarProps {
    addNewRowHandler: () => void;
}

const EditToolbar: FC<EditToolbarProps> = ({ addNewRowHandler }) => {
  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={addNewRowHandler}>
        Add movie
      </Button>
      <GridToolbar/>
    </GridToolbarContainer>
  );
};

export default EditToolbar;
