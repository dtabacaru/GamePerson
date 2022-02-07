// Helpers
// Z0H-
function ADD_R(R, RR, val2) {
    let val1 = Read8BitReg(R, RR);
    let result = val1 + val2;
    Write8BitReg(R, RR, result);
    SetZeroFlag(result);
    SetSubtractionFlag(val2);
    SetHalfCarryFlagBit3To4(val1, val2);
}
// Instructions
// ----
function LD_RR_nn(RR) {
    Write16BitReg(RR, ReadAndIncrementPC16Bit());
}
// ----
function LD_R_n(R, RR) {
    Write8BitReg(R, RR, ReadAndIncrementPC8Bit());
}
// ----
function LD__RR__R(R, RR) {
    WriteAddress(Get16BitRegVal(RR), R);
}
// ----
function LD__nn__SP() {
    WriteAddress(ReadAndIncrementPC16Bit(), Read16BitReg(SP));
}
// ----
function LD_A__RR_(RR) {
    Write8BitReg(A, AF, ReadAddress(Read16BitReg(RR)));
}
// ----
function INC_RR(RR) {
    Write16BitReg(RR, Read16BitReg(RR) + 1);
}
// ----
function DEC_RR(RR) {
    Write16BitReg(RR, Read16BitReg(RR) - 1);
}
// Z0H-
function INC_R(R, RR) {
    ADD_R(R, RR, 1);
}
// Z1H-
function DEC_R(R, RR) {
    ADD_R(R, RR, -1);
}
// -0HC
function ADD_HL_RR(RR) {
    let result = Read16BitReg(HL) + Read16BitReg(RR);
    Write16BitReg(HL, result);
    ResetFlag(F_N);
    SetHalfCarryFlagBit11To12();
    SetCarryFlag16Bit(result);
}

// Opcodes
// NOP
function Execute0x00() {
    // Do nothing
}
// LD BC, d16
function Execute0x01() {
    LD_RR_nn(BC);
}
// LD (BC), A
function Execute0x02() {
    LD__RR__R(BC, A);
}
// INC BC
function Execute0x03() {
    INC_RR(BC);
}
// INC B
function Execute0x04() {
    INC_R(B, BC);
}
// DEC B
function Execute0x05() {
    DEC_R(B, BC);
}
// LD B, d8
function Execute0x06() {
    LD_R_n(B, BC);
}
// RLCA
function Execute0x07() {
    // TODO
}
// LD (a16), SP
function Execute0x08() {
    LD__nn__SP();
}
// ADD HL, BC
function Execute0x09() {
    ADD_HL_RR(BC);
}
// LD A, (BC)
function Execute0x0A() {
    LD_A__RR_(BC);
}
// DEC BC
function Execute0x0B() {
    DEC_RR(BC);
}
// INC C
function Execute0x0C() {
    INC_R(C, BC);
}
// DEC C
function Execute0x0D() {
    DEC_R(C, BC);
}
// LD C, d8
function Execute0x0E() {
    LD_R_n(C, BC);
}
// RRCA
function Execute0x0F() {
    // TODO
}

function Execute0x10() {

}

function Execute0x11() {

}

function Execute0x12() {

}

function Execute0x13() {

}

function Execute0x14() {

}

function Execute0x15() {

}

function Execute0x16() {

}

function Execute0x17() {

}

function Execute0x18() {

}

function Execute0x19() {

}

function Execute0x1A() {

}

function Execute0x1B() {

}

function Execute0x1C() {

}

function Execute0x1D() {

}

function Execute0x1E() {

}

function Execute0x1F() {

}

function Execute0x20() {

}

function Execute0x21() {

}

function Execute0x22() {

}

function Execute0x23() {

}

function Execute0x24() {

}

function Execute0x25() {

}

function Execute0x26() {

}

function Execute0x27() {

}

function Execute0x28() {

}

function Execute0x29() {

}

function Execute0x2A() {

}

function Execute0x2B() {

}

function Execute0x2C() {

}

function Execute0x2D() {

}

function Execute0x2E() {

}

function Execute0x2F() {

}

function Execute0x30() {

}

function Execute0x31() {

}

function Execute0x32() {

}

function Execute0x33() {

}

function Execute0x34() {

}

function Execute0x35() {

}

function Execute0x36() {

}

function Execute0x37() {

}

function Execute0x38() {

}

function Execute0x39() {

}

function Execute0x3A() {

}

function Execute0x3B() {

}

function Execute0x3C() {

}

function Execute0x3D() {

}

function Execute0x3E() {

}

function Execute0x3F() {

}

function Execute0x40() {

}

function Execute0x41() {

}

function Execute0x42() {

}

function Execute0x43() {

}

function Execute0x44() {

}

function Execute0x45() {

}

function Execute0x46() {

}

function Execute0x47() {

}

function Execute0x48() {

}

function Execute0x49() {

}

function Execute0x4A() {

}

function Execute0x4B() {

}

function Execute0x4C() {

}

function Execute0x4D() {

}

function Execute0x4E() {

}

function Execute0x4F() {

}

function Execute0x50() {

}

function Execute0x51() {

}

function Execute0x52() {

}

function Execute0x53() {

}

function Execute0x54() {

}

function Execute0x55() {

}

function Execute0x56() {

}

function Execute0x57() {

}

function Execute0x58() {

}

function Execute0x59() {

}

function Execute0x5A() {

}

function Execute0x5B() {

}

function Execute0x5C() {

}

function Execute0x5D() {

}

function Execute0x5E() {

}

function Execute0x5F() {

}

function Execute0x60() {

}

function Execute0x61() {

}

function Execute0x62() {

}

function Execute0x63() {

}

function Execute0x64() {

}

function Execute0x65() {

}

function Execute0x66() {

}

function Execute0x67() {

}

function Execute0x68() {

}

function Execute0x69() {

}

function Execute0x6A() {

}

function Execute0x6B() {

}

function Execute0x6C() {

}

function Execute0x6D() {

}

function Execute0x6E() {

}

function Execute0x6F() {

}

function Execute0x70() {

}

function Execute0x71() {

}

function Execute0x72() {

}

function Execute0x73() {

}

function Execute0x74() {

}

function Execute0x75() {

}

function Execute0x76() {

}

function Execute0x77() {

}

function Execute0x78() {

}

function Execute0x79() {

}

function Execute0x7A() {

}

function Execute0x7B() {

}

function Execute0x7C() {

}

function Execute0x7D() {

}

function Execute0x7E() {

}

function Execute0x7F() {

}

function Execute0x80() {

}

function Execute0x81() {

}

function Execute0x82() {

}

function Execute0x83() {

}

function Execute0x84() {

}

function Execute0x85() {

}

function Execute0x86() {

}

function Execute0x87() {

}

function Execute0x88() {

}

function Execute0x89() {

}

function Execute0x8A() {

}

function Execute0x8B() {

}

function Execute0x8C() {

}

function Execute0x8D() {

}

function Execute0x8E() {

}

function Execute0x8F() {

}

function Execute0x90() {

}

function Execute0x91() {

}

function Execute0x92() {

}

function Execute0x93() {

}

function Execute0x94() {

}

function Execute0x95() {

}

function Execute0x96() {

}

function Execute0x97() {

}

function Execute0x98() {

}

function Execute0x99() {

}

function Execute0x9A() {

}

function Execute0x9B() {

}

function Execute0x9C() {

}

function Execute0x9D() {

}

function Execute0x9E() {

}

function Execute0x9F() {

}

function Execute0xA0() {

}

function Execute0xA1() {

}

function Execute0xA2() {

}

function Execute0xA3() {

}

function Execute0xA4() {

}

function Execute0xA5() {

}

function Execute0xA6() {

}

function Execute0xA7() {

}

function Execute0xA8() {

}

function Execute0xA9() {

}

function Execute0xAA() {

}

function Execute0xAB() {

}

function Execute0xAC() {

}

function Execute0xAD() {

}

function Execute0xAE() {

}

function Execute0xAF() {

}

function Execute0xB0() {

}

function Execute0xB1() {

}

function Execute0xB2() {

}

function Execute0xB3() {

}

function Execute0xB4() {

}

function Execute0xB5() {

}

function Execute0xB6() {

}

function Execute0xB7() {

}

function Execute0xB8() {

}

function Execute0xB9() {

}

function Execute0xBA() {

}

function Execute0xBB() {

}

function Execute0xBC() {

}

function Execute0xBD() {

}

function Execute0xBE() {

}

function Execute0xBF() {

}

function Execute0xC0() {

}

function Execute0xC1() {

}

function Execute0xC2() {

}

function Execute0xC3() {

}

function Execute0xC4() {

}

function Execute0xC5() {

}

function Execute0xC6() {

}

function Execute0xC7() {

}

function Execute0xC8() {

}

function Execute0xC9() {

}

function Execute0xCA() {

}

function Execute0xCB() {

}

function Execute0xCC() {

}

function Execute0xCD() {

}

function Execute0xCE() {

}

function Execute0xCF() {

}

function Execute0xD0() {

}

function Execute0xD1() {

}

function Execute0xD2() {

}

function Execute0xD3() {

}

function Execute0xD4() {

}

function Execute0xD5() {

}

function Execute0xD6() {

}

function Execute0xD7() {

}

function Execute0xD8() {

}

function Execute0xD9() {

}

function Execute0xDA() {

}

function Execute0xDB() {

}

function Execute0xDC() {

}

function Execute0xDD() {

}

function Execute0xDE() {

}

function Execute0xDF() {

}

function Execute0xE0() {

}

function Execute0xE1() {

}

function Execute0xE2() {

}

function Execute0xE3() {

}

function Execute0xE4() {

}

function Execute0xE5() {

}

function Execute0xE6() {

}

function Execute0xE7() {

}

function Execute0xE8() {

}

function Execute0xE9() {

}

function Execute0xEA() {

}

function Execute0xEB() {

}

function Execute0xEC() {

}

function Execute0xED() {

}

function Execute0xEE() {

}

function Execute0xEF() {

}

function Execute0xF0() {

}

function Execute0xF1() {

}

function Execute0xF2() {

}

function Execute0xF3() {

}

function Execute0xF4() {

}

function Execute0xF5() {

}

function Execute0xF6() {

}

function Execute0xF7() {

}

function Execute0xF8() {

}

function Execute0xF9() {

}

function Execute0xFA() {

}

function Execute0xFB() {

}

function Execute0xFC() {

}

function Execute0xFD() {

}

function Execute0xFE() {

}

function Execute0xFF() {

}
