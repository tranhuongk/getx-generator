const vscode = require('vscode')
const replace = require('replace-in-file')
const fs = require('fs')
var cp = require('child_process')

async function getxInstall() {
    var pubspecPath = await getPubspecPath()

    if (typeof pubspecPath === 'string' && pubspecPath.length > 0) {

        /// path = .../
        let path = pubspecPath.replace("pubspec.yaml", "")
        var data = fs.readFileSync(pubspecPath, 'utf-8')
        var lines = data.split('\n')

        cp.exec(`
        cd ${path} &&
        flutter pub remove get flutter_spinkit responsive_framework google_fonts flutter_datetime_picker
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
            lines.splice(index - 1, 0, "  google_fonts: 2.3.0")
            lines.splice(index - 1, 0, "  flutter_datetime_picker: 1.5.1")
            lines.splice(index - 1, 0, "  responsive_framework: 0.1.7")
            lines.splice(index - 1, 0, "  flutter_spinkit: 5.1.0")
            lines.splice(index - 1, 0, "  get: 4.6.1")
            fs.writeFileSync(pubspecPath, lines.join('\n'), 'utf-8')
            data = lines.join('\n')

            cp.exec(`cd ${path} && flutter pub get`)
        })


        var projectName = lines[0].replace("name: ", "")
        await moveFile(path, projectName)
    }
    else { return }
}

/**
 * @param {string} path
 */
async function moveFile(path, projectName) {

    vscode.extensions.all.forEach((e) => {
        if (e.id.includes("getx-generator")) {
            vscode.workspace.fs.copy(vscode.Uri.parse(`${e.extensionPath}/lib`), vscode.Uri.parse(`${path}lib`), { overwrite: true }).then(() => {

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

async function getPubspecPath() {
    try {
        let path = await vscode.workspace.findFiles('pubspec.yaml')
        return path[0].path
    } catch (error) {
        const pickItems = getxInstallTemplate()

        const selectedTemplate = await vscode.window.showQuickPick(
            pickItems,
            {
                matchOnDescription: true,
                placeHolder: "Project not found!",
            },
        )

        if (!selectedTemplate)
            return;

        chooseGetxInstallTemplate(selectedTemplate.template.id);
        return;
    }
}

/**
 * @param {string} id
 */
function chooseGetxInstallTemplate(id) {
    switch (id) {
        case 'createProject':
            return vscode.commands.executeCommand('flutter.createProject');
        case 'openProject':
            return vscode.commands.executeCommand('vscode.openFolder');
        default:
            return;
    }
}

function getxInstallTemplate() {
    const templates = [
        {
            detail: "Create new flutter project.",
            label: "Flutter: New Project",
            template: { id: "createProject" },
        },
        {
            detail: "Open an existing flutter project.",
            label: "Flutter: Open Project",
            template: { id: "openProject" },
        },
    ]

    return templates
}

module.exports = {
    getxInstall
};