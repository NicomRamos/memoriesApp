import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { Container, Grow, Grid, AppBar, TextField, Button, Paper } from '@material-ui/core';

import Form from '../Form/Form';
import useStyles from './styles';
import Posts from '../Posts/Posts';
import Pagination from '../Pagination';
import { getPostsBySearch } from '../../actions/posts';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}
const Home = () => {
  const [tags, setTags] = useState([]);
  const [search, setSearch] = useState('');
  const [currentId, setCurrentId] = useState(0);

  const query = useQuery();
  const classes = useStyles();
  const history = useHistory();

  const dispatch = useDispatch();

  const page = query.get('page') || 1;
  const searchQuery = query.get('searchQuery');

  const user = JSON.parse(localStorage.getItem('profile'));

  const searchPost = () => {
    if (search.trim() || tags) {
      dispatch(getPostsBySearch({ search, tags: tags.join(',') }));
      history.push(`/posts/search?searchQuery=${search || 'none'}&tags=${tags.join(',')}`);
    } else {
      history.push('/');
    }
  };

  const handleKeyPress = (e) => {
    if (e.keyCode === 13) {
      searchPost();
    }
  };

  const handleTags = (e) => {
    const arrTags = e.target.value.split(',')
    setTags([...tags, arrTags])
  };

  return (
    <Grow in>
      <Container maxWidth="xl">
        <Grid container justify="space-between" alignItems="stretch" spacing={3} className={classes.gridContainer}>
          <Grid item xs={12} sm={6} md={9}>
            <Posts setCurrentId={setCurrentId} />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <AppBar className={classes.appBarSearch} position="static" color="inherit">
              <TextField onKeyDown={handleKeyPress} name="search" variant="outlined" label="Search Memories" fullWidth value={search} onChange={(e) => setSearch(e.target.value)} />
              <TextField style={{ margin: '10px 0' }} name="tags" variant="outlined" label="Tags" fullWidth onChange={e => handleTags(e)} />
              <Button onClick={searchPost} className={classes.searchButton} variant="contained" color="primary">Search</Button>
            </AppBar>
            {user && <Form currentId={currentId} setCurrentId={setCurrentId} />}
            {(!searchQuery && !tags.length) && (
              <Paper className={classes.pagination} elevation={6}>
                <Pagination page={page} />
              </Paper>
            )}
          </Grid>
        </Grid>
      </Container>
    </Grow>
  );
};

export default Home;
