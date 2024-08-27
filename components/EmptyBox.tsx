import {Button} from "@mui/material";
import * as React from "react";

const EmptyBox: (props) => JSX.Element = (props) => {
  const { id, write, owner, setBox } = props;

  const selectSpace = () => {
    setBox(id);
    write();
  }

  return (
    <div>
      {
        owner === '0x0000000000000000000000000000000000000000' ?
          <Button
            onClick={() => write ? selectSpace() : {}}
            variant="contained"
            style={{margin: 'auto'}}
          >
            Place
          </Button>
          :
          <span></span>
      }
    </div>
  );
};

export default EmptyBox;

