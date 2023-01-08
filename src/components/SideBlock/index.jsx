import React from "react";
import styles from "./SideBlock.module.scss";
import Typography from "@mui/material/Typography";

export const SideBlock = ({ title, children }) => {
  return (
    <div classes={{ root: styles.root }}>
      <Typography variant="h6" classes={{ root: styles.title }}>
        {title}
      </Typography>
      {children}
    </div>
  );
};
