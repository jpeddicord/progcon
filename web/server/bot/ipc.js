import nanomsg from 'nanomsg';
import config from '../config';

export const commands = nanomsg.socket('req');
export const events = nanomsg.socket('sub');

commands.connect(config.bot.ipcCommands);

commands.on('data', buf => {
  console.log('got some stuff:', buf.toString());
});

// FIXME: only send when we've received a response; nanomsg may drop the response otherwise
// may need to build a send queue when backlogged
export function submitAnswer(userId, problem, answer) {
  commands.send(JSON.stringify({
    id: 12345678,
    user: userId,
    problem,
    answer,
  }));
}
