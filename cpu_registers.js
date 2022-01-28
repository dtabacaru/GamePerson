var StackPointer   = 0;
var ProgramCounter = 0x0100;  // ROM application starts at 0x0100

var RegisterAF = 0; // A = Accumulator; F = Flag; A = High, F = Low
var RegisterBC = 0; // Gen storage; B = High, C = Low
var RegisterDE = 0; // Gen storage; D = High, E = Low
var RegisterHL = 0; // Gen storage / memory pointer; H = High, L = Low

/*** AF ***/

function ReadRegisterA() {
    return (RegisterAF & 0xFF00) >> 8;
}

function ReadRegisterF() {
    return RegisterAF & 0x00FF;
}

function WriteRegisterA(val) {
    RegisterAF = (val << 8) | (RegisterAF & 0x00FF)
}

function WriteRegisterF(val) {
    RegisterAF = (RegisterAF & 0xFF00) | val;
}

/*** BC ***/

function ReadRegisterB() {
    return (RegisterBC & 0xFF00) >> 8;
}

function ReadRegisterC() {
    return RegisterBC & 0x00FF;
}

function WriteRegisterB(val) {
    RegisterBC = (val << 8) | (RegisterBC & 0x00FF)
}

function WriteRegisterC(val) {
    RegisterBC = (RegisterBC & 0xFF00) | val;
}

/*** DE ***/

function ReadRegisterD() {
    return (RegisterDE & 0xFF00) >> 8;
}

function ReadRegisterE() {
    return RegisterDE & 0x00FF;
}

function WriteRegisterD(val) {
    RegisterDE = (val << 8) | (RegisterDE & 0x00FF)
}

function WriteRegisterE(val) {
    RegisterDE = (RegisterDE & 0xFF00) | val;
}

/*** HL ***/

function ReadRegisterH() {
    return (RegisterHL & 0xFF00) >> 8;
}

function ReadRegisterL() {
    return RegisterHL & 0x00FF;
}

function WriteRegisterH(val) {
    RegisterHL = (val << 8) | (RegisterHL & 0x00FF)
}

function WriteRegisterL(val) {
    RegisterHL = (RegisterHL & 0xFF00) | val;
}
