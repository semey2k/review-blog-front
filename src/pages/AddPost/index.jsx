import React from 'react';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import SimpleMDE from 'react-simplemde-editor';
import { selectIsAuth } from '../../redux/slices/auth';
import { useSelector } from 'react-redux';
import { useNavigate, Navigate, useParams, Link } from 'react-router-dom';
import axios from '../../axios';

import clsx from 'clsx';
import 'easymde/dist/easymde.min.css';
import styles from './AddPost.module.scss';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import { Autocomplete, Chip, Grid, IconButton } from '@mui/material';
import MultiLingualContent, { ColorModeContext, LanguageContext } from '../../hooks/context';
import { Image, Transformation } from 'cloudinary-react';

import CloseIcon from '@mui/icons-material/Close';

export const AddPost = () => {
  const { id, el } = useParams();
  const navigate = useNavigate();
  const isAuth = useSelector(selectIsAuth);
  const [text, setText] = React.useState('');
  const [isLoading, setLoading] = React.useState(false);
  const [title, setTitle] = React.useState('');
  const [art, setArt] = React.useState('');
  const [allTags, setAllTags] = React.useState([]);
  const [imageUrl, setImageUrl] = React.useState('');
  const inputFileRef = React.useRef(null);
  const [genres, setGenres] = React.useState('');
  const [userRating, setUserRating] = React.useState(0);
  const [tags, setTags] = React.useState([]);

  const {getLocaleLanguage} = React.useContext(LanguageContext)


  function handleRemoving() {
    axios
      .delete(`/${imageUrl}`)
      .then(() => {
        setImageUrl('');
      })
      .catch((e) => console.log(e));
  }

  function handleOpenWidget() {
    var myWidget = window.cloudinary.createUploadWidget(
      {
        cloudName: 'dw0rsewtk',
        uploadPreset: 'y13jvujf',
        sources: ['local'],
      },
      (error, result) => {
        if (!error && result && result.event === 'success') {
          setImageUrl(result.info.public_id);
        }
      },
    );
    myWidget.open();
  }

  const handleChangeGenres = (event) => {
    setGenres(event.target.value);
  };

  const handleChangeRating = (event) => {
    setUserRating(event.target.value);
  };

  React.useEffect(() => {
    const fetchTags = async () => {
      const response = await axios.get('/tags');
      setAllTags(response.data.filter((i, n) => !response.data.includes(i, n + 1)));
    };
    fetchTags();
  }, []);

  const isEditing = Boolean(id);

  const onChange = React.useCallback((value) => {
    setText(value);
  }, []);

  const { mode } = React.useContext(ColorModeContext);

  const onSubmit = async () => {
    try {
      setLoading(true);

      const fields = {
        title,
        imageUrl,
        tags,
        text,
        genres,
        userRating: Number(userRating),
        el,
        art,
      };

      const { data } = isEditing
        ? await axios.patch(`/posts/${id}`, fields)
        : await axios.post('/posts', fields);

      const _id = isEditing ? id : data._id;

      navigate(`/posts/${_id}`);
    } catch (err) {
      console.warn(err);
      alert('Ошибка при создании статьи');
    }
  };

  React.useEffect(() => {
    if (id) {
      axios.get(`/posts/${id}`).then(({ data }) => {
        setTitle(data.title);
        setText(data.text);
        setImageUrl(data.imageUrl);
        setTags(data.tags);
        setGenres(data.genres);
        setUserRating(data.userRating);
        setArt(data.art);
      });
    }
  }, []);

  const options = React.useMemo(
    () => ({
      spellChecker: false,
      maxHeight: '400px',
      autofocus: true,
      placeholder: getLocaleLanguage === 'en' ? 'Type a Text...' : 'Введите текст...',
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    [],
  );

  if (!window.localStorage.getItem('token') && !isAuth) {
    return <Navigate to="/" />;
  }

  return (
    <Paper style={{ padding: '0px 10px 20px' }}>
      <Grid container spacing={0}>
        <Grid items xs={12} sm={5} md={4} lg={3.5}>
          {!imageUrl ? (
            <div
              className={styles.imgBtn}
              style={{ border: mode === 'dark' ? '1px solid #fff' : '1px solid#001e3c' }}>
              <Button
                color="outlined"
                onClick={() => handleOpenWidget()}
                variant="outlined"
                size="large">
                <MultiLingualContent contentID={'download'}></MultiLingualContent>
              </Button>
              <input ref={inputFileRef} type="file" onChange={handleOpenWidget} hidden />
            </div>
          ) : (
            <div style={{ position: 'relative' }} className={styles.img}>
              <Image className={styles.image} cloudName="dw0rsewtk" publicId={imageUrl}>
                <Transformation width="300" height="410" crop="fill" />
              </Image>
              <IconButton
                onClick={() => handleRemoving()}
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '0',
                  width: '23px',
                  height: '23px',
                }}>
                <CloseIcon />
              </IconButton>
            </div>
          )}
        </Grid>
        <Grid items xs={12} sm={7} md={8} lg={8.5} style={{ padding: '20px' }}>
          <FormControl color="outlined" variant="standard" sx={{ minWidth: 120, mb: 1 }}>
            <InputLabel id="demo-simple-select-label">
              <MultiLingualContent contentID={'genres'}></MultiLingualContent>
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={genres}
              label="genres"
              onChange={handleChangeGenres}>
              <MenuItem value={'Games'}>
                <MultiLingualContent contentID={'games'}></MultiLingualContent>
              </MenuItem>
              <MenuItem value={'Cinema'}>
                <MultiLingualContent contentID={'cinema'}></MultiLingualContent>
              </MenuItem>
              <MenuItem value={'Books'}>
                <MultiLingualContent contentID={'books'}></MultiLingualContent>
              </MenuItem>
            </Select>
          </FormControl>
          <TextField
            color="outlined"
            classes={{ root: styles.title }}
            variant="standard"
            placeholder={getLocaleLanguage === 'en' ? 'Title of Review' : 'Заголовок статьи...'}
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            color="outlined"
            classes={{ root: styles.art }}
            variant="standard"
            placeholder={getLocaleLanguage === 'en' ? 'Name of art' : 'Название произведения'}
            fullWidth
            value={art}
            onChange={(e) => setArt(e.target.value)}
          />
          <Autocomplete
            multiple
            color="outlined"
            id="tags-filled"
            options={allTags.map((option) => option)}
            freeSolo
            value={tags}
            onChange={(event, newValue) => setTags(newValue)}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip color="primary" variant="filled" label={option} {...getTagProps({ index })} />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                color="outlined"
                variant="outlined"
                label={<MultiLingualContent contentID={'tags'}></MultiLingualContent>}
                placeholder="Press enter to add tags"
              />
            )}
          />
          <FormControl color="outlined" variant="standard" sx={{ minWidth: 140, mt: 2 }}>
            <InputLabel id="demo-simple-select-label">
              <MultiLingualContent contentID={'authorRating'}></MultiLingualContent>
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={userRating}
              label="userRating"
              onChange={handleChangeRating}>
              <MenuItem value={'1'}>1</MenuItem>
              <MenuItem value={'2'}>2</MenuItem>
              <MenuItem value={'3'}>3</MenuItem>
              <MenuItem value={'4'}>4</MenuItem>
              <MenuItem value={'5'}>5</MenuItem>
              <MenuItem value={'6'}>6</MenuItem>
              <MenuItem value={'7'}>7</MenuItem>
              <MenuItem value={'8'}>8</MenuItem>
              <MenuItem value={'9'}>9</MenuItem>
              <MenuItem value={'10'}>10</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <SimpleMDE
        className={clsx(styles.editor, { [styles.editorDark]: mode === 'dark' })}
        value={text}
        onChange={onChange}
        options={options}
      />
      <div className={styles.buttons}>
        <Button onClick={onSubmit} size="large" variant="contained">
          {isEditing ? (
            <MultiLingualContent contentID={'save'}></MultiLingualContent>
          ) : (
            <MultiLingualContent contentID={'post'}></MultiLingualContent>
          )}
        </Button>
        <Link style={{ textDecoration: 'none' }} to="/">
          <Button color="outlined" size="large">
            <MultiLingualContent contentID={'cancel'}></MultiLingualContent>
          </Button>
        </Link>
      </div>
    </Paper>
  );
};
