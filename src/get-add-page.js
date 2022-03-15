// @ts-nocheck
const vscode = require('vscode')
const replace = require('replace-in-file')
const fs = require('fs')
const utils = require('./utils.js')

async function getxAddPage() {
    var pubspecPath = await utils.getPubspecPath()

    if (typeof pubspecPath === 'string' && pubspecPath.length > 0) {

        /// path = .../
        let path = pubspecPath.replace("pubspec.yaml", "")
        var data = fs.readFileSync(pubspecPath, 'utf-8')
        var lines = data.split('\n')
        var projectName = lines[0].replace("name: ", "")


        const pageName = await vscode.window.showInputBox({
            placeHolder: "Enter Page Name",
            prompt: "Add Page Name with stardard: `PageName` or `page name` or `page_name`",
        });

        if (pageName.length > 0) {
            await moveFile(path, projectName, pageName)
        }
    }
}

/**
 * @param {string} path
 * @param {string} projectName
 * @param {string} pageName
 */
async function moveFile(path, projectName, pageName) {
    let extension
    vscode.extensions.all.forEach((e) => {
        if (e.id.includes("getx-generator")) {
            extension = e
        }
    })

    if (extension == null) {
        return
    }

    var fileName = pageName
        .replace(/_/g, ' ')
        .replace(/([A-Z])/g, ' $1')
        .toLowerCase()
        .replace(/page/g, '').trim()
        .replace(/\s\s+/g, ' ')
        .replace(/\s/g, '_')

    var className = fileName
        .replace(/_/g, ' ')
        .replace(/\w+/g,
            function (w) { return w[0].toUpperCase() + w.slice(1).toLowerCase(); })
        .replace(/\s/g, '')

    var routeName = className.charAt(0).toLowerCase() + className.substring(1)
    var routeNameCmt = fileName
        .replace(/_/g, ' ')
        .replace(/\w+/g,
            function (w) { return w[0].toUpperCase() + w.slice(1).toLowerCase(); })

    await vscode.workspace.fs.copy(
        vscode.Uri.parse(`${extension.extensionPath}/template/app/data/provider/template_provider.dart`),
        vscode.Uri.parse(`${path}lib/app/data/provider/${fileName}_provider.dart`),
        { overwrite: true }
    )
    await vscode.workspace.fs.copy(
        vscode.Uri.parse(`${extension.extensionPath}/template/app/modules/template_module/template_page.dart`),
        vscode.Uri.parse(`${path}lib/app/modules/${fileName}_module/${fileName}_page.dart`),
        { overwrite: true }
    )
    await vscode.workspace.fs.copy(
        vscode.Uri.parse(`${extension.extensionPath}/template/app/modules/template_module/template_controller.dart`),
        vscode.Uri.parse(`${path}lib/app/modules/${fileName}_module/${fileName}_controller.dart`),
        { overwrite: true }
    )
    await vscode.workspace.fs.copy(
        vscode.Uri.parse(`${extension.extensionPath}/template/app/modules/template_module/template_binding.dart`),
        vscode.Uri.parse(`${path}lib/app/modules/${fileName}_module/${fileName}_binding.dart`),
        { overwrite: true }
    )

    var files = [
        `${path}lib/app/modules/${fileName}_module/*.dart`,
        `${path}lib/app/data/provider/${fileName}_provider.dart`,
    ]

    replace.sync({
        files,
        from: /getx_generator/g,
        to: projectName,
        countMatches: true,
    });

    replace.sync({
        files,
        from: /Template/g,
        to: className,
        countMatches: true,
    });

    replace.sync({
        files,
        from: /template/g,
        to: fileName,
        countMatches: true,
    });


    // App Pages Modify
    let appPagesPath = `${path}lib/app/routes/app_pages.dart`
    var appPagesData = fs.readFileSync(appPagesPath, 'utf-8')
    var appPagesLines = appPagesData.split('\n')
    appPagesLines.splice(1, 0, `import 'package:${projectName}/app/modules/${fileName}_module/${fileName}_page.dart';`)
    appPagesLines.splice(1, 0, `import 'package:${projectName}/app/modules/${fileName}_module/${fileName}_binding.dart';`)

    var index = 0
    for (let i = 0; i < appPagesLines.length; i++) {
        const element = appPagesLines[i];
        if (element.includes(']')) {
            index = i
        }
    }
    appPagesLines.splice(index, 0,
        `    GetPage(
        name: AppRoutes.${routeName},
        page: () => const ${className}Page(),
        binding: ${className}Binding(),
    ),`
    )
    fs.writeFileSync(appPagesPath, appPagesLines.join('\n'), 'utf-8')

    // App Routes Modify
    let appRoutesPath = `${path}lib/app/routes/app_routes.dart`
    var appRoutesData = fs.readFileSync(appRoutesPath, 'utf-8')
    var appRoutesLines = appRoutesData.split('\n')

    var index = 0
    for (let i = 0; i < appRoutesLines.length; i++) {
        const element = appRoutesLines[i];
        if (element.includes('}')) {
            index = i
        }
    }

    appRoutesLines.splice(index, 0,
        `  static const ${routeName} = '/${routeName}'; // ${routeNameCmt} page`
    )
    fs.writeFileSync(appRoutesPath, appRoutesLines.join('\n'), 'utf-8')


}


module.exports = {
    getxAddPage
}