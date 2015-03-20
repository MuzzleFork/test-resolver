// with help from http://stackoverflow.com/questions/13227489/how-can-one-get-the-file-path-of-the-caller-function-in-node-js

module.exports = thisPath;

function thisPath(path) {
    var caller = getCaller();
    var parts = caller.filename.split('/');
    var keywords = ['tests', 'specs', 'spec', 'test'];
    keywords.forEach(function(keyword) {
        if (parts.indexOf(keyword) >= 0) {
            parts.splice(parts.indexOf(keyword), 1);
        }
    });
    parts.pop();
    if (path) {
        parts.push(path);
    }
    return parts.join('/');
}

// private

function getCaller() {
    var stack = getStack();

    // Remove superfluous function calls on stack
    stack.shift(); // getCaller --> getStack
    stack.shift(); // omfg --> getCaller

    // Return caller's caller
    return stack[1].receiver;
}

function getStack() {
    // Save original Error.prepareStackTrace
    var origPrepareStackTrace = Error.prepareStackTrace;

    // Override with function that just returns `stack`
    Error.prepareStackTrace = function (_, stack) {
        return stack
    };

    // Create a new `Error`, which automatically gets `stack`
    var err = new Error();

    // Evaluate `err.stack`, which calls our new `Error.prepareStackTrace`
    var stack = err.stack;

    // Restore original `Error.prepareStackTrace`
    Error.prepareStackTrace = origPrepareStackTrace;

    // Remove superfluous function call on stack
    stack.shift(); // getStack --> Error

    return stack;
}
