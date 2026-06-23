const https = require('https');

https.get('https://gest-fournitures-bureautique.vercel.app/backend/src/server.ts', res => {
  console.log(`statusCode: ${res.statusCode}`);
  res.on('data', d => {
    process.stdout.write(d);
  });
}).on('error', e => {
  console.error(e);
});
