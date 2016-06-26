import fs from 'fs';
import { spawn } from 'child_process';
import winston from 'winston';
import config from '../config';

const activeBots = new Map();

/**
 * Launch bots from configuration.
 */
export function launchBots() {
  for (let conf of config.bots) {
    launch(conf.socket, config.problems.paths, conf.logLevel, conf.logFile);
  }
}

/**
 * Launch a single bot and track it
 */
function launch(socket, problemLibraryPaths, logLevel, logFile) {
  const stream = fs.createWriteStream(logFile, {flags: 'a'});
  const child = spawn('progcon-bot', [socket, ...problemLibraryPaths], {
    env: {
      ...process.env,
      RUST_LOG: `progcon_bot=${logLevel}`,
    },
  });
  child.stdout.pipe(stream);
  child.stderr.pipe(stream);

  // keep track of it
  const pid = child.pid;
  activeBots.set(pid, child);
  child.on('exit', () => {
    activeBots.delete(pid);
    recover(pid, () => launch.apply(null, arguments), 2 * 1000);
  });
}

function recover(pid, fn, delay) {
  winston.warn(`Bot ${pid} has exited! Restarting in ${delay}ms.`);
  setTimeout(fn, delay);
}

process.on('exit', () => {
  for (let bot of activeBots.values()) {
    bot.removeAllListeners('exit');
    bot.kill();
  }
});
