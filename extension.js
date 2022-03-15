const vscode = require('vscode');
const getxInstall = require('./src/get-install.js');
const getxAddPage = require('./src/get-add-page.js');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	let getxInstallCmd = vscode.commands.registerCommand('getx-generator.getxInstall', getxInstall.getxInstall);
	let getxAddPageCmd = vscode.commands.registerCommand('getx-generator.getxAddPage', getxAddPage.getxAddPage);

	context.subscriptions.push(getxInstallCmd);
	context.subscriptions.push(getxAddPageCmd);
}

// this method is called when your extension is deactivated
function deactivate() { }

module.exports = {
	activate,
	deactivate
}
