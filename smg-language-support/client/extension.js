const vscode = require("vscode");
const { LanguageClient, TransportKind } = require("vscode-languageclient/node");

let client;

function activate(context) {
    const serverModule = context.asAbsolutePath("server/server.js");

    const serverOptions = {
        run: { module: serverModule, transport: TransportKind.ipc },
        debug: { module: serverModule, transport: TransportKind.ipc }
    };

    const clientOptions = {
        documentSelector: [{ scheme: "file", language: "SMG" }]
    };

    client = new LanguageClient(
        "smgLanguageServer",
        "SMG Language Server",
        serverOptions,
        clientOptions
    );

    client.start();
}

function deactivate() {
    if (!client) return undefined;
    return client.stop();
}

module.exports = { activate, deactivate };