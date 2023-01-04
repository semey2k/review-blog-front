import React, { useContext } from 'react';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import TagIcon from '@mui/icons-material/Tag';
import ListItemText from '@mui/material/ListItemText';
import Skeleton from '@mui/material/Skeleton';

import { SideBlock } from './SideBlock';
import { Link, useNavigate } from 'react-router-dom';
import MultiLingualContent, { ColorModeContext } from '../hooks/context';

export const TagsBlock = ({ items, isLoading }) => {
  const { mode } = useContext(ColorModeContext);

  return (
    <SideBlock title={<MultiLingualContent contentID={'tags'}></MultiLingualContent>}>
      <List>
        {(isLoading ? [...Array(5)] : items.filter((i, n) => !items.includes(i, n + 1))).map(
          (name, i) => (
            <Link
              key={i}
              style={{ textDecoration: 'none', color: mode === 'dark' ? '#fff' : '#000' }}
              underline="none"
              to={`/posts/tags/${name}`}>
              <ListItem key={i} disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <TagIcon />
                  </ListItemIcon>
                  {isLoading ? <Skeleton width={100} /> : <ListItemText primary={name} />}
                </ListItemButton>
              </ListItem>
            </Link>
          ),
        )}
      </List>
    </SideBlock>
  );
};
