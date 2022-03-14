const vscode = require('vscode')
const replace = require('replace-in-file')
const fs = require('fs')
// var cp = require('child_process')

async function getxInstall() {
    var path = await getPubspecPath()
    path = path.replace("pubspec.yaml", "")

    if (typeof path === 'string' && path.length > 0) {

        // cp.exec(`
        // cd ${path} &&
        // flutter pub remove get flutter_spinkit responsive_framework google_fonts flutter_datetime_picker &&
        // flutter pub add get &&
        // flutter pub add flutter_spinkit &&
        // flutter pub add responsive_framework &&
        // flutter pub add google_fonts &&
        // flutter pub add flutter_datetime_picker &&
        // flutter pub get
        // `)

        await moveFile(path)
    }
    else { return }
}

/**
 * @param {string} path
 */
async function moveFile(path) {

    var data = fs.readFileSync(`${path}pubspec.yaml`, 'utf-8');

    var projectName = data.substring(data.indexOf("name:"), data.indexOf("\n")).replace("name: ", "");

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