const vscode = require('vscode');
const getxInstall = require('./src/get-install.js');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	let disposable = vscode.commands.registerCommand('getx-generator.getxInstall', getxInstall.getxInstall);

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
function deactivate() { }

module.exports = {
	activate,
	deactivate
}
