const doubleQuotationMarkParaphrase = function(str) {
    return str.replace(/\"/g, `\\"`);
}

const doubleQuotationMarkReparaphrase = function(str) {
    return str.replace(/\\"/g, `\"`);
}

module.exports = { doubleQuotationMarkParaphrase, doubleQuotationMarkReparaphrase }
