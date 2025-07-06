export const getData = (key) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

export const setData = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};


