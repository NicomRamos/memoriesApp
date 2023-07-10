import FileBase from 'react-file-base64';
import { useHistory } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TextField, Button, Typography, Paper } from '@material-ui/core';

import { createPost, updatePost } from '../../actions/posts';
import useStyles from './styles';
import { useForm } from '../../hooks/useForm';

const Form = ({ currentId, setCurrentId }) => {

  const { formState, onInputChange, onResetForm } = useForm()

  // const [postData, setPostData] = useState({ title: '', message: '', tags: [], selectedFile: '' });
  const [tags, setTags] = useState([])
  const [selectedFile, setSelectedFile] = useState("")
  const classes = useStyles();
  const history = useHistory();
  console.log(currentId)

  const dispatch = useDispatch();

  const user = JSON.parse(localStorage.getItem('profile'));
  const post = useSelector((state) => (currentId ? state.posts.posts.find((message) => message._id === currentId) : null));
  
  const defaultValue = {title: "", message: "", tags: ""}
  const clear = () => {
    setCurrentId(0);
    onResetForm()
    // setPostData({ title: '', message: '', tags: [], selectedFile: '' });
  };

  useEffect(() => {
    console.log(post)
    // if (!post?.title) clear();
    // if (post) onInputChange(post);
  // if (post) formState = post;
  }, [post]);
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    formState.tags = tags
    formState.selectedFile = selectedFile
    if (currentId === 0) {
      dispatch(createPost({ ...formState, name: user?.result?.name }, history));
      clear();
    } else {
      dispatch(updatePost(currentId, { ...formState, name: user?.result?.name , creator: user?.result?._id}, history));
      clear();
    }
  };
  return (
    <Paper className={classes.paper} elevation={6}>
      <form autoComplete="off" noValidate className={`${classes.root} ${classes.form}`} onSubmit={handleSubmit}>
        <Typography variant="h6">{currentId ? `Editing "${post?.title}"` : 'Creating a Memory'}</Typography>
        <TextField required name="title" variant="outlined" label="Title" fullWidth defaultValue={defaultValue.title} onChange={onInputChange} />
        <TextField required name="message" variant="outlined" label="Message" fullWidth defaultValue={defaultValue.message} multiline rows={4} onChange={onInputChange} />
        <TextField required name="tags" variant="outlined" label="Tags" fullWidth defaultValue={defaultValue.tags} onChange={e => setTags(e.target.value.split(' '))} />
        <div className={classes.fileInput}><FileBase type="file" multiple={false} onDone={({ base64 }) => setSelectedFile(base64)} /></div>
        <Button className={classes.buttonSubmit} variant="contained" color="primary" size="large" type="submit" fullWidth>Submit</Button>
        <Button variant="contained" color="secondary" size="small" onClick={clear} fullWidth>Clear</Button>
      </form>
    </Paper>
  );
};

export default Form;
