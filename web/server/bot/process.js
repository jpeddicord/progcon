import { spawn } from 'child_process';

function launch(socket, problemsPaths) {
  const child = spawn('progcon-bot', [socket, ...problemsPaths]);
}
