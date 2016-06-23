const config = {
  database: {
    host: '',
    database: '',
    user: '',
    password: '',
  },
  jwt: {
    secret: '',
  },
  admin: {
    password: '',
  },
  bot: {
    ipcCommands: 'tcp://localhost:12345',
  },
};

export function load() {
  return new Promise();
}

export default config;
