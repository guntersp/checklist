const child = require('child_process')




function run(batch, args) {
  child.spawn('cmd', ['/C', __dirname + '/' + batch + '.bat'].concat(args), {
    cwd: process.cwd(),
    env: process.env,
    detached: false,
    stdio: 'inherit'
  });
}

const script = process.argv[2]

run(script, process.argv.splice(3))
