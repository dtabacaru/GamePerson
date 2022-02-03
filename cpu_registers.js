var StackPointer   = 0;
var ProgramCounter = 0x0100;  // ROM application starts at 0x0100

var RegisterAF = 0; // A = Accumulator; F = Flag; A = High, F = Low
var RegisterBC = 0; // Gen storage; B = High, C = Low
var RegisterDE = 0; // Gen storage; D = High, E = Low
var RegisterHL = 0; // Gen storage / memory pointer; H = High, L = Low

/*** SP ***/

function ReadRegisterS() {
    return (StackPointer & 0xFF00) >> 8;
}

function ReadRegisterP() {
    return StackPointer & 0x00FF;
}

function WriteRegisterSP(val) {
    StackPointer = val % 0xFFFF;
}

/*** AF ***/

function ReadZFlag() {
    return ReadRegisterF() & 0b10000000;
}

function SetZFlag() {
    WriteRegisterF(ReadRegisterF() | 0b10000000);
}

function UnsetZFlag() {
    WriteRegisterF(ReadRegisterF() & ~0b10000000);
}

function ReadNFlag() {
    return ReadRegisterF() & 0b01000000;
}

function SetNFlag() {
    WriteRegisterF(ReadRegisterF() |  0b01000000);
}

function UnsetNFlag() {
    WriteRegisterF(ReadRegisterF() & ~0b01000000);
}

function ReadHFlag() {
    return ReadRegisterF() & 0b00100000;
}

function SetHFlag() {
    WriteRegisterF(ReadRegisterF() |  0b00100000);
}

function UnsetHFlag() {
    WriteRegisterF(ReadRegisterF() & ~0b00100000);
}

function ReadCFlag() {
    return ReadRegisterF() & 0b00010000;
}

function SetCFlag() {
    WriteRegisterF(ReadRegisterF() |  0b00010000);
}

function UnsetCFlag() {
    WriteRegisterF(ReadRegisterF() &= ~0b00010000);
}

function ReadRegisterA() {
    return (RegisterAF & 0xFF00) >> 8;
}

function ReadRegisterF() {
    return RegisterAF & 0x00FF;
}

function WriteRegisterA(val) {
    val %= 0xFF;
    RegisterAF = (val << 8) | (RegisterAF & 0x00FF)
}

function WriteRegisterF(val) {
    val %= 0xFF;
    RegisterAF = (RegisterAF & 0xFF00) | val;
}

function WriteRegisterAF(val) {
    RegisterAF = val % 0xFFFF;
}

/*** BC ***/

function ReadRegisterB() {
    return (RegisterBC & 0xFF00) >> 8;
}

function ReadRegisterC() {
    return RegisterBC & 0x00FF;
}

function WriteRegisterB(val) {
    val %= 0xFF;
    RegisterBC = (val << 8) | (RegisterBC & 0x00FF)
}

function WriteRegisterC(val) {
    val %= 0xFF;
    RegisterBC = (RegisterBC & 0xFF00) | val;
}

function WriteRegisterBC(val) {
    RegisterBC = val % 0xFFFF;
}

/*** DE ***/

function ReadRegisterD() {
    return (RegisterDE & 0xFF00) >> 8;
}

function ReadRegisterE() {
    return RegisterDE & 0x00FF;
}

function WriteRegisterD(val) {
    val %= 0xFF;
    RegisterDE = (val << 8) | (RegisterDE & 0x00FF)
}

function WriteRegisterE(val) {
    val %= 0xFF;
    RegisterDE = (RegisterDE & 0xFF00) | val;
}

function WriteRegisterDE(val) {
    RegisterDE = val % 0xFFFF;
}

/*** HL ***/

function ReadRegisterH() {
    return (RegisterHL & 0xFF00) >> 8;
}

function ReadRegisterL() {
    return RegisterHL & 0x00FF;
}

function WriteRegisterH(val) {
    val %= 0xFF;
    RegisterHL = (val << 8) | (RegisterHL & 0x00FF)
}

function WriteRegisterL(val) {
    val %= 0xFF;
    RegisterHL = (RegisterHL & 0xFF00) | val;
}

function WriteRegisterHL(val) {
    RegisterHL = val % 0xFFFF;
}