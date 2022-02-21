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
// Flags: 0 0 H C
function ADD_SP_s(RR) {
    let val1 = Read16BitReg(SP);
    let val2 = ReadAndIncrementPC8BitSigned();
    let result = val1 + val2;
    Write16BitReg(RR, result);
    ResetFlag(F_Z);
    ResetFlag(F_N);
    SetHalfCarryFlagBit11To12(val1, val2); // TODO Check half carry bits
    SetCarryFlag16Bit(result);
}
// Flags: Z 0 1 0
function AND(val) {
    let result = Read8BitReg(HIGH, AF) & val;
    Write8BitReg(HIGH, AF, result);
    SetZeroFlag(result);
    ResetFlag(F_N);
    SetFlag(F_H);
    ResetFlag(F_C);
}
// Flags: Z 0 0 0
function OR(val) {
    let result = Read8BitReg(HIGH, AF) | val;
    Write8BitReg(HIGH, AF, result);
    SetZeroFlag(result);
    ResetFlag(F_N);
    ResetFlag(F_H);
    ResetFlag(F_C);
}
// Flags: Z 0 0 0
function XOR(val) {
    let result = Read8BitReg(HIGH, AF) ^ val;
    Write8BitReg(HIGH, AF, result);
    SetZeroFlag(result);
    ResetFlag(F_N);
    ResetFlag(F_H);
    ResetFlag(F_C);
}
// Flags: Z 1 H C
function CP(val) {
    let val1 = Read8BitReg(HIGH, AF);
    let val2 = -val;
    let result = val1 + val2;
    SetZeroFlag(result);
    SetFlag(F_N);
    SetHalfCarryFlagBit3To4(val1, val2);
    SetCarryFlag8Bit(result);
}
// Flags: Z 0 H C
function ADC(val) {
    ADD_R(HIGH, AF, Read8BitReg(HIGH, AF) + val + ReadFlag(F_C), true);
}
// Flags: Z 1 H C
function SBC(val) {
    ADD_R(HIGH, AF, Read8BitReg(HIGH, AF) - val - ReadFlag(F_C), true);
}
// Flags: Z 0 H C
function ADD(val) {
    ADD_R(HIGH, AF, val, true);
}
// Flags: Z 1 H C
function SUB(val) {
    ADD_R(HIGH, AF, -val, true);
}
// Flags: 0 0 0 A7
function RLCA() {
    let result = ((Read8BitReg(HIGH, AF) << 1) | (Read8BitReg(HIGH, AF) >> 7)) & 0xFF;
    ResetFlag(F_Z);
    ResetFlag(F_N);
    ResetFlag(F_H);
    if (Read8BitReg(HIGH, AF) & 0b10000000) SetFlag(F_C); else ResetFlag(F_C);
    Write8BitReg(HIGH, AF, result);
}
// Flags: 0 0 0 A7
function RLA() {
    let result = ((Read8BitReg(HIGH, AF) << 1) | (ReadFlag(F_C) >> 7)) & 0xFF;
    ResetFlag(F_Z);
    ResetFlag(F_N);
    ResetFlag(F_H);
    if (Read8BitReg(HIGH, AF) & 0b10000000) SetFlag(F_C); else ResetFlag(F_C);
    Write8BitReg(HIGH, AF, result);
}
// Flags: 0 0 0 A0
function RRCA() {
    let result = (Read8BitReg(HIGH, AF) >> 1) | (Read8BitReg(HIGH, AF) << 7);
    ResetFlag(F_Z);
    ResetFlag(F_N);
    ResetFlag(F_H);
    if (Read8BitReg(HIGH, AF) & 0b00000001) SetFlag(F_C); else ResetFlag(F_C);
    Write8BitReg(HIGH, AF, result);
}
// Flags: 0 0 0 A0
function RRA() {
    let result = (Read8BitReg(HIGH, AF) >> 1) | (ReadFlag(F_C) << 7);
    ResetFlag(F_Z);
    ResetFlag(F_N);
    ResetFlag(F_H);
    if (Read8BitReg(HIGH, AF) & 0b00000001) SetFlag(F_C); else ResetFlag(F_C);
    Write8BitReg(HIGH, AF, result);
}
// Flags: Z - 0 C
// https://forums.nesdev.org/viewtopic.php?t=15944#:~:text=The%20DAA%20instruction%20adjusts%20the,%2C%20lower%20nybble%2C%20or%20both.
function DAA() {
    let result = Read8BitReg(HIGH, AF);
    if (!ReadFlag(F_N)) {
        if (ReadFlag(F_C) ||  result         > 0x99) {result += 0x60; SetFlag(F_C); }
        if (ReadFlag(F_H) || (result & 0x0f) > 0x09)  result += 0x06; 
    } else {  
        if (ReadFlag(F_C)) result -= 0x60;
        if (ReadFlag(F_H)) result -= 0x06;
    }
    Write8BitReg(HIGH, AF, result);
    SetZeroFlag(result);
    ResetFlag(F_H);
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
    WriteAddress(Get16BitRegVal(RR), Read8BitReg(HIGH,AF));
}
// Flags: - - - -
function LD__nn__SP() {
    WriteAddress(ReadAndIncrementPC16Bit(), Read16BitReg(SP));
}
// Flags: - - - -
function LD_A__RR_(RR) {
    Write8BitReg(HIGH, AF, ReadAddress(Read16BitReg(RR)));
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
function SET_R(R, RR, b) {
    Write8BitReg(R, RR, Read8BitReg(R, RR) | (1 << b));
}
// Flags: - - - -
function RES_R(R, RR, b) {
    Write8BitReg(R, RR, Read8BitReg(R, RR) & ~(1 << b));
}
// Flags: - - - -
function SET__HL_(b) {
    WriteAddress(Read16BitReg(HL), ReadAddress(Read16BitReg(HL)) | (1 << b));
}
// Flags: - - - -
function RES__HL_(b) {
    WriteAddress(Read16BitReg(HL), ReadAddress(Read16BitReg(HL)) & ~(1 << b));
}
// Flags: !Rb 0 1 -
function BIT_R(R, RR, b) {
    if (!(Read8BitReg(R, RR) & (1 << b))) SetFlag(F_Z); else ResetFlag(F_Z);
    ResetFlag(F_N);
    SetFlag(F_H);
}
// Flags: !(HL)b 0 1 -
function BIT__HL_(b) {
    if (!(ReadAddress(Read16BitReg(HL)) & (1 << b))) SetFlag(F_Z); else ResetFlag(F_Z);
    ResetFlag(F_N);
    SetFlag(F_H);
}
// Flags: Z 0 0 R7
function LS_R(R, RR, val) {
    SetZeroFlag(val);
    ResetFlag(F_N);
    ResetFlag(F_H);
    if (Read8BitReg(R, RR) & 0b10000000) SetFlag(F_C); else ResetFlag(F_C);
    Write8BitReg(R, RR, val);
}
// Flags: Z 0 0 (HL)7
function LS__HL_(val) {
    SetZeroFlag(val);
    ResetFlag(F_N);
    ResetFlag(F_H);
    if (ReadAddress(Read16BitReg(HL)) & 0b10000000) SetFlag(F_C); else ResetFlag(F_C);
    WriteAddress(Read16BitReg(HL), val);
}
// Flags: Z 0 0 R7
function RLC_R(R, RR) {
    let result = ((Read8BitReg(R, RR) << 1) | (Read8BitReg(R, RR) >> 7)) & 0xFF;
    LS_R(R, RR, result);
}
// Flags: Z 0 0 R7
function RLC__HL_() {
    let result = ((ReadAddress(Read16BitReg(HL)) << 1) | (ReadAddress(Read16BitReg(HL)) >> 7)) & 0xFF;
    LS__HL_(result);
}
// Flags: Z 0 0 R7
function RL_R(R, RR) {
    let result = ((Read8BitReg(R, RR) << 1) | ReadFlag(F_C)) & 0xFF;
    LS_R(R, RR, result);
}
// Flags: Z 0 0 R7
function RL__HL_() {
    let result = ((ReadAddress(Read16BitReg(HL)) << 1) | ReadFlag(F_C)) & 0xFF;
    LS__HL_(result);
}
// Flags: Z 0 0 R7
function SLA_R(R, RR) {
    let result = (Read8BitReg(R, RR) << 1) & 0xFF;
    LS_R(R, RR, result);
}
// Flags: Z 0 0 (HL)7
function SLA__HL_() {
    let result = (ReadAddress(Read16BitReg(HL)) << 1) & 0xFF;
    LS__HL_(result);
}
// Flags: Z 0 0 R0
function RS_R(R, RR, val) {
    SetZeroFlag(val);
    ResetFlag(F_N);
    ResetFlag(F_H);
    if (Read8BitReg(R, RR) & 0b00000001) SetFlag(F_C); else ResetFlag(F_C);
    Write8BitReg(R, RR, val);
}
// Flags: Z 0 0 (HL)7
function RS__HL_(val) {
    SetZeroFlag(val);
    ResetFlag(F_N);
    ResetFlag(F_H);
    if (ReadAddress(Read16BitReg(HL)) & 0b00000001) SetFlag(F_C); else ResetFlag(F_C);
    WriteAddress(Read16BitReg(HL), val);
}
// Flags: Z 0 0 R0
function RRC_R(R, RR) {
    let result = (Read8BitReg(R, RR) >> 1) | (Read8BitReg(R, RR) << 7);
    RS_R(R, RR, result);
}
// Flags: Z 0 0 R0
function RRC__HL_() {
    let result = (ReadAddress(Read16BitReg(HL)) >> 1) | (ReadAddress(Read16BitReg(HL)) << 7);
    RS__HL_(result);
}
// Flags: Z 0 0 R0
function RR_R(R, RR) {
    let result = (Read8BitReg(R, RR) >> 1) | (ReadFlag(F_C) << 7);
    RS_R(R, RR, result);
}
// Flags: Z 0 0 R0
function RR__HL_() {
    let result = (ReadAddress(Read16BitReg(HL)) >> 1) | (ReadFlag(F_C) << 7);
    RS__HL_(result);
}
// Flags: Z 0 0 R0
function SRA_R(R, RR) {
    let result = (Read8BitReg(R, RR) >> 1) | (Read8BitReg(R, RR) & 0b10000000);
    RS_R(R, RR, result);
}
// Flags: Z 0 0 R0
function SRA__HL_() {
    let result = (ReadAddress(Read16BitReg(HL)) >> 1) | (ReadAddress(Read16BitReg(HL)) << 7);
    RS__HL_(result);
}
// Flags: Z 0 0 R0
function SRL_R(R, RR) {
    let result = (Read8BitReg(R, RR) >> 1);
    RS_R(R, RR, result);
}
// Flags: Z 0 0 (HL)0
function SRL__HL_() {
    let result = (ReadAddress(Read16BitReg(HL)) >> 1);
    RS__HL_(result);
}
// Flags: Z 0 0 0
function SWAP_R(R, RR) {
    let result = (Read8BitReg(R, RR) & 0xFF00 >> 4) | (Read8BitReg(R, RR) & 0x00FF << 4);
    Write8BitReg(R, RR, result);
    SetZeroFlag(result);
    ResetFlag(F_N);
    ResetFlag(F_H);
    ResetFlag(F_C);
}
// Flags: Z 0 0 0
function SWAP__HL_() {
    let result = (ReadAddress(Read16BitReg(HL)) >> 4) | (ReadAddress(Read16BitReg(HL)) & 0x00FF << 4);
    WriteAddress(Read16BitReg(HL), result);
    SetZeroFlag(result);
    ResetFlag(F_N);
    ResetFlag(F_H);
    ResetFlag(F_C);
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
// Flags: - 0 0 !C
function CCF() {
    ResetFlag(F_N);
    ResetFlag(F_H);
    if (ReadFlag(F_C)) ResetFlag(F_C); else SetFlag(F_C);
}
// Flags: - - - -
function JR(steps) {
    Write16BitReg(PC, Read16BitReg(PC) + steps);
}
// Flags: - - - -
function JP(addr) {
    Write16BitReg(PC, addr);
}
// Flags: - - - -
function CALL(addr) {
    Write16BitReg(SP, Read16BitReg(SP) - 2);
    WriteAddress(Read16BitReg(SP),     Read8BitReg(HIGH, PC));
    WriteAddress(Read16BitReg(SP) + 1, Read8BitReg(LOW, PC));
    Write16BitReg(PC, addr);
}
// Flags: - - - -
function RET() {
    let high = ReadAddress(Read16BitReg(SP));
    let low = ReadAddress(Read16BitReg(SP + 1));
    Write16BitReg(PC, (high << 8) + low);
    Write16BitReg(SP, Read16BitReg(SP) + 2);
}
// Flags: - - - -
function PUSH_RR(RR) {
    Write16BitReg(SP, Read16BitReg(SP) - 2);
    WriteAddress(Read16BitReg(SP), Read8BitReg(HIGH, RR));
    WriteAddress(Read16BitReg(SP), Read8BitReg(LOW,  RR));
}
// Flags: - - - -
function POP_RR(RR) {
    Write8BitReg(HIGH, RR, ReadAddress(Read16BitReg(SP)));
    Write8BitReg(LOW,  RR, ReadAddress(Read16BitReg(SP + 1)));
    Write16BitReg(SP, Read16BitReg(SP) + 2);
}

// 8-bit Opcodes
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
    INC_R(HIGH, BC);
}
// DEC B
// Flags: Z 1 H -
function Execute0x05() {
    DEC_R(HIGH, BC);
}
// LD B, d8
// Flags: - - - -
function Execute0x06() {
    LD_R_n(HIGH, BC);
}
// RLCA
// Flags: 0 0 0 A7
function Execute0x07() {
    RLCA();
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
    INC_R(LOW, BC);
}
// DEC C
// Flags: Z 1 H -
function Execute0x0D() {
    DEC_R(LOW, BC);
}
// LD C, d8
// Flags: - - - -
function Execute0x0E() {
    LD_R_n(LOW, BC);
}
// RRCA
// Flags: 0 0 0 A0
function Execute0x0F() {
    RRCA();
}
// STOP
// Flags: - - - -
function Execute0x10() {
    // Do nothing - apparently no ROM actually uses this
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
    INC_R(HIGH, DE);
}
// DEC D
// Flags: Z 1 H -
function Execute0x15() {
    DEC_R(HIGH, DE);
}
// LD D, d8
// Flags: - - - -
function Execute0x16() {
    LD_R_n(HIGH, DE);
}
// RLA
// Flags: 0 0 0 A7
function Execute0x17() {
    RLA();
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
    INC_R(LOW, DE);
}
// DEC E
// Flags: Z 1 H -
function Execute0x1D() {
    DEC_R(LOW, DE);
}
// LD E, d8
// Flags:  - - - - 
function Execute0x1E() {
    LD_R_n(LOW, DE);
}
// RRA
// Flags: 0 0 0 A0
function Execute0x1F() {
    RRA();
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
    INC_R(HIGH, HL);
}
// DEC H
// Flags:  Z 1 H -
function Execute0x25() {
    DEC_R(HIGH, HL);
}
// LD H, d8
// Flags:  - - - - 
function Execute0x26() {
    LD_R_n(HIGH, HL);
}
// DAA
// Flags:  Z - 0 C
function Execute0x27() {
    DAA();
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
    INC_R(LOW, HL);
}
// DEC L
// Flags:  Z 1 H -
function Execute0x2D() {
    DEC_R(LOW, HL);
}
// LD L, d8
// Flags:  - - - - 
function Execute0x2E() {
    LD_R_n(LOW, HL);
}
// CPL
// Flags:  - 1 1 -
function Execute0x2F() {
    Write8BitReg(~Read8BitReg(HIGH, AF));
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
    INC_R(HIGH, AF);
}
// DEC A
// Flags:  Z 1 H -
function Execute0x3D() {
    DEC_R(HIGH, AF);
}
// LD A, d8
// Flags:  - - - -
function Execute0x3E() {
    LD_R_n(HIGH, AF);
}
// CCF
// Flags:  - 0 0 !C
function Execute0x3F() {
    CCF();
}
// LD B, B
// Flags:  - - - -
function Execute0x40() {
    // Do nothing
}
// LD B, C
// Flags:  - - - -
function Execute0x41() {
    LD_R_R(HIGH, BC, LOW, BC);
}
// LD B, D
// Flags:  - - - -
function Execute0x42() {
    LD_R_R(HIGH, BC, HIGH, DE);
}
// LD B, E
// Flags:  - - - -
function Execute0x43() {
    LD_R_R(HIGH, BC, LOW, DE);
}
// LD B, H
// Flags:  - - - -
function Execute0x44() {
    LD_R_R(HIGH, BC, HIGH, HL);
}
// LD B, L
// Flags:  - - - -
function Execute0x45() {
    LD_R_R(HIGH, BC, LOW, HL);
}
// LD B, (HL)
// Flags:  - - - -
function Execute0x46() {
    LD_R__HL_(HIGH, BC);
}
// LD B, A
// Flags:  - - - -
function Execute0x47() {
    LD_R_R(HIGH, BC, HIGH, AF);
}
// LD C, B
// Flags:  - - - -
function Execute0x48() {
    LD_R_R(LOW, BC, HIGH, BC);
}
// LD C, C
// Flags:  - - - -
function Execute0x49() {
    // Do nothing
}
// LD C, D
// Flags:  - - - -
function Execute0x4A() {
    LD_R_R(LOW, BC, HIGH, DE);
}
// LD C, E
// Flags:  - - - -
function Execute0x4B() {
    LD_R_R(LOW, BC, LOW, DE);
}
// LD C, H
// Flags:  - - - -
function Execute0x4C() {
    LD_R_R(LOW, BC, HIGH, HL);
}
// LD C, L
// Flags:  - - - -
function Execute0x4D() {
    LD_R_R(LOW, BC, LOW, HL);
}
// LD C, (HL)
// Flags:  - - - -
function Execute0x4E() {
    LD_R__HL_(LOW, BC);
}
// LD C, A
// Flags:  - - - -
function Execute0x4F() {
    LD_R_R(LOW, BC, HIGH, AF);
}
// LD D, B
// Flags:  - - - -
function Execute0x50() {
    LD_R_R(HIGH, DE, HIGH, BC);
}
// LD D, C
// Flags:  - - - -
function Execute0x51() {
    LD_R_R(HIGH, DE, LOW, BC);
}
// LD D, D
// Flags:  - - - -
function Execute0x52() {
    // Do nothing
}
// LD D, E
// Flags:  - - - -
function Execute0x53() {
    LD_R_R(HIGH, DE, LOW, DE);
}
// LD D, H
// Flags:  - - - -
function Execute0x54() {
    LD_R_R(HIGH, DE, HIGH, HL);
}
// LD D, L
// Flags:  - - - -
function Execute0x55() {
    LD_R_R(HIGH, DE, LOW, HL);
}
// LD D, (HL)
// Flags:  - - - -
function Execute0x56() {
    LD_R__HL_(HIGH, DE);
}
// LD D, A
// Flags:  - - - -
function Execute0x57() {
    LD_R_R(HIGH, DE, HIGH, AF);
}
// LD E, B
// Flags:  - - - -
function Execute0x58() {
    LD_R_R(LOW, DE, HIGH, BC);
}
// LD E, C
// Flags:  - - - -
function Execute0x59() {
    LD_R_R(LOW, DE, LOW, BC);
}
// LD E, D
// Flags:  - - - -
function Execute0x5A() {
    LD_R_R(LOW, DE, HIGH, DE);
}
// LD E, E
// Flags:  - - - -
function Execute0x5B() {
    // Do nothing
}
// LD E, H
// Flags:  - - - -
function Execute0x5C() {
    LD_R_R(LOW, DE, HIGH, HL);
}
// LD E, L
// Flags:  - - - -
function Execute0x5D() {
    LD_R_R(LOW, DE, LOW, HL);
}
// LD E, (HL)
// Flags:  - - - -
function Execute0x5E() {
    LD_R__HL_(LOW, DE);
}
// LD E, A
// Flags:  - - - -
function Execute0x5F() {
    LD_R_R(LOW, DE, HIGH, AF);
}
// LD H, B
// Flags:  - - - -
function Execute0x60() {
    LD_R_R(HIGH, HL, HIGH, BC);
}
// LD H, C
// Flags:  - - - -
function Execute0x61() {
    LD_R_R(HIGH, HL, LOW, BC);
}
// LD H, D
// Flags:  - - - -
function Execute0x62() {
    LD_R_R(HIGH, HL, HIGH, DE);
}
// LD H, E
// Flags:  - - - -
function Execute0x63() {
    LD_R_R(HIGH, HL, LOW, DE);
}
// LD H, H
// Flags:  - - - -
function Execute0x64() {
    // Do nothing
}
// LD H, L
// Flags:  - - - -
function Execute0x65() {
    LD_R_R(HIGH, HL, LOW, HL);
}
// LD H, (HL)
// Flags:  - - - -
function Execute0x66() {
    LD_R__HL_(HIGH, HL);
}
// LD H, A
// Flags:  - - - -
function Execute0x67() {
    LD_R_R(HIGH, HL, HIGH, AF);
}
// LD L, B
// Flags:  - - - -
function Execute0x68() {
    LD_R_R(LOW, HL, HIGH, BC);
}
// LD L, C
// Flags:  - - - -
function Execute0x69() {
    LD_R_R(LOW, HL, LOW, BC);
}
// LD L, D
// Flags:  - - - -
function Execute0x6A() {
    LD_R_R(LOW, HL, HIGH, DE);
}
// LD L, E
// Flags:  - - - -
function Execute0x6B() {
    LD_R_R(LOW, HL, LOW, DE);
}
// LD L, H
// Flags:  - - - -
function Execute0x6C() {
    LD_R_R(LOW, HL, HIGH, HL);
}
// LD L, L
// Flags:  - - - -
function Execute0x6D() {
    // Do nothing
}
// LD L, (HL)
// Flags:  - - - -
function Execute0x6E() {
    LD_R__HL_(LOW, HL);
}
// LD L, A
// Flags:  - - - -
function Execute0x6F() {
    LD_R_R(LOW, HL, HIGH, AF);
}
// LD (HL), B
// Flags:  - - - -
function Execute0x70() {
    LD__HL__R(HIGH, BC);
}
// LD (HL), C
// Flags:  - - - -
function Execute0x71() {
    LD__HL__R(LOW, BC);
}
// LD (HL), D
// Flags:  - - - -
function Execute0x72() {
    LD__HL__R(HIGH, DE);
}
// LD (HL), E
// Flags:  - - - -
function Execute0x73() {
    LD__HL__R(LOW, DE);
}
// LD (HL), H
// Flags:  - - - -
function Execute0x74() {
    LD__HL__R(HIGH, HL);
}
// LD (HL), L
// Flags:  - - - -
function Execute0x75() {
    LD__HL__R(LOW, HL);
}
// HALT
// Flags:  - - - -
function Execute0x76() {
    Halt = true;
}
// LD (HL), A
// Flags:  - - - -
function Execute0x77() {
    LD__HL__R(HIGH, AF);
}
// LD A, B
// Flags:  - - - -
function Execute0x78() {
    LD_R_R(HIGH, AF, HIGH, BC);
}
// LD A, C
// Flags:  - - - -
function Execute0x79() {
    LD_R_R(HIGH, AF, LOW, BC);
}
// LD A, D
// Flags:  - - - -
function Execute0x7A() {
    LD_R_R(HIGH, AF, HIGH, DE);
}
// LD A, E
// Flags:  - - - -
function Execute0x7B() {
    LD_R_R(HIGH, AF, LOW, DE);
}
// LD A, H
// Flags:  - - - -
function Execute0x7C() {
    LD_R_R(HIGH, AF, HIGH, HL);
}
// LD A, L
// Flags:  - - - -
function Execute0x7D() {
    LD_R_R(HIGH, AF, LOW, HL);
}
// LD A, (HL)
// Flags:  - - - -
function Execute0x7E() {
    LD_R__HL_(HIGH, AF);
}
// LD A, A
// Flags:  - - - -
function Execute0x7F() {
    // Do nothing
}
// ADD A, B
// Flags:  Z 0 H C
function Execute0x80() {
    ADD(Read8BitReg(HIGH, BC));
}
// ADD A, C
// Flags:  Z 0 H C
function Execute0x81() {
    ADD(Read8BitReg(LOW, BC));
}
// ADD A, D
// Flags:  Z 0 H C
function Execute0x82() {
    ADD(Read8BitReg(HIGH, DE));
}
// ADD A, E
// Flags:  Z 0 H C
function Execute0x83() {
    ADD(Read8BitReg(LOW, DE));
}
// ADD A, H
// Flags:  Z 0 H C
function Execute0x84() {
    ADD(Read8BitReg(HIGH, HL));
}
// ADD A, L
// Flags:  Z 0 H C
function Execute0x85() {
    ADD(Read8BitReg(LOW, HL));
}
// ADD A, (HL)
// Flags:  Z 0 H C
function Execute0x86() {
    ADD(ReadAddress(Read16BitReg(HL)));
}
// ADD A, A
// Flags:  Z 0 H C
function Execute0x87() {
    ADD(Read8BitReg(HIGH, AF));
}
// ADC A, B
// Flags:  Z 0 H C
function Execute0x88() {
    ADC(Read8BitReg(HIGH, BC));
}
// ADC A, C
// Flags:  Z 0 H C
function Execute0x89() {
    ADC(Read8BitReg(LOW, BC));
}
// ADC A, D
// Flags:  Z 0 H C
function Execute0x8A() {
    ADC(Read8BitReg(HIGH, DE));
}
// ADC A, E
// Flags:  Z 0 H C
function Execute0x8B() {
    ADC(Read8BitReg(LOW, DE));
}
// ADC A, H
// Flags:  Z 0 H C
function Execute0x8C() {
    ADC(Read8BitReg(HIGH, HL));
}
// ADC A, L
// Flags:  Z 0 H C
function Execute0x8D() {
    ADC(Read8BitReg(LOW, HL));
}
// ADC A, (HL)
// Flags:  Z 0 H C
function Execute0x8E() {
    ADC(ReadAddress(Read16BitReg(HL)));
}
// ADC A, A
// Flags:  Z 0 H C
function Execute0x8F() {
    ADC(Read8BitReg(HIGH, AF));
}
// SUB B
// Flags:  Z 1 H C
function Execute0x90() {
    SUB(Read8BitReg(HIGH, BC));
}
// SUB C
// Flags:  Z 1 H C
function Execute0x91() {
    SUB(Read8BitReg(LOW, BC));
}
// SUB D
// Flags:  Z 1 H C
function Execute0x92() {
    SUB(Read8BitReg(HIGH, DE));
}
// SUB E
// Flags:  Z 1 H C
function Execute0x93() {
    SUB(Read8BitReg(LOW, DE));
}
// SUB H
// Flags:  Z 1 H C
function Execute0x94() {
    SUB(Read8BitReg(HIGH, HL));
}
// SUB L
// Flags:  Z 1 H C
function Execute0x95() {
    SUB(Read8BitReg(LOW, HL));
}
// SUB (HL)
// Flags:  Z 1 H C
function Execute0x96() {
    SUB(ReadAddress(Read16BitReg(HL)));
}
// SUB A
// Flags:  Z 1 H C
function Execute0x97() {
    SUB(Read8BitReg(HIGH, AF));
}
// SBC A, B
// Flags:  Z 1 H C
function Execute0x98() {
    SBC(Read8BitReg(HIGH, BC));
}
// SBC A, C
// Flags:  Z 1 H C
function Execute0x99() {
    SBC(Read8BitReg(LOW, BC));
}
// SBC A, D
// Flags:  Z 1 H C
function Execute0x9A() {
    SBC(Read8BitReg(HIGH, DE));
}
// SBC A, E
// Flags:  Z 1 H C
function Execute0x9B() {
    SBC(Read8BitReg(LOW, DE));
}
// SBC A, H
// Flags:  Z 1 H C
function Execute0x9C() {
    SBC(Read8BitReg(HIGH, HL));
}
// SBC A, L
// Flags:  Z 1 H C
function Execute0x9D() {
    SBC(Read8BitReg(LOW, HL));
}
// SBC A, (HL)
// Flags:  Z 1 H C
function Execute0x9E() {
    SBC(ReadAddress(Read16BitReg(HL)));
}
// SBC A, A
// Flags:  Z 1 H C
function Execute0x9F() {
    SBC(Read8BitReg(HIGH, AF));
}
// AND B
// Flags:  Z 0 1 0
function Execute0xA0() {
    AND(Read8BitReg(HIGH, BC));
}
// AND C
// Flags:  Z 0 1 0
function Execute0xA1() {
    AND(Read8BitReg(LOW, BC));
}
// AND D
// Flags:  Z 0 1 0
function Execute0xA2() {
    AND(Read8BitReg(HIGH, DE));
}
// AND E
// Flags:  Z 0 1 0
function Execute0xA3() {
    AND(Read8BitReg(LOW, DE));
}
// AND H
// Flags:  Z 0 1 0
function Execute0xA4() {
    AND(Read8BitReg(HIGH, HL));
}
// AND L
// Flags:  Z 0 1 0
function Execute0xA5() {
    AND(Read8BitReg(LOW, HL));
}
// AND (HL)
// Flags:  Z 0 1 0
function Execute0xA6() {
    AND(ReadAddress(Read16BitReg(HL)));
}
// AND A
// Flags:  Z 0 1 0
function Execute0xA7() {
    AND(Read8BitReg(HIGH, AF));
}
// XOR B
// Flags:  Z 0 0 0
function Execute0xA8() {
    XOR(Read8BitReg(HIGH, BC));
}
// XOR C
// Flags:  Z 0 0 0
function Execute0xA9() {
    XOR(Read8BitReg(LOW, BC));
}
// XOR D
// Flags:  Z 0 0 0
function Execute0xAA() {
    XOR(Read8BitReg(HIGH, DE));
}
// XOR E
// Flags:  Z 0 0 0
function Execute0xAB() {
    XOR(Read8BitReg(LOW, DE));
}
// XOR H
// Flags:  Z 0 0 0
function Execute0xAC() {
    XOR(Read8BitReg(HIGH, HL));
}
// XOR L
// Flags:  Z 0 0 0
function Execute0xAD() {
    XOR(Read8BitReg(LOW, HL));
}
// XOR (HL)
// Flags:  Z 0 0 0
function Execute0xAE() {
    XOR(ReadAddress(Read16BitReg(HL)));
}
// XOR A
// Flags:  Z 0 0 0
function Execute0xAF() {
    XOR(Read8BitReg(HIGH, AF));
}
// OR B
// Flags:  Z 0 0 0
function Execute0xB0() {
    OR(Read8BitReg(HIGH, BC));
}
// OR C
// Flags:  Z 0 0 0
function Execute0xB1() {
    OR(Read8BitReg(LOW, BC));
}
// OR D
// Flags:  Z 0 0 0
function Execute0xB2() {
    OR(Read8BitReg(HIGH, DE));
}
// OR E
// Flags:  Z 0 0 0
function Execute0xB3() {
    OR(Read8BitReg(LOW, DE));
}
// OR H
// Flags:  Z 0 0 0
function Execute0xB4() {
    OR(Read8BitReg(HIGH, HL));
}
// OR L
// Flags:  Z 0 0 0
function Execute0xB5() {
    OR(Read8BitReg(LOW, HL));
}
// OR (HL)
// Flags:  Z 0 0 0
function Execute0xB6() {
    OR(ReadAddress(Read16BitReg(HL)));
}
// OR A
// Flags:  Z 0 0 0
function Execute0xB7() {
    OR(Read8BitReg(HIGH, AF));
}
// CP B
// Flags:  Z 1 H C
function Execute0xB8() {
    CP(Read8BitReg(HIGH, BC));
}
// CP C
// Flags:  Z 1 H C
function Execute0xB9() {
    CP(Read8BitReg(LOW, BC));
}
// CP D
// Flags:  Z 1 H C
function Execute0xBA() {
    CP(Read8BitReg(HIGH, DE));
}
// CP E
// Flags:  Z 1 H C
function Execute0xBB() {
    CP(Read8BitReg(LOW, DE));
}
// CP H
// Flags:  Z 1 H C
function Execute0xBC() {
    CP(Read8BitReg(HIGH, HL));
}
// CP L
// Flags:  Z 1 H C
function Execute0xBD() {
    CP(Read8BitReg(LOW, HL));
}
// CP (HL)
// Flags:  Z 1 H C
function Execute0xBE() {
    CP(ReadAddress(Read16BitReg(HL)));
}
// CP A
// Flags:  Z 1 H C
function Execute0xBF() {
    CP(Read8BitReg(HIGH, AF));
}
// RET NZ
// Flags: - - - -
function Execute0xC0() {
    if (ReadFlag(F_Z)) RET();
}
// POP BC
// Flags: - - - -
function Execute0xC1() {
    POP_RR(BC);
}
// JP NZ
// Flags: - - - -
function Execute0xC2() {
    let addr = ReadAndIncrementPC16Bit();
    if (!ReadFlag(F_Z)) JP(addr);
}
// JP a16
// Flags: - - - -
function Execute0xC3() {
    let addr = ReadAndIncrementPC16Bit();
    JP(addr);
}
// CALL NZ, a16
// Flags: - - - -
function Execute0xC4() {
    if (!ReadFlag(F_Z)) CALL(ReadAndIncrementPC16Bit());
}
// PUSH BC
// Flags: - - - -
function Execute0xC5() {
    PUSH(BC);
}
// ADD A, d8
// Flags: Z 0 H C
function Execute0xC6() {
    ADD(ReadAndIncrementPC8Bit());
}
// RST 0
// Flags: - - - -
function Execute0xC7() {
    CALL(0x0000);
}
// RET Z
// Flags: - - - -
function Execute0xC8() {
    if (ReadFlag(F_Z)) RET();
}
// RET
// Flags: - - - -
function Execute0xC9() {
    RET();
}
// JP Z, a16
// Flags: - - - -
function Execute0xCA() {
    if (ReadFlag(F_Z)) JP(ReadAndIncrementPC16Bit());
}
// CB
// Flags: - - - -
function Execute0xCB() {
    ExecuteCbInstruction(ReadAndIncrementPC8Bit());
}
// CALL Z, a16
// Flags: - - - -
function Execute0xCC() {
    if (ReadFlag(F_Z)) CALL(ReadAndIncrementPC16Bit());
}
// CALL a16
// Flags: - - - -
function Execute0xCD() {
    CALL(ReadAndIncrementPC16Bit());
}
// ADC A, d8
// Flags: Z 0 H C
function Execute0xCE() {
    ADC(ReadAndIncrementPC8Bit());
}
// RST 1
// Flags: - - - -
function Execute0xCF() {
    CALL(0x0008);
}
// RET NC
// Flags: - - - -
function Execute0xD0() {
    if (!ReadFlag(F_C)) RET();
}
// POP DE
// Flags: - - - -
function Execute0xD1() {
    POP_RR(DE);
}
// JP NC, a16
// Flags: - - - -
function Execute0xD2() {
    if (!ReadFlag(F_C)) JP(ReadAndIncrementPC16Bit());
}
//
// Flags: - - - -
function Execute0xD3() {
    // Do nothing
}
// CALL NC, a16
// Flags: - - - -
function Execute0xD4() {
    if (!ReadFlag(F_C)) CALL(ReadAndIncrementPC16Bit());
}
// PUSH DE
// Flags: - - - -
function Execute0xD5() {
    PUSH_RR(DE);
}
// SUB d8
// Flags: Z 1 H C
function Execute0xD6() {
    SUB(ReadAndIncrementPC8Bit());
}
// RST 2
// Flags: - - - -
function Execute0xD7() {
    CALL(0x0010);
}
// RET C
// Flags: - - - -
function Execute0xD8() {
    if (ReadFlag(F_C)) RET();
}
// RETI
// Flags: - - - -
function Execute0xD9() {
    InterruptMasterEnable = true;
    RET();
}
// JP C, a16
// Flags: - - - -
function Execute0xDA() {
    if (ReadFlag(F_C)) JP(ReadAndIncrementPC16Bit());
}
//
// Flags: - - - -
function Execute0xDB() {
    // Do nothing
}
// CALL C, a16
// Flags: - - - -
function Execute0xDC() {
    if (ReadFlag(F_C)) CALL(ReadAndIncrementPC16Bit());
}
//
// Flags: - - - -
function Execute0xDD() {
    // Do nothing
}
// SBC A, d8
// Flags: Z 1 H C
function Execute0xDE() {
    SBC(ReadAndIncrementPC8Bit());
}
// RST 3
// Flags: - - - -
function Execute0xDF() {
    CALL(0x0018);
}
// LD (a8), A
// Flags: - - - -
function Execute0xE0() {
    WriteAddress(0xFF00 + ReadAndIncrementPC8Bit(), Read8BitReg(HIGH, AF));
}
// POP HL
// Flags: - - - -
function Execute0xE1() {
    POP(HL);
}
// LD (C), A
// Flags: - - - -
function Execute0xE2() {
    WriteAddress(0xFF00 + Read8BitReg(LOW, BC), Read8BitReg(HIGH, AF));
}
//
// Flags: - - - -
function Execute0xE3() {
    // Do nothing
}
//
// Flags: - - - -
function Execute0xE4() {
    // Do nothing
}
// PUSH HL
// Flags: - - - -
function Execute0xE5() {
    PUSH_RR(HL);
}
// AND d8
// Flags: Z 0 1 0
function Execute0xE6() {
    AND(ReadAndIncrementPC8Bit());
}
// RST 4
// Flags: - - - -
function Execute0xE7() {
    CALL(0x0020);
}
// ADD SP, s8
// Flags: 0 0 H C
function Execute0xE8() {
    ADD_SP_s(SP);
}
// JP HL
// Flags: - - - -
function Execute0xE9() {
    JP(Read16BitReg(HL));
}
// LD (a16), A
// Flags: - - - -
function Execute0xEA() {
    WriteAddress(ReadAndIncrementPC16Bit(), HIGH);
}
//
// Flags: - - - -
function Execute0xEB() {
    // Do nothing
}
//
// Flags: - - - -
function Execute0xEC() {
    // Do nothing
}
//
// Flags: - - - -
function Execute0xED() {
    // Do nothing
}
// XOR d8
// Flags: Z 0 0 0
function Execute0xEE() {
    XOR(ReadAndIncrementPC8Bit());
}
// RST 5
// Flags: - - - -
function Execute0xEF() {
    CALL(0x0028);
}
// LD A, (a8)
// Flags: - - - -
function Execute0xF0() {
    Write8BitReg(HIGH, AF, 0xFF00 + ReadAndIncrementPC8Bit());
}
// POP AF
// Flags: - - - -
function Execute0xF1() {
    POP_RR(AF);
}
// LD A, (C)
// Flags: - - - -
function Execute0xF2() {
    WriteAddress(0xFF00 + Read8BitReg(LOW, BC), Read8BitReg(HIGH, AF));
}
// DI
// Flags: - - - -
function Execute0xF3() {
    InterruptMasterEnable = false;
}
// 
// Flags: - - - -
function Execute0xF4() {
    // Do nothing
}
// PUSH AF
// Flags: - - - -
function Execute0xF5() {
    PUSH_RR(AF);
}
// OR d8
// Flags: Z 0 0 0
function Execute0xF6() {
    OR(ReadAndIncrementPC8Bit());
}
// RST 6
// Flags: - - - -
function Execute0xF7() {
    CALL(0x0030);
}
// LD HL, SP + s8
// Flags: 0 0 H C
function Execute0xF8() {
    ADD_SP_s(HL);
}
// LD HL, SP
// Flags: - - - -
function Execute0xF9() {
    Write16BitReg(HL, Read16BitReg(SP));
}
// LD A, (a16)
// Flags: - - - -
function Execute0xFA() {
    Write8BitReg(HIGH, AF, ReadAddress(ReadAndIncrementPC16Bit()));
}
// EI
// Flags: - - - -
function Execute0xFB() {
    InterruptMasterEnable = true;
}
// 
// Flags: - - - -
function Execute0xFC() {
    // Do nothing
}
// 
// Flags: - - - -
function Execute0xFD() {
    // Do nothing
}
// CP d8
// Flags: Z 1 H C
function Execute0xFE() {
    CP(ReadAndIncrementPC8Bit());
}
// RST 7
// Flags: - - - -
function Execute0xFF() {
    CALL(0x0038);
}

// 16-bit Opcodes
// RLC B
// Flags: Z 0 0 R7
function ExecuteCb0x00() {
    RLC_R(HIGH, BC);
}
// RLC C
// Flags: Z 0 0 R7
function ExecuteCb0x01() {
    RLC_R(LOW, BC);
}
// RLC D
// Flags: Z 0 0 R7
function ExecuteCb0x02() {
    RLC_R(HIGH, DE);
}
// RLC E
// Flags: Z 0 0 R7
function ExecuteCb0x03() {
    RLC_R(LOW, DE);
}
// RLC H
// Flags: Z 0 0 R7
function ExecuteCb0x04() {
    RLC_R(HIGH, HL);
}
// RLC L
// Flags: Z 0 0 R7
function ExecuteCb0x05() {
    RLC_R(LOW, HL);
}
// RLC (HL)
// Flags: Z 0 0 (HL)7
function ExecuteCb0x06() {
    RLC__HL_();
}
// RLC A
// Flags: Z 0 0 R7
function ExecuteCb0x07() {
    RLC_R(HIGH, AF);
}
// RRC B
// Flags: Z 0 0 R0
function ExecuteCb0x08() {
    RRC_R(HIGH, BC);
}
// RRC C
// Flags: Z 0 0 R0
function ExecuteCb0x09() {
    RRC_R(LOW, BC);
}
// RRC D
// Flags: Z 0 0 R0
function ExecuteCb0x0A() {
    RRC_R(HIGH, DE);
}
// RRC E
// Flags: Z 0 0 R0
function ExecuteCb0x0B() {
    RRC_R(LOW, DE);
}
// RRC H
// Flags: Z 0 0 R0
function ExecuteCb0x0C() {
    RRC_R(HIGH, HL);
}
// RRC L
// Flags: Z 0 0 R0
function ExecuteCb0x0D() {
    RRC_R(LOW, HL);
}
// RRC (HL)
// Flags: Z 0 0 (HL)0
function ExecuteCb0x0E() {
    RRC__HL_();
}
// RRC A
// Flags: Z 0 0 R0
function ExecuteCb0x0F() {
    RRC_R(HIGH, AF);
}
// RL B
// Flags: Z 0 0 R7
function ExecuteCb0x10() {
    RL_R(HIGH, BC);
}
// RL C
// Flags: Z 0 0 R7
function ExecuteCb0x11() {
    RL_R(LOW, BC);
}
// RL D
// Flags: Z 0 0 R7
function ExecuteCb0x12() {
    RL_R(HIGH, DE);
}
// RL E
// Flags: Z 0 0 R7
function ExecuteCb0x13() {
    RL_R(LOW, DE);
}
// RL H
// Flags: Z 0 0 R7
function ExecuteCb0x14() {
    RL_R(HIGH, HL);
}
// RL L
// Flags: Z 0 0 R7
function ExecuteCb0x15() {
    RL_R(LOW, HL);
}
// RL HL
// Flags: Z 0 0 (HL)7
function ExecuteCb0x16() {
    RL__HL_();
}
// RL A
// Flags: Z 0 0 R7
function ExecuteCb0x17() {
    RL_R(HIGH, AF);
}
// RR B
// Flags: Z 0 0 R0
function ExecuteCb0x18() {
    RR_R(HIGH, BC);
}
// RR C
// Flags: Z 0 0 R0
function ExecuteCb0x19() {
    RR_R(LOW, BC);
}
// RR D
// Flags: Z 0 0 R0
function ExecuteCb0x1A() {
    RR_R(HIGH, DE);
}
// RR E
// Flags: Z 0 0 R0
function ExecuteCb0x1B() {
    RR_R(LOW, DE);
}
// RR H
// Flags: Z 0 0 R0
function ExecuteCb0x1C() {
    RR_R(HIGH, HL);
}
// RR L
// Flags: Z 0 0 R0
function ExecuteCb0x1D() {
    RR_R(LOW, HL);
}
// RR (HL)
// Flags: Z 0 0 (HL)0
function ExecuteCb0x1E() {
    RR__HL_();
}
// RR A
// Flags: Z 0 0 R0
function ExecuteCb0x1F() {
    RR_R(HIGH, AF);
}
// SLA B
// Flags: Z 0 0 R7
function ExecuteCb0x20() {
    SLA_R(HIGH, BC);
}
// SLA C
// Flags: Z 0 0 R7
function ExecuteCb0x21() {
    SLA_R(LOW, BC);
}
// SLA D
// Flags: Z 0 0 R7
function ExecuteCb0x22() {
    SLA_R(HIGH, DE);
}
// SLA E
// Flags: Z 0 0 R7
function ExecuteCb0x23() {
    SLA_R(LOW, DE);
}
// SLA H
// Flags: Z 0 0 R7
function ExecuteCb0x24() {
    SLA_R(HIGH, HL);
}
// SLA L
// Flags: Z 0 0 R7
function ExecuteCb0x25() {
    SLA_R(LOW, HL);
}
// SLA (HL)
// Flags: Z 0 0 (HL)7
function ExecuteCb0x26() {
    SLA__HL_();
}
// SLA A
// Flags: Z 0 0 R7
function ExecuteCb0x27() {
    SLA_R(HIGH, AF);
}
// SRA B
// Flags: Z 0 0 R0
function ExecuteCb0x28() {
    SRA_R(HIGH, BC);
}
// SRA C
// Flags: Z 0 0 R0
function ExecuteCb0x29() {
    SRA_R(LOW, BC);
}
// SRA D
// Flags: Z 0 0 R0
function ExecuteCb0x2A() {
    SRA_R(HIGH, DE);
}
// SRA E
// Flags: Z 0 0 R0
function ExecuteCb0x2B() {
    SRA_R(LOW, DE);
}
// SRA H
// Flags: Z 0 0 R0
function ExecuteCb0x2C() {
    SRA_R(HIGH, HL);
}
// SRA L
// Flags: Z 0 0 R0
function ExecuteCb0x2D() {
    SRA_R(LOW, HL);
}
// SRA (HL)
// Flags: Z 0 0 (HL)0
function ExecuteCb0x2E() {
    SRA__HL_();
}
// SRA A
// Flags: Z 0 0 R0
function ExecuteCb0x2F() {
    SRA_R(HIGH, AF);
}
// SWAP B
// Flags: - - - -
function ExecuteCb0x30() {
    SWAP_R(HIGH, BC);
}
// SWAP C
// Flags: - - - -
function ExecuteCb0x31() {
    SWAP_R(LOW, BC);
}
// SWAP D
// Flags: - - - -
function ExecuteCb0x32() {
    SWAP_R(HIGH, DE);
}
// SWAP E
// Flags: - - - -
function ExecuteCb0x33() {
    SWAP_R(LOW, DE);
}
// SWAP H
// Flags: - - - -
function ExecuteCb0x34() {
    SWAP_R(HIGH, HL);
}
// SWAP L
// Flags: - - - -
function ExecuteCb0x35() {
    SWAP_R(LOW, HL);
}
// SWAP (HL)
// Flags: - - - -
function ExecuteCb0x36() {
    SWAP__HL_();
}
// SWAP A
// Flags: - - - -
function ExecuteCb0x37() {
    SWAP_R(HIGH, AF);
}
// SRL B
// Flags: Z 0 0 R0
function ExecuteCb0x38() {
    SRL_R(HIGH, BC);
}
// SRL C
// Flags: Z 0 0 R0
function ExecuteCb0x39() {
    SRL_R(LOW, BC);
}
// SRL D
// Flags: Z 0 0 R0
function ExecuteCb0x3A() {
    SRL_R(HIGH, DE);
}
// SRL E
// Flags: Z 0 0 R0
function ExecuteCb0x3B() {
    SRL_R(LOW, DE);
}
// SRL H
// Flags: Z 0 0 R0
function ExecuteCb0x3C() {
    SRL_R(HIGH, HL);
}
// SRL L
// Flags: Z 0 0 R0
function ExecuteCb0x3D() {
    SRL_R(LOW, HL);
}
// SRL (HL)
// Flags: Z 0 0 (HL)0
function ExecuteCb0x3E() {
    SRL__HL_();
}
// SRL A
// Flags: Z 0 0 R0
function ExecuteCb0x3F() {
    SRL_R(HIGH, AF);
}
// BIT 0, B
// Flags: !R0 0 1 - 
function ExecuteCb0x40() {
    BIT_R(HIGH, BC, 0);
}
// BIT 0, C
// Flags: !R0 0 1 - 
function ExecuteCb0x41() {
    BIT_R(LOW, BC, 0);
}
// BIT 0, D
// Flags: !R0 0 1 - 
function ExecuteCb0x42() {
    BIT_R(HIGH, DE, 0);
}
// BIT 0, E
// Flags: !R0 0 1 - 
function ExecuteCb0x43() {
    BIT_R(LOW, DE, 0);
}
// BIT 0, H
// Flags: !R0 0 1 - 
function ExecuteCb0x44() {
    BIT_R(HIGH, HL, 0);
}
// BIT 0, L
// Flags: !R0 0 1 - 
function ExecuteCb0x45() {
    BIT_R(LOW, HL, 0);
}
// BIT 0, (HL)
// Flags: !(HL)0 0 1 - 
function ExecuteCb0x46() {
    BIT__HL_(0);
}
// BIT 0, A
// Flags: !R0 0 1 - 
function ExecuteCb0x47() {
    BIT_R(HIGH, AF, 0);
}
// BIT 1, B
// Flags: !R1 0 1 - 
function ExecuteCb0x48() {
    BIT_R(HIGH, BC, 1);
}
// BIT 1, C
// Flags: !R1 0 1 - 
function ExecuteCb0x49() {
    BIT_R(LOW, BC, 1);
}
// BIT 1, D
// Flags: !R1 0 1 - 
function ExecuteCb0x4A() {
    BIT_R(HIGH, DE, 1);
}
// BIT 1, E
// Flags: !R1 0 1 - 
function ExecuteCb0x4B() {
    BIT_R(LOW, DE, 1);
}
// BIT 1, H
// Flags: !R1 0 1 - 
function ExecuteCb0x4C() {
    BIT_R(HIGH, HL, 1);
}
// BIT 1, L
// Flags: !R1 0 1 - 
function ExecuteCb0x4D() {
    BIT_R(LOW, HL, 1);
}
// BIT 1, (HL)
// Flags: !(HL)1 0 1 - 
function ExecuteCb0x4E() {
    BIT__HL_(1);
}
// BIT 1, A
// Flags: !R1 0 1 - 
function ExecuteCb0x4F() {
    BIT_R(HIGH, AF, 1);
}
// BIT 2, B
// Flags: !R2 0 1 - 
function ExecuteCb0x50() {
    BIT_R(HIGH, BC, 2);
}
// BIT 2, C
// Flags: !R2 0 1 - 
function ExecuteCb0x51() {
    BIT_R(LOW, BC, 2);
}
// BIT 2, D
// Flags: !R2 0 1 - 
function ExecuteCb0x52() {
    BIT_R(HIGH, DE, 2);
}
// BIT 2, E
// Flags: !R2 0 1 -
function ExecuteCb0x53() {
    BIT_R(LOW, DE, 2);
}
// BIT 2, H
// Flags: !R2 0 1 - 
function ExecuteCb0x54() {
    BIT_R(HIGH, HL, 2);
}
// BIT 2, L
// Flags: !R2 0 1 - 
function ExecuteCb0x55() {
    BIT_R(LOW, HL, 2);
}
// BIT 2, (HL)
// Flags: !(HL)2 0 1 - 
function ExecuteCb0x56() {
    BIT__HL_(2);
}
// BIT 2, A
// Flags: !R2 0 1 - 
function ExecuteCb0x57() {
    BIT_R(HIGH, AF, 2);
}
// BIT 3, B
// Flags: !R3 0 1 - 
function ExecuteCb0x58() {
    BIT_R(HIGH, BC, 3);
}
// BIT 3, C
// Flags: !R3 0 1 - 
function ExecuteCb0x59() {
    BIT_R(LOW, BC, 3);
}
// BIT 3, D
// Flags: !R3 0 1 - 
function ExecuteCb0x5A() {
    BIT_R(HIGH, DE, 3);
}
// BIT 3, E
// Flags: !R3 0 1 - 
function ExecuteCb0x5B() {
    BIT_R(LOW, DE, 3);
}
// BIT 3, H
// Flags: !R3 0 1 - 
function ExecuteCb0x5C() {
    BIT_R(HIGH, HL, 3);
}
// BIT 3, L
// Flags: !R3 0 1 - 
function ExecuteCb0x5D() {
    BIT_R(LOW, HL, 3);
}
// BIT 3, (HL)
// Flags: !(HL)3 0 1 - 
function ExecuteCb0x5E() {
    BIT__HL_(3);
}
// BIT 3, A
// Flags: !R3 0 1 - 
function ExecuteCb0x5F() {
    BIT_R(HIGH, AF, 3);
}
// BIT 4, B
// Flags: !R4 0 1 - 
function ExecuteCb0x60() {
    BIT_R(HIGH, BC, 4);
}
// BIT 4, C
// Flags: !R4 0 1 - 
function ExecuteCb0x61() {
    BIT_R(LOW, BC, 4);
}
// BIT 4, D
// Flags: !R4 0 1 - 
function ExecuteCb0x62() {
    BIT_R(HIGH, DE, 4);
}
// BIT 4, E
// Flags: !R4 0 1 - 
function ExecuteCb0x63() {
    BIT_R(LOW, DE, 4);
}
// BIT 4, H
// Flags: !R4 0 1 - 
function ExecuteCb0x64() {
    BIT_R(HIGH, HL, 4);
}
// BIT 4, L
// Flags: !R4 0 1 - 
function ExecuteCb0x65() {
    BIT_R(LOW, HL, 4);
}
// BIT 4, (HL)
// Flags: !(HL)4 0 1 - 
function ExecuteCb0x66() {
    BIT__HL_(4);
}
// BIT 4, A
// Flags: !R4 0 1 -
function ExecuteCb0x67() {
    BIT_R(HIGH, AF, 4);
}
// BIT 5, B
// Flags: !R5 0 1 -
function ExecuteCb0x68() {
    BIT_R(HIGH, BC, 5);
}
// BIT 5, C
// Flags: !R5 0 1 -
function ExecuteCb0x69() {
    BIT_R(LOW, BC, 5);
}
// BIT 5, D
// Flags: !R5 0 1 -
function ExecuteCb0x6A() {
    BIT_R(HIGH, DE, 5);
}
// BIT 5, E
// Flags: !R5 0 1 -
function ExecuteCb0x6B() {
    BIT_R(LOW, DE, 5);
}
// BIT 5, H
// Flags: !R5 0 1 -
function ExecuteCb0x6C() {
    BIT_R(HIGH, HL, 5);
}
// BIT 5, L
// Flags: !R5 0 1 -
function ExecuteCb0x6D() {
    BIT_R(LOW, HL, 5);
}
// BIT 5, (HL)
// Flags: !(HL)5 0 1 -
function ExecuteCb0x6E() {
    BIT__HL_(5);
}
// BIT 5, A
// Flags: !R5 0 1 -
function ExecuteCb0x6F() {
    BIT_R(HIGH, AF, 5);
}
// BIT 6, B
// Flags: !R6 0 1 -
function ExecuteCb0x70() {
    BIT_R(HIGH, BC, 6);
}
// BIT 6, C
// Flags: !R6 0 1 -
function ExecuteCb0x71() {
    BIT_R(LOW, BC, 6);
}
// BIT 6, D
// Flags: !R6 0 1 -
function ExecuteCb0x72() {
    BIT_R(HIGH, DE, 6);
}
// BIT 6, E
// Flags: !R6 0 1 -
function ExecuteCb0x73() {
    BIT_R(LOW, DE, 6);
}
// BIT 6, H
// Flags: !R6 0 1 -
function ExecuteCb0x74() {
    BIT_R(HIGH, HL, 6);
}
// BIT 6, L
// Flags: !R6 0 1 -
function ExecuteCb0x75() {
    BIT_R(LOW, HL, 6);
}
// BIT 6, (HL)
// Flags: !(HL)6 0 1 -
function ExecuteCb0x76() {
    BIT__HL_(6);
}
// BIT 6, A
// Flags: !R6 0 1 -
function ExecuteCb0x77() {
    BIT_R(HIGH, AF, 6);
}
// BIT 7, B
// Flags: !R7 0 1 -
function ExecuteCb0x78() {
    BIT_R(HIGH, BC, 7);
}
// BIT 7, C
// Flags: !R7 0 1 -
function ExecuteCb0x79() {
    BIT_R(LOW, BC, 7);
}
// BIT 7, D
// Flags: !R7 0 1 -
function ExecuteCb0x7A() {
    BIT_R(HIGH, DE, 7);
}
// BIT 7, E
// Flags: !R7 0 1 -
function ExecuteCb0x7B() {
    BIT_R(LOW, DE, 7);
}
// BIT 7, H
// Flags: !R7 0 1 -
function ExecuteCb0x7C() {
    BIT_R(HIGH, HL, 7);
}
// BIT 7, L
// Flags: !R7 0 1 -
function ExecuteCb0x7D() {
    BIT_R(LOW, HL, 7);
}
// BIT 7, (HL)
// Flags: !(HL)7 0 1 -
function ExecuteCb0x7E() {
    BIT__HL_(7);
}
// BIT 7, A
// Flags: !R7 0 1 -
function ExecuteCb0x7F() {
    BIT_R(HIGH, AF, 7);
}
// RES 0, B
// Flags: - - - -
function ExecuteCb0x80() {
    RES_R(HIGH, BC, 0);
}
// RES 0, C
// Flags: - - - -
function ExecuteCb0x81() {
    RES_R(LOW, BC, 0);
}
// RES 0, D
// Flags: - - - -
function ExecuteCb0x82() {
    RES_R(HIGH, DE, 0);
}
// RES 0, E
// Flags: - - - -
function ExecuteCb0x83() {
    RES_R(LOW, DE, 0);
}
// RES 0, H
// Flags: - - - -
function ExecuteCb0x84() {
    RES_R(HIGH, HL, 0);
}
// RES 0, L
// Flags: - - - -
function ExecuteCb0x85() {
    RES_R(LOW, HL, 0);
}
// RES 0, (HL)
// Flags: - - - -
function ExecuteCb0x86() {
    RES__HL_(0);
}
// RES 0, A
// Flags: - - - -
function ExecuteCb0x87() {
    RES_R(HIGH, AF, 0);
}
// RES 1, B
// Flags: - - - -
function ExecuteCb0x88() {
    RES_R(HIGH, BC, 1);
}
// RES 1, C
// Flags: - - - -
function ExecuteCb0x89() {
    RES_R(LOW, BC, 1);
}
// RES 1, D
// Flags: - - - -
function ExecuteCb0x8A() {
    RES_R(HIGH, DE, 1);
}
// RES 1, E
// Flags: - - - -
function ExecuteCb0x8B() {
    RES_R(LOW, DE, 1);
}
// RES 1, H
// Flags: - - - -
function ExecuteCb0x8C() {
    RES_R(HIGH, HL, 1);
}
// RES 1, L
// Flags: - - - -
function ExecuteCb0x8D() {
    RES_R(LOW, HL, 1);
}
// RES 1, (HL)
// Flags: - - - -
function ExecuteCb0x8E() {
    RES__HL_(1);
}
// RES 1, A
// Flags: - - - -
function ExecuteCb0x8F() {
    RES_R(HIGH, AF, 1);
}
// RES 2, B
// Flags: - - - -
function ExecuteCb0x90() {
    RES_R(HIGH, BC, 2);
}
// RES 2, C
// Flags: - - - -
function ExecuteCb0x91() {
    RES_R(LOW, BC, 2);
}
// RES 2, D
// Flags: - - - -
function ExecuteCb0x92() {
    RES_R(HIGH, DE, 2);
}
// RES 2, E
// Flags: - - - -
function ExecuteCb0x93() {
    RES_R(LOW, DE, 2);
}
// RES 2, H
// Flags: - - - -
function ExecuteCb0x94() {
    RES_R(HIGH, HL, 2);
}
// RES 2, L
// Flags: - - - -
function ExecuteCb0x95() {
    RES_R(LOW, HL, 2);
}
// RES 2, (HL)
// Flags: - - - -
function ExecuteCb0x96() {
    RES__HL_(2);
}
// RES 2, A
// Flags: - - - -
function ExecuteCb0x97() {
    RES_R(HIGH, AF, 2);
}
// RES 3, B
// Flags: - - - -
function ExecuteCb0x98() {
    RES_R(HIGH, BC, 3);
}
// RES 3, C
// Flags: - - - -
function ExecuteCb0x99() {
    RES_R(LOW, BC, 3);
}
// RES 3, D
// Flags: - - - -
function ExecuteCb0x9A() {
    RES_R(HIGH, DE, 3);
}
// RES 3, E
// Flags: - - - -
function ExecuteCb0x9B() {
    RES_R(LOW, DE, 3);
}
// RES 3, H
// Flags: - - - -
function ExecuteCb0x9C() {
    RES_R(HIGH, HL, 3);
}
// RES 3, L
// Flags: - - - -
function ExecuteCb0x9D() {
    RES_R(LOW, HL, 3);
}
// RES 3, (HL)
// Flags: - - - -
function ExecuteCb0x9E() {
    RES__HL_(3);
}
// RES 3, A
// Flags: - - - -
function ExecuteCb0x9F() {
    RES_R(HIGH, AF, 3);
}
// RES 4, B
// Flags: - - - -
function ExecuteCb0xA0() {
    RES_R(HIGH, BC, 4);
}
// RES 4, C
// Flags: - - - -
function ExecuteCb0xA1() {
    RES_R(LOW, BC, 4);
}
// RES 4, D
// Flags: - - - -
function ExecuteCb0xA2() {
    RES_R(HIGH, DE, 4);
}
// RES 4, E
// Flags: - - - -
function ExecuteCb0xA3() {
    RES_R(LOW, DE, 4);
}
// RES 4, H
// Flags: - - - -
function ExecuteCb0xA4() {
    RES_R(HIGH, HL, 4);
}
// RES 4, L
// Flags: - - - -
function ExecuteCb0xA5() {
    RES_R(LOW, HL, 4);
}
// RES 4, (HL)
// Flags: - - - -
function ExecuteCb0xA6() {
    RES__HL_(4);
}
// RES 4, A
// Flags: - - - -
function ExecuteCb0xA7() {
    RES_R(HIGH, AF, 4);
}
// RES 5, B
// Flags: - - - -
function ExecuteCb0xA8() {
    RES_R(HIGH, BC, 5);
}
// RES 5, C
// Flags: - - - -
function ExecuteCb0xA9() {
    RES_R(LOW, BC, 5);
}
// RES 5, D
// Flags: - - - -
function ExecuteCb0xAA() {
    RES_R(HIGH, DE, 5);
}
// RES 5, E
// Flags: - - - -
function ExecuteCb0xAB() {
    RES_R(LOW, DE, 5);
}
// RES 5, H
// Flags: - - - -
function ExecuteCb0xAC() {
    RES_R(HIGH, HL, 5);
}
// RES 5, L
// Flags: - - - -
function ExecuteCb0xAD() {
    RES_R(LOW, HL, 5);
}
// RES 5, (HL)
// Flags: - - - -
function ExecuteCb0xAE() {
    RES__HL_(5);
}
// RES 5, A
// Flags: - - - -
function ExecuteCb0xAF() {
    RES_R(HIGH, AF, 5);
}
// RES 6, B
// Flags: - - - -
function ExecuteCb0xB0() {
    RES_R(HIGH, BC, 6);
}
// RES 6, C
// Flags: - - - -
function ExecuteCb0xB1() {
    RES_R(LOW, BC, 6);
}
// RES 6, D
// Flags: - - - -
function ExecuteCb0xB2() {
    RES_R(HIGH, DE, 6);
}
// RES 6, E
// Flags: - - - -
function ExecuteCb0xB3() {
    RES_R(LOW, DE, 6);
}
// RES 6, H
// Flags: - - - -
function ExecuteCb0xB4() {
    RES_R(HIGH, HL, 6);
}
// RES 6, L
// Flags: - - - -
function ExecuteCb0xB5() {
    RES_R(LOW, HL, 6);
}
// RES 6, (HL)
// Flags: - - - -
function ExecuteCb0xB6() {
    RES__HL_(6);
}
// RES 6, A
// Flags: - - - -
function ExecuteCb0xB7() {
    RES_R(HIGH, AF, 6);
}
// RES 7, B
// Flags: - - - -
function ExecuteCb0xB8() {
    RES_R(HIGH, BC, 7);
}
// RES 7, C
// Flags: - - - -
function ExecuteCb0xB9() {
    RES_R(LOW, BC, 7);
}
// RES 7, D
// Flags: - - - -
function ExecuteCb0xBA() {
    RES_R(HIGH, DE, 7);
}
// RES 7, E
// Flags: - - - -
function ExecuteCb0xBB() {
    RES_R(LOW, DE, 7);
}
// RES 7, H
// Flags: - - - -
function ExecuteCb0xBC() {
    RES_R(HIGH, AF, 7);
}
// RES 7, L
// Flags: - - - -
function ExecuteCb0xBD() {
    RES_R(LOW, HL, 7);
}
// RES 7, (HL)
// Flags: - - - -
function ExecuteCb0xBE() {
    RES__HL_(7);
}
// RES 7, A
// Flags: - - - -
function ExecuteCb0xBF() {
    RES_R(HIGH, AF, 7);
}
// SET 0, B
// Flags: - - - -
function ExecuteCb0xC0() {
    SET_R(HIGH, BC, 0);
}
// SET 0, C
// Flags: - - - -
function ExecuteCb0xC1() {
    SET_R(LOW, BC, 0);
}
// SET 0, D
// Flags: - - - -
function ExecuteCb0xC2() {
    SET_R(HIGH, DE, 0);
}
// SET 0, E
// Flags: - - - -
function ExecuteCb0xC3() {
    SET_R(LOW, DE, 0);
}
// SET 0, H
// Flags: - - - -
function ExecuteCb0xC4() {
    SET_R(HIGH, HL, 0);
}
// SET 0, L
// Flags: - - - -
function ExecuteCb0xC5() {
    SET_R(LOW, HL, 0);
}
// SET 0, (HL)
// Flags: - - - -
function ExecuteCb0xC6() {
    SET__HL_(0);
}
// SET 0, A
// Flags: - - - -
function ExecuteCb0xC7() {
    SET_R(HIGH, AF, 0);
}
// SET 1, B
// Flags: - - - -
function ExecuteCb0xC8() {
    SET_R(HIGH, BC, 1);
}
// SET 1, C
// Flags: - - - -
function ExecuteCb0xC9() {
    SET_R(LOW, BC, 1);
}
// SET 1, D
// Flags: - - - -
function ExecuteCb0xCA() {
    SET_R(HIGH, DE, 1);
}
// SET 1, E
// Flags: - - - -
function ExecuteCb0xCB() {
    SET_R(LOW, DE, 1);
}
// SET 1, H
// Flags: - - - -
function ExecuteCb0xCC() {
    SET_R(HIGH, HL, 1);
}
// SET 1, L
// Flags: - - - -
function ExecuteCb0xCD() {
    SET_R(LOW, HL, 1);
}
// SET 1, (HL)
// Flags: - - - -
function ExecuteCb0xCE() {
    SET__HL_(1);
}
// SET 1, A
// Flags: - - - -
function ExecuteCb0xCF() {
    SET_R(HIGH, AF, 1);
}
// SET 2, B
// Flags: - - - -
function ExecuteCb0xD0() {
    SET_R(HIGH, BC, 2);
}
// SET 2, C
// Flags: - - - -
function ExecuteCb0xD1() {
    SET_R(LOW, BC, 2);
}
// SET 2, D
// Flags: - - - -
function ExecuteCb0xD2() {
    SET_R(HIGH, DE, 2);
}
// SET 2, E
// Flags: - - - -
function ExecuteCb0xD3() {
    SET_R(LOW, DE, 2);
}
// SET 2, H
// Flags: - - - -
function ExecuteCb0xD4() {
    SET_R(HIGH, HL, 2);
}
// SET 2, L
// Flags: - - - -
function ExecuteCb0xD5() {
    SET_R(LOW, HL, 2);
}
// SET 2, (HL)
// Flags: - - - -
function ExecuteCb0xD6() {
    SET__HL_(2);
}
// SET 2, A
// Flags: - - - -
function ExecuteCb0xD7() {
    SET_R(HIGH, AF, 2);
}
// SET 3, B
// Flags: - - - -
function ExecuteCb0xD8() {
    SET_R(HIGH, BC, 3);
}
// SET 3, C
// Flags: - - - -
function ExecuteCb0xD9() {
    SET_R(LOW, BC, 3);
}
// SET 3, D
// Flags: - - - -
function ExecuteCb0xDA() {
    SET_R(HIGH, DE, 3);
}
// SET 3, E
// Flags: - - - -
function ExecuteCb0xDB() {
    SET_R(LOW, DE, 3);
}
// SET 3, H
// Flags: - - - -
function ExecuteCb0xDC() {
    SET_R(HIGH, HL, 3);
}
// SET 3, L
// Flags: - - - -
function ExecuteCb0xDD() {
    SET_R(LOW, HL, 3);
}
// SET 3, (HL)
// Flags: - - - -
function ExecuteCb0xDE() {
    SET__HL_(3);
}
// SET 3, A
// Flags: - - - -
function ExecuteCb0xDF() {
    SET_R(HIGH, AF, 3);
}
// SET 4, B
// Flags: - - - -
function ExecuteCb0xE0() {
    SET_R(HIGH, BC, 4);
}
// SET 4, C
// Flags: - - - -
function ExecuteCb0xE1() {
    SET_R(LOW, BC, 4);
}
// SET 4, D
// Flags: - - - -
function ExecuteCb0xE2() {
    SET_R(HIGH, DE, 4);
}
// SET 4, E
// Flags: - - - -
function ExecuteCb0xE3() {
    SET_R(LOW, DE, 4);
}
// SET 4, H
// Flags: - - - -
function ExecuteCb0xE4() {
    SET_R(HIGH, HL, 4);
}
// SET 4, L
// Flags: - - - -
function ExecuteCb0xE5() {
    SET_R(LOW, HL, 4);
}
// SET 4, (HL)
// Flags: - - - -
function ExecuteCb0xE6() {
    SET__HL_(4);
}
// SET 4, A
// Flags: - - - -
function ExecuteCb0xE7() {
    SET_R(HIGH, AF, 4);
}
// SET 5, B
// Flags: - - - -
function ExecuteCb0xE8() {
    SET_R(HIGH, BC, 5);
}
// SET 5, C
// Flags: - - - -
function ExecuteCb0xE9() {
    SET_R(LOW, BC, 5);
}
// SET 5, D
// Flags: - - - -
function ExecuteCb0xEA() {
    SET_R(HIGH, DE, 5);
}
// SET 5, E
// Flags: - - - -
function ExecuteCb0xEB() {
    SET_R(LOW, DE, 5);
}
// SET 5, H
// Flags: - - - -
function ExecuteCb0xEC() {
    SET_R(HIGH, HL, 5);
}
// SET 5, L
// Flags: - - - -
function ExecuteCb0xED() {
    SET_R(LOW, HL, 5);
}
// SET 5, (HL)
// Flags: - - - -
function ExecuteCb0xEE() {
    SET__HL_(5);
}
// SET 5, A
// Flags: - - - -
function ExecuteCb0xEF() {
    SET_R(HIGH, AF, 5);
}
// SET 6, B
// Flags: - - - -
function ExecuteCb0xF0() {
    SET_R(HIGH, BC, 6);
}
// SET 6, C
// Flags: - - - -
function ExecuteCb0xF1() {
    SET_R(LOW, BC, 6);
}
// SET 6, D
// Flags: - - - -
function ExecuteCb0xF2() {
    SET_R(HIGH, DE, 6);
}
// SET 6, E
// Flags: - - - -
function ExecuteCb0xF3() {
    SET_R(LOW, DE, 6);
}
// SET 6, H
// Flags: - - - -
function ExecuteCb0xF4() {
    SET_R(HIGH, HL, 6);
}
// SET 6, L
// Flags: - - - -
function ExecuteCb0xF5() {
    SET_R(LOW, HL, 6);
}
// SET 6, (HL)
// Flags: - - - -
function ExecuteCb0xF6() {
    SET__HL_(6);
}
// SET 6, A
// Flags: - - - -
function ExecuteCb0xF7() {
    SET_R(HIGH, AF, 6);
}
// SET 7, B
// Flags: - - - -
function ExecuteCb0xF8() {
    SET_R(HIGH, BC, 7);
}
// SET 7, C
// Flags: - - - -
function ExecuteCb0xF9() {
    SET_R(LOW, BC, 7);
}
// SET 7, D
// Flags: - - - -
function ExecuteCb0xFA() {
    SET_R(HIGH, DE, 7);
}
// SET 7, E
// Flags: - - - -
function ExecuteCb0xFB() {
    SET_R(LOW, DE, 7);
}
// SET 7, H
// Flags: - - - -
function ExecuteCb0xFC() {
    SET_R(HIGH, HL, 7);
}
// SET 7, L
// Flags: - - - -
function ExecuteCb0xFD() {
    SET_R(LOW, HL, 7);
}
// SET 7, (HL)
// Flags: - - - -
function ExecuteCb0xFE() {
    SET__HL_(7);
}
// SET 7, A
// Flags: - - - -
function ExecuteCb0xFF() {
    SET_R(HIGH, AF, 7);
}
