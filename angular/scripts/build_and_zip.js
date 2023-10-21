const child = require('child_process')




function run(script, args) {
    child.spawn('node', [__dirname + '/' + script].concat(args), {
        cwd: process.cwd(),
        env: process.env,
        detached: false,
        stdio: 'inherit'
    });
}


const project = process.argv[2]
const dir = project.split('-').join('_')


run('run_shell_script.js', ['build_and_zip', project, dir]);

