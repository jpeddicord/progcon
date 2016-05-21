import nanomsg from 'nanomsg';
import config from '../config';

export const commands = nanomsg.socket('req');
export const events = nanomsg.socket('sub');

commands.connect(config.bot.ipcCommands);

commands.on('data', buf => {
  console.log('got some stuff:', buf.toString());
});
