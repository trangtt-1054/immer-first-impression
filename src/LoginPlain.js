import React, { useState, useReducer } from 'react';
import produce from 'immer';
import { login } from './utils';

const loginReducer = (state, action) => {
  switch (action.type) {
    //reducer phải trả về 1 copy object vì nếu là same instance object thì react component sẽ ko update, sẽ error-prone nếu object bị nest nhiều
    case 'field':
      //pass in produce the object that you want to mutate and the (draft) object is the copy of input object
      return produce(state, (draft) => {
        draft[action.field] = action.value;
      });

    //action-on-write: when you assign new properties and manipulate data on draft obj, immer will track all those mutation. When the fn returns, we will immutably assign them to the input object
    case 'login':
      return produce(state, (draft) => {
        draft.error = '';
        draft.isLoading = true;
      });
    case 'success':
      return { ...state, isLoggedIn: true };
    case 'error':
      return {
        ...state,
        error: 'WRONG!',
        username: '',
        password: '',
        loading: false,
      };
    case 'logout':
      return { ...state, isLoggedIn: false, username: '', password: '' };
  }
};

const initialState = {
  username: '',
  password: '',
  loading: false,
  error: '',
  isLoggedIn: false,
};

const LoginPlain = () => {
  const [state, dispatch] = useReducer(loginReducer, initialState);

  const { username, password, loading, error, isLoggedIn } = state;

  const onSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: 'login' });
    //await login({ username, password }); //nếu fail thì reject Promise nên phải try catch
    try {
      await login({ username, password });
      dispatch({ type: 'success' });
    } catch {
      dispatch({ type: 'error' });
    }
  };

  return (
    <div>
      {isLoggedIn ? (
        <>
          <h1>Welcome back {username}</h1>
          <button onClick={() => dispatch({ type: 'logout' })}>Log Out</button>
        </>
      ) : (
        <form onSubmit={onSubmit}>
          <p>Login Please</p>

          {error && <p style={{ color: 'red' }}>{error}</p>}
          <input
            type='text'
            placeholder='username'
            value={username}
            onChange={(e) =>
              dispatch({
                type: 'field',
                field: 'username',
                value: e.currentTarget.value,
              })
            }
          />
          <input
            type='password'
            placeholder='password'
            autoComplete='new-password'
            value={password}
            onChange={(e) =>
              dispatch({
                type: 'field',
                field: 'password',
                value: e.currentTarget.value,
              })
            }
          />
          <button type='submit' disabled={loading}>
            {loading ? 'Logging in...' : 'login'}
          </button>
        </form>
      )}
    </div>
  );
};

export default LoginPlain;
