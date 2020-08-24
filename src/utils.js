export async function login({ username, password }) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (username === 'trangxinh' && password === '12345') {
        resolve();
      } else {
        reject();
      }
    }, 1000);
  });
}
