const {
    createConnection,
    TextDocuments,
    ProposedFeatures,
    CompletionItemKind,
    TextDocumentSyncKind
} = require("vscode-languageserver/node");

const connection = createConnection(ProposedFeatures.all);
const documents = new TextDocuments();

// ----------------------
// SMG KEYWORDS + INFO
// ----------------------
const KEYWORDS = {
    set: "set <reg>, <value> — move a value into a register",
    plus: "plus <reg>, <value> — add a value to a register",
    minus: "minus <reg>, <value> — subtract a value from a register",
    Times: "Times <value> — multiply accumulator by value",
    divide: "divide <value> — divide accumulator by value",
    go: "go <label> — jump to label",
    include: "include <symbol> — declare external symbol",
    compare: "compare <a>, <b> — compare two values",
    wait: "wait — no operation",
    stop: "stop — halt execution",
    call: "call <label> — call function",
    goiflseql: "goiflseql <label> — jump if less or equal",
    goeq: "goeq <label> — jump if equal",
    gogreq: "gogreq <label> — jump if greater or equal",
    gogr: "gogr <label> — jump if greater"
};

// ----------------------
// INITIALIZE
// ----------------------
connection.onInitialize(() => {
    return {
        capabilities: {
            textDocumentSync: TextDocumentSyncKind.Incremental,
            completionProvider: { resolveProvider: false },
            hoverProvider: true
        }
    };
});

// ----------------------
// AUTOCOMPLETE
// ----------------------
connection.onCompletion(() => {
    return Object.keys(KEYWORDS).map(k => ({
        label: k,
        kind: CompletionItemKind.Keyword,
        detail: KEYWORDS[k]
    }));
});

// ----------------------
// HOVER INFO
// ----------------------
connection.onHover((params) => {
    const doc = documents.get(params.textDocument.uri);
    if (!doc) return null;

    const word = getWordAt(doc.getText(), params.position);

    if (KEYWORDS[word]) {
        return { contents: KEYWORDS[word] };
    }

    return null;
});

// ----------------------
// WORD EXTRACTION
// ----------------------
function getWordAt(text, position) {
    const lines = text.split(/\r?\n/);
    const line = lines[position.line] || "";

    const regex = /[A-Za-z0-9_]+/g;
    let match;

    while ((match = regex.exec(line))) {
        const start = match.index;
        const end = start + match[0].length;

        if (position.character >= start && position.character <= end) {
            return match[0];
        }
    }

    return "";
}

// ----------------------
// START SERVER
// ----------------------
documents.listen(connection);
connection.listen();