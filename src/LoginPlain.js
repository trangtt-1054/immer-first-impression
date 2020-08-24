import React, { useState, useReducer } from 'react';
import produce from 'immer';
import { useImmerReducer } from 'use-immer';
import { login } from './utils';

const loginReducer = (draft, action) => {
  //now loginReducer behaves under the context of Immer, state sẽ thành draft object => đổi tên arg thành draft
  switch (action.type) {
    case 'field': {
      draft[action.field] = action.value;
      return; //ko cần return gì cả vì immer tự track đc các mutation trên cái draft object kia
    }
    case 'login': {
      draft.error = '';
      draft.loading = true;
      return;
    }
    case 'success': {
      draft.isLoggedIn = true;
      draft.loading = false;
      draft.username = '';
      draft.password = '';
      return;
    }
    case 'error': {
      draft.error = 'WRONG!';
      draft.username = '';
      draft.password = '';
      draft.loading = false;
      draft.isLoggedIn = false;
      return;
    }
    case 'logout': {
      draft.isLoggedIn = false;
      draft.username = '';
      draft.password = '';
      return;
    }
    default:
      return;
  }
};

const initialState = {
  username: '',
  password: '',
  loading: false,
  error: '',
  isLoggedIn: false,
};

//thay vì produce vào từng case trong switch thì wrap cái reducer của mình vào produce của immer

//const curriedLoginReducer = produce(loginReducer);

/* partially apply the immer functionality. under the hood, curry function looks like this. 
const fakeCurriedLoginReducer = (state, ...args) => {
  return produce(state, (draft) => {
    loginReducer(state, ...args)
  })
}
*/

const LoginPlain = () => {
  const [state, dispatch] = useImmerReducer(loginReducer, initialState);

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
