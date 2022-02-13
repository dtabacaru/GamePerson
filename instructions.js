// Instructions
// Flags: Z N H -
function ADD_R(R, RR, val2, carry = false) {
    let val1 = Read8BitReg(R, RR);
    let result = val1 + val2;
    Write8BitReg(R, RR, result);
    SetZeroFlag(result);
    SetSubtractionFlag(val2);
    SetHalfCarryFlagBit3To4(val1, val2);
    if (carry) SetCarryFlag8Bit(result);
}
// Flags: Z N H -
function ADD__RR_(RR, val2) {
    let val1 = ReadAddress(Read16BitReg(RR));
    let result = val1 + val2;
    WriteAddress(Read16BitReg(RR), result);
    SetZeroFlag(result);
    SetSubtractionFlag(val2);
    SetHalfCarryFlagBit3To4(val1, val2);
}
// Flags: Z 0 1 0
function AND_A_R(R, RR) {
    let result = Read8BitReg(A, AF) & Read8BitReg(R, RR);
    Write8BitReg(A, AF, result);
    SetZeroFlag(result);
    ResetFlag(F_N);
    SetFlag(F_H);
    ResetFlag(F_C);
}
// Flags: Z 0 1 0
function AND_A__HL_() {
    let result = Read8BitReg(A, AF) & ReadAddress(Read16BitReg(HL));
    Write8BitReg(A, AF, result);
    SetZeroFlag(result);
    ResetFlag(F_N);
    SetFlag(F_H);
    ResetFlag(F_C);
}
// Flags: Z 0 0 0
function OR_A_R(R, RR) {
    let result = Read8BitReg(A, AF) | Read8BitReg(R, RR);
    Write8BitReg(A, AF, result);
    SetZeroFlag(result);
    ResetFlag(F_N);
    ResetFlag(F_H);
    ResetFlag(F_C);
}
// Flags: Z 0 0 0
function OR_A__HL_() {
    let result = Read8BitReg(A, AF) | ReadAddress(Read16BitReg(HL));
    Write8BitReg(A, AF, result);
    SetZeroFlag(result);
    ResetFlag(F_N);
    ResetFlag(F_H);
    ResetFlag(F_C);
}
// Flags: Z 0 0 0
function XOR_A_R(R, RR) {
    let result = Read8BitReg(A, AF) ^ Read8BitReg(R, RR);
    Write8BitReg(A, AF, result);
    SetZeroFlag(result);
    ResetFlag(F_N);
    ResetFlag(F_H);
    ResetFlag(F_C);
}
// Flags: Z 0 0 0
function XOR_A__HL_() {
    let result = Read8BitReg(A, AF) ^ ReadAddress(Read16BitReg(HL));
    Write8BitReg(A, AF, result);
    SetZeroFlag(result);
    ResetFlag(F_N);
    ResetFlag(F_H);
    ResetFlag(F_C);
}
// Flags: Z 1 H C
function CP_A_R(R, RR) {
    let val1 = Read8BitReg(A, AF);
    let val2 = -Read8BitReg(R, RR);
    let result = val1 + val2;
    SetZeroFlag(result);
    SetFlag(F_N);
    SetHalfCarryFlagBit3To4(val1, val2);
    SetCarryFlag8Bit(result);
}
// Flags: Z 1 H C
function CP_A__HL_() {
    let val1 = Read8BitReg(A, AF);
    let val2 = -ReadAddress(Read16BitReg(HL));
    let result = val1 + val2;
    SetZeroFlag(result);
    SetFlag(F_N);
    SetHalfCarryFlagBit3To4(val1, val2);
    SetCarryFlag8Bit(result);
}
// Flags: Z 0 H C
function ADC_A_R(R, RR) {
    ADD_R(A, AF, Read8BitReg(A, AF) + Read8BitReg(R, RR) + ReadFlag(F_C), true);
}
// Flags: Z 1 H C
function SBC_A_R(R, RR) {
    ADD_R(A, AF, Read8BitReg(A, AF) - Read8BitReg(R, RR) - ReadFlag(F_C), true);
}
// Flags: Z 0 H C
function ADD_A_R(R, RR) {
    ADD_R(A, AF, Read8BitReg(R, RR), true);
}
// Flags: Z 1 H C
function SUB_A_R(R, RR) {
    ADD_R(A, AF, -Read8BitReg(R, RR), true);
}
// Flags: - - - -
function LD_RR_nn(RR) {
    Write16BitReg(RR, ReadAndIncrementPC16Bit());
}
// Flags: - - - -
function LD_R_n(R, RR) {
    Write8BitReg(R, RR, ReadAndIncrementPC8Bit());
}
// Flags: - - - -
function LD_R_R(RI, RRI, RF, RRF) {
    Write8BitReg(RI, RRI, Read8BitReg(RF, RRF));
}
// Flags: - - - -
function LD_R__HL_(R, RR) {
    Write8BitReg(R, RR, ReadAddress(Read16BitReg(HL)));
}
// Flags: - - - -
function LD__RR__A(RR) {
    WriteAddress(Get16BitRegVal(RR), Read8BitReg(A,AF));
}
// Flags: - - - -
function LD__nn__SP() {
    WriteAddress(ReadAndIncrementPC16Bit(), Read16BitReg(SP));
}
// Flags: - - - -
function LD_A__RR_(RR) {
    Write8BitReg(A, AF, ReadAddress(Read16BitReg(RR)));
}
// Flags: - - - -
function LD__HL__n() {
    WriteAddress(Read16BitReg(HL), ReadAndIncrementPC8Bit());
}
// Flags: - - - -
function LD__HL__R(R, RR) {
    WriteAddress(Read16BitReg(HL), Read8BitReg(R, RR));
}
// Flags: - - - -
function INC_RR(RR) {
    Write16BitReg(RR, Read16BitReg(RR) + 1);
}
// Flags: - - - -
function DEC_RR(RR) {
    Write16BitReg(RR, Read16BitReg(RR) - 1);
}
// Flags: Z 0 H -
function INC_R(R, RR) {
    ADD_R(R, RR, 1);
}
// Flags: Z 1 H -
function DEC_R(R, RR) {
    ADD_R(R, RR, -1);
}
// Flags: - 0 H C
function ADD_HL_RR(RR) {
    let result = Read16BitReg(HL) + Read16BitReg(RR);
    Write16BitReg(HL, result);
    ResetFlag(F_N);
    SetHalfCarryFlagBit11To12();
    SetCarryFlag16Bit(result);
}
// ----
function JR(steps) {
    Write16BitReg(PC, Read16BitReg(PC) + steps);
}

// Opcodes
// NOP
// Flags: - - - -
function Execute0x00() {
    // Do nothing
}
// LD BC, d16
// Flags: - - - -
function Execute0x01() {
    LD_RR_nn(BC);
}
// LD (BC), A
// Flags: - - - -
function Execute0x02() {
    LD__RR__A(BC);
}
// INC BC
// Flags: - - - -
function Execute0x03() {
    INC_RR(BC);
}
// INC B
// Flags: Z 0 H -
function Execute0x04() {
    INC_R(B, BC);
}
// DEC B
// Flags: Z 1 H -
function Execute0x05() {
    DEC_R(B, BC);
}
// LD B, d8
// Flags: - - - -
function Execute0x06() {
    LD_R_n(B, BC);
}
// RLCA
// Flags: - - - A7
function Execute0x07() {
    // TODO
}
// LD (a16), SP
// Flags: - - - -
function Execute0x08() {
    LD__nn__SP();
}
// ADD HL, BC
// Flags: - 0 H C
function Execute0x09() {
    ADD_HL_RR(BC);
}
// LD A, (BC)
// Flags: - - - -
function Execute0x0A() {
    LD_A__RR_(BC);
}
// DEC BC
// Flags: - - - -
function Execute0x0B() {
    DEC_RR(BC);
}
// INC C
// Flags: Z 0 H -
function Execute0x0C() {
    INC_R(C, BC);
}
// DEC C
// Flags: Z 1 H -
function Execute0x0D() {
    DEC_R(C, BC);
}
// LD C, d8
// Flags: - - - -
function Execute0x0E() {
    LD_R_n(C, BC);
}
// RRCA
// Flags: 0 0 0 A0
function Execute0x0F() {
    // TODO
}
// STOP
// Flags: - - - -
function Execute0x10() {
    // TODO
}
// LD DE, d16
// Flags: - - - -
function Execute0x11() {
    LD_RR_nn(DE);
}
// LD (DE), A
// Flags: - - - -
function Execute0x12() {
    LD__RR__A(DE);
}
// INC DE
// Flags: - - - -
function Execute0x13() {
    INC_RR(DE);
}
// INC D
// Flags: Z 0 H -
function Execute0x14() {
    INC_R(D, DE);
}
// DEC D
// Flags: Z 1 H -
function Execute0x15() {
    DEC_R(D, DE);
}
// LD D, d8
// Flags: - - - -
function Execute0x16() {
    LD_R_n(D, DE);
}
// RLA
// Flags: 0 0 0 A7
function Execute0x17() {
    // TODO
}
// JR S8
// Flags: - - - -
function Execute0x18() {
    JR(ReadAndIncrementPC8BitSigned());
}
// ADD HL, DE
// Flags: - 0 H C
function Execute0x19() {
    ADD_HL_RR(DE);
}
// LD A, (DE)
// Flags: - - - -
function Execute0x1A() {
    LD_A__RR_(DE);
}
// DEC DE
// Flags: - - - -
function Execute0x1B() {
    DEC_RR(DE);
}
// INC E
// Flags: Z 0 H -
function Execute0x1C() {
    INC_R(E, DE);
}
// DEC E
// Flags: Z 1 H -
function Execute0x1D() {
    DEC_R(E, DE);
}
// LD E, d8
// Flags:  - - - - 
function Execute0x1E() {
    LD_R_n(E, DE);
}
// RRA
// Flags: 0 0 0 A0
function Execute0x1F() {
    // TODO
}
// JR NZ, s8
// Flags:  - - - - 
function Execute0x20() {
    let steps = ReadAndIncrementPC8BitSigned();
    if (!ReadFlag(F_Z)) JR(steps);
}
// LD HL, d16
// Flags:  - - - - 
function Execute0x21() {
    LD_RR_nn(HL);
}
// LD (HL+), A
// Flags:  - - - - 
function Execute0x22() {
    LD__RR__A(HL);
    INC_RR(HL);
}
// INC HL
// Flags:  - - - - 
function Execute0x23() {
    INC_RR(HL);
}
// INC H
// Flags:  Z 0 H -
function Execute0x24() {
    INC_R(H, HL);
}
// DEC H
// Flags:  Z 1 H -
function Execute0x25() {
    DEC_R(H, HL);
}
// LD H, d8
// Flags:  - - - - 
function Execute0x26() {
    LD_R_n(H, HL);
}
// DAA
// Flags:  Z - 0 C
function Execute0x27() {
    // TODO
}
// JR Z, s8
// Flags:  - - - - 
function Execute0x28() {
    let steps = ReadAndIncrementPC8BitSigned();
    if (ReadFlag(F_Z)) JR(steps);
}
// ADD HL, HL
// Flags:  - 0 H C
function Execute0x29() {
    ADD_HL_RR(HL);
}
// LD A, (HL+)
// Flags:  - - - - 
function Execute0x2A() {
    LD_A__RR_(HL);
    INC_RR(HL);
}
// DEC HL
// Flags:  - - - - 
function Execute0x2B() {
    DEC_RR(HL);
}
// INC L
// Flags:  Z 0 H -
function Execute0x2C() {
    INC_R(L, HL);
}
// DEC L
// Flags:  Z 1 H -
function Execute0x2D() {
    DEC_R(L, HL);
}
// LD L, d8
// Flags:  - - - - 
function Execute0x2E() {
    LD_R_n(L, HL);
}
// CPL
// Flags:  - 1 1 -
function Execute0x2F() {
    Write8BitReg(~Read8BitReg(A, AF));
    SetFlag(F_N);
    SetFlag(F_H);
}
// JR NC, s8
// Flags:  - - - - 
function Execute0x30() {
    let steps = ReadAndIncrementPC8BitSigned();
    if (!ReadFlag(F_C)) JR(steps);
}
// LD SP, d16
// Flags:  - - - - 
function Execute0x31() {
    LD_RR_nn(SP);
}
// LD (HL-), A
// Flags:  - - - - 
function Execute0x32() {
    LD__RR__A(HL);
    DEC_RR(HL);
}
// INC SP
// Flags:  - - - - 
function Execute0x33() {
    INC_RR(SP);
}
// INC (HL)
// Flags:  Z 0 H -
function Execute0x34() {
    ADD__RR_(HL, 1);
}
// DEC (HL)
// Flags:  Z 1 H -
function Execute0x35() {
    ADD__RR_(HL, -1);
}
// LD(HL), d8
// Flags:  - - - -
function Execute0x36() {
    LD__HL__n();
}
// SCF
// Flags:  - 0 0 1
function Execute0x37() {
    SetFlag(F_C);
    ResetFlag(F_N);
    ResetFlag(F_H);
}
// JR C, s8
// Flags:  - - - -
function Execute0x38() {
    let steps = ReadAndIncrementPC8BitSigned();
    if(ReadFlag(F_C)) JR(steps);
}
// ADD HL, SP
// Flags:  - 0 H C
function Execute0x39() {
    ADD_HL_RR(SP);
}
// LD A, (HL-)
// Flags:  - - - -
function Execute0x3A() {
    LD_A__RR_(HL);
    DEC_RR(HL);
}
// DEC SP
// Flags:  - - - -
function Execute0x3B() {
    DEC_RR(SP);
}
// INC A
// Flags:  Z 0 H -
function Execute0x3C() {
    INC_R(A, AF);
}
// DEC A
// Flags:  Z 1 H -
function Execute0x3D() {
    DEC_R(A, AF);
}
// LD A, d8
// Flags:  - - - -
function Execute0x3E() {
    LD_R_n(A, AF);
}
// CCF
// Flags:  - 0 0 !C
function Execute0x3F() {
    // TODO
}
// LD B, B
// Flags:  - - - -
function Execute0x40() {
    // Do nothing
}
// LD B, C
// Flags:  - - - -
function Execute0x41() {
    LD_R_R(B, BC, C, BC);
}
// LD B, D
// Flags:  - - - -
function Execute0x42() {
    LD_R_R(B, BC, D, DE);
}
// LD B, E
// Flags:  - - - -
function Execute0x43() {
    LD_R_R(B, BC, E, DE);
}
// LD B, H
// Flags:  - - - -
function Execute0x44() {
    LD_R_R(B, BC, H, HL);
}
// LD B, L
// Flags:  - - - -
function Execute0x45() {
    LD_R_R(B, BC, L, HL);
}
// LD B, (HL)
// Flags:  - - - -
function Execute0x46() {
    LD_R__HL_(B, BC);
}
// LD B, A
// Flags:  - - - -
function Execute0x47() {
    LD_R_R(B, BC, A, AF);
}
// LD C, B
// Flags:  - - - -
function Execute0x48() {
    LD_R_R(C, BC, B, BC);
}
// LD C, C
// Flags:  - - - -
function Execute0x49() {
    // Do nothing
}
// LD C, D
// Flags:  - - - -
function Execute0x4A() {
    LD_R_R(C, BC, D, DE);
}
// LD C, E
// Flags:  - - - -
function Execute0x4B() {
    LD_R_R(C, BC, E, DE);
}
// LD C, H
// Flags:  - - - -
function Execute0x4C() {
    LD_R_R(C, BC, H, HL);
}
// LD C, L
// Flags:  - - - -
function Execute0x4D() {
    LD_R_R(C, BC, L, HL);
}
// LD C, (HL)
// Flags:  - - - -
function Execute0x4E() {
    LD_R__HL_(C, BC);
}
// LD C, A
// Flags:  - - - -
function Execute0x4F() {
    LD_R_R(C, BC, A, AF);
}
// LD D, B
// Flags:  - - - -
function Execute0x50() {
    LD_R_R(D, DE, B, BC);
}
// LD D, C
// Flags:  - - - -
function Execute0x51() {
    LD_R_R(D, DE, C, BC);
}
// LD D, D
// Flags:  - - - -
function Execute0x52() {
    // Do nothing
}
// LD D, E
// Flags:  - - - -
function Execute0x53() {
    LD_R_R(D, DE, E, DE);
}
// LD D, H
// Flags:  - - - -
function Execute0x54() {
    LD_R_R(D, DE, H, HL);
}
// LD D, L
// Flags:  - - - -
function Execute0x55() {
    LD_R_R(D, DE, L, HL);
}
// LD D, (HL)
// Flags:  - - - -
function Execute0x56() {
    LD_R__HL_(D, DE);
}
// LD D, A
// Flags:  - - - -
function Execute0x57() {
    LD_R_R(D, DE, A, AF);
}
// LD E, B
// Flags:  - - - -
function Execute0x58() {
    LD_R_R(E, DE, B, BC);
}
// LD E, C
// Flags:  - - - -
function Execute0x59() {
    LD_R_R(E, DE, C, BC);
}
// LD E, D
// Flags:  - - - -
function Execute0x5A() {
    LD_R_R(E, DE, D, DE);
}
// LD E, E
// Flags:  - - - -
function Execute0x5B() {
    // Do nothing
}
// LD E, H
// Flags:  - - - -
function Execute0x5C() {
    LD_R_R(E, DE, H, HL);
}
// LD E, L
// Flags:  - - - -
function Execute0x5D() {
    LD_R_R(E, DE, L, HL);
}
// LD E, (HL)
// Flags:  - - - -
function Execute0x5E() {
    LD_R__HL_(E, DE);
}
// LD E, A
// Flags:  - - - -
function Execute0x5F() {
    LD_R_R(E, DE, A, AF);
}
// LD H, B
// Flags:  - - - -
function Execute0x60() {
    LD_R_R(H, HL, B, BC);
}
// LD H, C
// Flags:  - - - -
function Execute0x61() {
    LD_R_R(H, HL, C, BC);
}
// LD H, D
// Flags:  - - - -
function Execute0x62() {
    LD_R_R(H, HL, D, DE);
}
// LD H, E
// Flags:  - - - -
function Execute0x63() {
    LD_R_R(H, HL, E, DE);
}
// LD H, H
// Flags:  - - - -
function Execute0x64() {
    // Do nothing
}
// LD H, L
// Flags:  - - - -
function Execute0x65() {
    LD_R_R(H, HL, L, HL);
}
// LD H, (HL)
// Flags:  - - - -
function Execute0x66() {
    LD_R__HL_(H, HL);
}
// LD H, A
// Flags:  - - - -
function Execute0x67() {
    LD_R_R(H, HL, A, AF);
}
// LD L, B
// Flags:  - - - -
function Execute0x68() {
    LD_R_R(L, HL, B, BC);
}
// LD L, C
// Flags:  - - - -
function Execute0x69() {
    LD_R_R(L, HL, C, BC);
}
// LD L, D
// Flags:  - - - -
function Execute0x6A() {
    LD_R_R(L, HL, D, DE);
}
// LD L, E
// Flags:  - - - -
function Execute0x6B() {
    LD_R_R(L, HL, E, DE);
}
// LD L, H
// Flags:  - - - -
function Execute0x6C() {
    LD_R_R(L, HL, H, HL);
}
// LD L, L
// Flags:  - - - -
function Execute0x6D() {
    // Do nothing
}
// LD L, (HL)
// Flags:  - - - -
function Execute0x6E() {
    LD_R__HL_(L, HL);
}
// LD L, A
// Flags:  - - - -
function Execute0x6F() {
    LD_R_R(L, HL, A, AF);
}
// LD (HL), B
// Flags:  - - - -
function Execute0x70() {
    LD__HL__R(B, BC);
}
// LD (HL), C
// Flags:  - - - -
function Execute0x71() {
    LD__HL__R(C, BC);
}
// LD (HL), D
// Flags:  - - - -
function Execute0x72() {
    LD__HL__R(D, DE);
}
// LD (HL), E
// Flags:  - - - -
function Execute0x73() {
    LD__HL__R(E, DE);
}
// LD (HL), H
// Flags:  - - - -
function Execute0x74() {
    LD__HL__R(H, HL);
}
// LD (HL), L
// Flags:  - - - -
function Execute0x75() {
    LD__HL__R(L, HL);
}
// HALT
// Flags:  - - - -
function Execute0x76() {
    // TODO
}
// LD (HL), A
// Flags:  - - - -
function Execute0x77() {
    LD__HL__R(A, AF);
}
// LD A, B
// Flags:  - - - -
function Execute0x78() {
    LD_R_R(A, AF, B, BC);
}
// LD A, C
// Flags:  - - - -
function Execute0x79() {
    LD_R_R(A, AF, C, BC);
}
// LD A, D
// Flags:  - - - -
function Execute0x7A() {
    LD_R_R(A, AF, D, DE);
}
// LD A, E
// Flags:  - - - -
function Execute0x7B() {
    LD_R_R(A, AF, E, DE);
}
// LD A, H
// Flags:  - - - -
function Execute0x7C() {
    LD_R_R(A, AF, H, HL);
}
// LD A, L
// Flags:  - - - -
function Execute0x7D() {
    LD_R_R(A, AF, L, HL);
}
// LD A, (HL)
// Flags:  - - - -
function Execute0x7E() {
    LD_R__HL_(A, AF);
}
// LD A, A
// Flags:  - - - -
function Execute0x7F() {
    // Do nothing
}
// ADD A, B
// Flags:  Z 0 H C
function Execute0x80() {
    ADD_R_R(A, AF, B, BC);
}
// ADD A, C
// Flags:  Z 0 H C
function Execute0x81() {
    ADD_A_R(C, BC);
}
// ADD A, D
// Flags:  Z 0 H C
function Execute0x82() {
    ADD_A_R(D, DE);
}
// ADD A, E
// Flags:  Z 0 H C
function Execute0x83() {
    ADD_A_E(E, DE);
}
// ADD A, H
// Flags:  Z 0 H C
function Execute0x84() {
    ADD_A_R(H, HL);
}
// ADD A, L
// Flags:  Z 0 H C
function Execute0x85() {
    ADD_A_R(L, HL);
}
// ADD A, (HL)
// Flags:  Z 0 H C
function Execute0x86() {
    ADD_R(A, AF, ReadAddress(Read16BitReg(HL)), true);
}
// ADD A, A
// Flags:  Z 0 H C
function Execute0x87() {
    ADD_A_R(A, AF);
}
// ADC A, B
// Flags:  Z 0 H C
function Execute0x88() {
    ADC_A_R(B, BC);
}
// ADC A, C
// Flags:  Z 0 H C
function Execute0x89() {
    ADC_A_R(C, BC);
}
// ADC A, D
// Flags:  Z 0 H C
function Execute0x8A() {
    ADC_A_R(D, DE);
}
// ADC A, E
// Flags:  Z 0 H C
function Execute0x8B() {
    ADC_A_R(E, DE);
}
// ADC A, H
// Flags:  Z 0 H C
function Execute0x8C() {
    ADC_A_R(H, HL);
}
// ADC A, L
// Flags:  Z 0 H C
function Execute0x8D() {
    ADC_A_R(L, HL);
}
// ADC A, (HL)
// Flags:  Z 0 H C
function Execute0x8E() {
    ADD_R(A, AF, Read8BitReg(A, AF) + ReadAddress(Read16BitReg(HL)) + ReadFlag(F_C), true);
}
// ADC A, A
// Flags:  Z 0 H C
function Execute0x8F() {
    ADC_A_R(A, AF);
}
// SUB B
// Flags:  Z 1 H C
function Execute0x90() {
    SUB_A_R(B, BC);
}
// SUB C
// Flags:  Z 1 H C
function Execute0x91() {
    SUB_A_R(C, BC);
}
// SUB D
// Flags:  Z 1 H C
function Execute0x92() {
    SUB_A_R(D, DE);
}
// SUB E
// Flags:  Z 1 H C
function Execute0x93() {
    SUB_A_R(E, DE);
}
// SUB H
// Flags:  Z 1 H C
function Execute0x94() {
    SUB_A_R(H, HL);
}
// SUB L
// Flags:  Z 1 H C
function Execute0x95() {
    SUB_A_R(L, HL);
}
// SUB (HL)
// Flags:  Z 1 H C
function Execute0x96() {
    ADD_R(A, AF, -ReadAddress(Read16BitReg(HL)), true);
}
// SUB A
// Flags:  Z 1 H C
function Execute0x97() {
    SUB_A_R(A, AF);
}
// SBC A, B
// Flags:  Z 1 H C
function Execute0x98() {
    SBC_A_R(B, BC);
}
// SBC A, C
// Flags:  Z 1 H C
function Execute0x99() {
    SBC_A_R(C, BC);
}
// SBC A, D
// Flags:  Z 1 H C
function Execute0x9A() {
    SBC_A_R(D, DE);
}
// SBC A, E
// Flags:  Z 1 H C
function Execute0x9B() {
    SBC_A_R(E, DE);
}
// SBC A, H
// Flags:  Z 1 H C
function Execute0x9C() {
    SBC_A_R(H, HL);
}
// SBC A, L
// Flags:  Z 1 H C
function Execute0x9D() {
    SBC_A_R(L, HL);
}
// SBC A, (HL)
// Flags:  Z 1 H C
function Execute0x9E() {
    ADD_R(A, AF, Read8BitReg(A, AF) - ReadAddress(Read16BitReg(HL)) - ReadFlag(F_C), true);
}
// SBC A, A
// Flags:  Z 1 H C
function Execute0x9F() {
    SBC_A_R(A, AF);
}
// AND B
// Flags:  Z 0 1 0
function Execute0xA0() {
    AND_A_R(B, BC);
}
// AND C
// Flags:  Z 0 1 0
function Execute0xA1() {
    AND_A_R(C, BC);
}
// AND D
// Flags:  Z 0 1 0
function Execute0xA2() {
    AND_A_R(D, DE);
}
// AND E
// Flags:  Z 0 1 0
function Execute0xA3() {
    AND_A_R(E, DE);
}
// AND H
// Flags:  Z 0 1 0
function Execute0xA4() {
    AND_A_R(H, HL);
}
// AND L
// Flags:  Z 0 1 0
function Execute0xA5() {
    AND_A_R(L, HL);
}
// AND (HL)
// Flags:  Z 0 1 0
function Execute0xA6() {
    AND_A__HL_();
}
// AND A
// Flags:  Z 0 1 0
function Execute0xA7() {
    AND_A_R(A, AF);
}
// XOR B
// Flags:  Z 0 0 0
function Execute0xA8() {
    XOR_A_R(B, BC);
}
// XOR C
// Flags:  Z 0 0 0
function Execute0xA9() {
    XOR_A_R(C, BC);
}
// XOR D
// Flags:  Z 0 0 0
function Execute0xAA() {
    XOR_A_R(D, DE);
}
// XOR E
// Flags:  Z 0 0 0
function Execute0xAB() {
    XOR_A_R(E, DE);
}
// XOR H
// Flags:  Z 0 0 0
function Execute0xAC() {
    XOR_A_R(H, HL);
}
// XOR L
// Flags:  Z 0 0 0
function Execute0xAD() {
    XOR_A_R(L, HL);
}
// XOR (HL)
// Flags:  Z 0 0 0
function Execute0xAE() {
    XOR_A__HL_();
}
// XOR A
// Flags:  Z 0 0 0
function Execute0xAF() {
    XOR_A_R(A, AF);
}
// OR B
// Flags:  Z 0 0 0
function Execute0xB0() {
    OR_A_R(B, BC);
}
// OR C
// Flags:  Z 0 0 0
function Execute0xB1() {
    OR_A_R(C, BC);
}
// OR D
// Flags:  Z 0 0 0
function Execute0xB2() {
    OR_A_R(D, DE);
}
// OR E
// Flags:  Z 0 0 0
function Execute0xB3() {
    OR_A_R(E, DE);
}
// OR H
// Flags:  Z 0 0 0
function Execute0xB4() {
    OR_A_R(H, HL);
}
// OR L
// Flags:  Z 0 0 0
function Execute0xB5() {
    OR_A_R(L, HL);
}
// OR (HL)
// Flags:  Z 0 0 0
function Execute0xB6() {
    OR_A__HL_();
}
// OR A
// Flags:  Z 0 0 0
function Execute0xB7() {
    OR_A_R(A, AF);
}
// CP B
// Flags:  Z 1 H C
function Execute0xB8() {
    CP_A_R(B, BC);
}
// CP C
// Flags:  Z 1 H C
function Execute0xB9() {
    CP_A_R(C, BC);
}
// CP D
// Flags:  Z 1 H C
function Execute0xBA() {
    CP_A_R(D, DE);
}
// CP E
// Flags:  Z 1 H C
function Execute0xBB() {
    CP_A_R(E, DE);
}
// CP H
// Flags:  Z 1 H C
function Execute0xBC() {
    CP_A_R(H, HL);
}
// CP L
// Flags:  Z 1 H C
function Execute0xBD() {
    CP_A_R(L, HL);
}
// CP (HL)
// Flags:  Z 1 H C
function Execute0xBE() {
    CP_A__HL_();
}
// CP A
// Flags:  Z 1 H C
function Execute0xBF() {
    CP_A_R(A, AF);
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
