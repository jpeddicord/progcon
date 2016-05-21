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
    ipcEvents: 'tcp://localhost:12346',
  },
};

export async function load() {
  return;
}

export default config;
