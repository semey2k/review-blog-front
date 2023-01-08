import React from "react";

import { SideBlock } from "./SideBlock";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import { UserInfo } from "./UserInfo";
import MultiLingualContent from "../hooks/context";

export const CommentsBlock = ({ items, children, isLoading }) => {

  return (
    <SideBlock title={<MultiLingualContent contentID={'comments'}></MultiLingualContent>}>
      <List>
        {(isLoading ? [...Array(5)] : items).map((obj, index) => (
          <React.Fragment key={index}>
            <ListItem alignItems="flex-start">
              <UserInfo {...obj.user} additionalText={obj.createdAt} />
            </ListItem>
            <ListItemText sx={{paddingLeft: '66px', mb: 1}} primary={obj.commentsText}/>
            <Divider sx={{ml: '66px', mr: '21px'}} variant="inset" component="li" />
          </React.Fragment>
        ))}
      </List>
      {children}
    </SideBlock>
  );
};
