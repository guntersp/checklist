const child = require('child_process')
const fs = require('fs')
const path = require('path')
const extractZip = require('extract-zip')




function run(script, args) {
    child.spawn('node', [__dirname + '/' + script].concat(args), {
        cwd: process.cwd(),
        env: process.env,
        detached: false,
        stdio: 'inherit'
    });
}

function copyRecursively(source, dest) {
    if (fs.statSync(source).isDirectory()) {
        fs.mkdirSync(dest, {
            recursive: true
        })

        for (const f of (fs.readdirSync(source) || [])) {
            copyRecursively(source + '/' + f, dest + '/' + f)
        }

        return
    }

    fs.copyFileSync(source, dest)
}


function copyZipContent(zip, dest, rootToIgnore = null) {
    extractZip(zip, {
        dir: dest
    }).then(() => {

        if (!rootToIgnore) {
            return
        }

        const files = fs.readdirSync(dest);
        if (files.length !== 1 && files[0].toLowerCase() !== rootToIgnore.toLowerCase()) {
            return;
        }

        const f = dest + '/' + files[0]
        if (!fs.statSync(f).isDirectory()) {
            return;
        }

        const temp = dest + '/.temp'
        fs.renameSync(f, temp)

        for (const f of (fs.readdirSync(temp) || [])) {
            fs.renameSync(temp + '/' + f, dest + '/' + f);
        }

        fs.rmdirSync(temp)
    })
}


const project = process.argv[2]
const dir = project.split('-').join('_')


const releasesDir = __dirname + '/../../../releases/'
const installFile = releasesDir + 'frontend_install.json'
const installTemp = __dirname + '/../dist/frontend_data/' + dir

// check if there is a service that should be included
if (!fs.existsSync(installFile)) {
    throw 'could not find frontend install config file'
}

fs.rmdirSync(installTemp, {
    recursive: true
})

const desc = JSON.parse(fs.readFileSync(installFile))


fs.mkdirSync(installTemp, {
    recursive: true
})
const info = {
    root: null,
    install: null,
    fullscreen: false,
    packages: {}
}


if (desc[project] !== undefined) {
    console.log('preparing additional services')


    const data = desc[project]

    info.root = data['root'] || null
    info.install = data['install'] ? installTemp + '/' + data['install'] : null
    info.fullscreen = data['fullscreen'] || false


    for (const p of (data['packages'] || [])) {
        const name = p['id'] || dir

        const tempDir = installTemp + '/' + name
        fs.mkdirSync(tempDir, {
            recursive: true
        })

        var found = false;

        for (s of (p['alternativeSources'] || [])) {
            if (!path.isAbsolute(s)) {
                s = releasesDir + s
            }

            console.log('checking: ', s)

            if (!fs.existsSync(s)) {
                console.log(' not found')
                continue
            }

            if (fs.statSync(s).isDirectory()) {
                console.log(' copying dir')

                copyRecursively(s, tempDir);

            } else if (s.toLowerCase().endsWith('.zip')) {
                console.log(' copying zip')

                copyZipContent(s, tempDir, name);

            } else {
                console.error(' file type not supported')
                continue;
            }

            found = true;
            break; // stop after having found a source
        }

        if (!found) {
            throw 'could not find any valid source for package "' + p.id + '"'
        }

        //console.log(p)

        if (!info.packages[name]) {
            info.packages[name] = {
                background_services: [],
                options_services: []
            }
        }

        const package = info.packages[name]

        for (const s of (p['background_services'] || [])) {            
            if (!s['disabled']) {
                package.background_services.push(s)
            }
        }
        for (const s of (p['options_services'] || [])) {
            if (!s['disabled']) {
                package.options_services.push(s)
            }
        }
    }
}

fs.writeFileSync(installTemp + '/info.json', JSON.stringify(info))


const args = ['electron_and_zip', project, dir]

if (info.install) {
    args.push(info.install.split('/').join(path.sep))
}


run('run_shell_script.js', args);

