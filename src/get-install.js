const vscode = require('vscode')
const replace = require('replace-in-file')
const fs = require('fs')
const utils = require('./utils.js')
var cp = require('child_process')

async function getxInstall() {
    // Exibe um diálogo de confirmação antes de prosseguir
    const userChoice = await vscode.window.showInformationMessage(
        'This command will delete your lib folder and replace it with a new one, with a getx_pattern do you want to continue?',
        'Yes',
        'No'
    );

    // Se o usuário não confirmar, sai da função
    if (userChoice !== 'Yes') {
        return;
    }

    var pubspecPath = await utils.getPubspecPath()

    if (typeof pubspecPath === 'string' && pubspecPath.length > 0) {

        /// path = .../
        let path = pubspecPath.replace("pubspec.yaml", "")
        var data = fs.readFileSync(pubspecPath, 'utf-8')
        var lines = data.split('\n')

        cp.exec(`
        cd ${path} &&
        flutter pub remove get flutter_spinkit responsive_framework google_fonts flutter_datetime_picker_plus
        `, (err, stdout, stderr) => {
            if (err) {

                return console.log('error: ' + err)
            }
            console.log('stdout: ' + stdout)
            console.log('stderr: ' + stderr)

            data = fs.readFileSync(pubspecPath, 'utf-8')
            lines = data.split('\n')
            var index = 0
            for (let i = 0; i < lines.length; i++) {
                const element = lines[i];
                if (element.includes('dev_dependencies')) {
                    index = i
                }
            }
            lines.splice(index - 1, 0, "  google_fonts: 6.1.0")
            lines.splice(index - 1, 0, "  flutter_datetime_picker_plus: 2.1.0")
            lines.splice(index - 1, 0, "  responsive_framework: 1.1.1")
            lines.splice(index - 1, 0, "  flutter_spinkit: 5.2.0")
            lines.splice(index - 1, 0, "  get: 4.6.6")
            fs.writeFileSync(pubspecPath, lines.join('\n'), 'utf-8')
            data = lines.join('\n')

            cp.exec(`cd ${path} && dart pub upgrade --major-versions`)
        })


        var projectName = lines[0].replace("name: ", "")
        await moveFile(path, projectName)
        vscode.window.showInformationMessage('Generate successful 🥳🤘🏻')
    }
    else { return }
}

/**
 * @param {string} path
 * @param {string} projectName
 */
async function moveFile(path, projectName) {

    vscode.extensions.all.forEach((e) => {
        if (e.id.includes("getx-generator")) {
            vscode.workspace.fs.copy(vscode.Uri.parse(`${e.extensionPath}/getx_pattern/lib`), vscode.Uri.parse(`${path}lib`), { overwrite: true }).then(() => {

                replace.sync({
                    files: [
                        `${path}lib/*.dart`,
                        `${path}lib/app/data/api/*.dart`,
                        `${path}lib/app/data/provider/*.dart`,
                        `${path}lib/app/modules/home_module/*.dart`,
                        `${path}lib/app/modules/splash_module/*.dart`,
                        `${path}lib/app/routes/*.dart`,
                        `${path}lib/app/themes/*.dart`,
                        `${path}lib/app/translations/*.dart`,
                        `${path}lib/app/utils/*.dart`,
                        `${path}lib/app/utils/widgets/*.dart`,
                        `${path}lib/app/utils/widgets/app_bar/*.dart`,
                        `${path}lib/app/utils/widgets/app_button/*.dart`,
                        `${path}lib/app/utils/widgets/app_divider/*.dart`,
                        `${path}lib/app/utils/widgets/app_text_field/*.dart`,
                        `${path}lib/app/utils/widgets/bottom_sheet_provider/*.dart`,
                        `${path}lib/app/utils/widgets/dialog_provider/*.dart`,
                        `${path}lib/app/utils/widgets/dialog_provider/view_dialog/*.dart`,
                    ],
                    from: /getx_generator/g,
                    to: projectName,
                    countMatches: true,
                });
            })
        }
    })

}


module.exports = {
    getxInstall
}