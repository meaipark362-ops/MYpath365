import http from 'http';
import { spawn } from 'child_process';

const server = spawn('npx.cmd', ['vite', 'preview', '--port', '4173'], { stdio: 'pipe', shell: true });

server.stdout.on('data', (data) => {
  const text = data.toString();
  if (text.includes('Local:')) {
    setTimeout(() => {
      http.get('http://localhost:4173/', (res) => {
        let body = '';
        res.on('data', (c) => body += c);
        res.on('end', () => {
          console.log('HTTP_STATUS:', res.statusCode);
          console.log('CONTAINS_ROOT:', body.includes('<div id="root"></div>'));
          console.log('CONTAINS_JS:', body.includes('.js'));
          console.log('CONTAINS_CSS:', body.includes('.css'));
          server.kill();
          process.exit(0);
        });
      }).on('error', (err) => {
        console.error('Request error:', err);
        server.kill();
        process.exit(1);
      });
    }, 500);
  }
});

server.stderr.on('data', (data) => {
  console.error('Server stderr:', data.toString());
});
