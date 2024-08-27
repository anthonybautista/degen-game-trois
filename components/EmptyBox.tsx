import {Button} from "@mui/material";
import * as React from "react";

const EmptyBox: (props) => JSX.Element = (props) => {
  const { id, selectedBox, write, owner } = props;

  return (
    <div>
      {
        owner === '0x0000000000000000000000000000000000000000' ?
          <Button
            onClick={() => write ? write() : {}}
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

