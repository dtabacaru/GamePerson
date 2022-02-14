// Constants
const RESET_VECTOR = 0x0100; // ROM application starts at 0x0100. Skip the boot rom.
const STACK_VECTOR = 0xFFFE;
const LITTLE_ENDIAN = true;
const HIGH = 0;
const LOW = 1;

// Program Counter
const PCBuffer = new ArrayBuffer(2);
const PC = new DataView(PCBuffer);
const P = HIGH;
const C = LOW;
Write16BitReg(PC, RESET_VECTOR);

// Stack Pointer
const SPBuffer = new ArrayBuffer(2);
const SP = new DataView(SPBuffer);
Write16BitReg(SP, STACK_VECTOR);

// AF - Accumulator/Flags
const AFBuffer = new ArrayBuffer(2);
const AF = new DataView(AFBuffer);
const F = HIGH;
const A = LOW;
const F_Z = 7; // bit
const F_N = 6; // bit
const F_H = 5; // bit
const F_C = 4; // bit

// BC - Gen Storage
const BCBuffer = new ArrayBuffer(2);
const BC = new DataView(BCBuffer);
const C = HIGH;
const B = LOW;

// DE - Gen Storage
const DEBuffer = new ArrayBuffer(2);
const DE = new DataView(DEBuffer);
const E = HIGH;
const D = LOW;

// HL - Address Pointer
const HLBuffer = new ArrayBuffer(2);
const HL = new DataView(HLBuffer);
const L = HIGH;
const H = LOW;

// Read16BitReg(RR)
//
// IN:  RR: 16-bit register to read (DataView)
// OUT: 16-bit value of register (Int)
//
// DESCRIPTION:
// Reads the 16-bit value of register RR.
//
function Read16BitReg(RR) {
    return RR.getUint16(0, LITTLE_ENDIAN);
}

// Write16BitReg(RR, val)
//
// IN:  RR:  16-bit register to write (DataView)
//      val: value to write (Int)
// OUT: n/a
//
// DESCRIPTION:
// Writes the value val to 16-bit register RR.
//
function Write16BitReg(RR, val) {
    RR.setUint16(0, val, LITTLE_ENDIAN);
}

// Read8BitReg(R, RR)
//
// IN:  R:  Index of 8-bit register within 16-bit register (Int)
//      RR: 16-bit register that contains 8-bit register  (DataView)
// OUT: 8-bit value of register (Int)
//
// DESCRIPTION:
// Reads the 8-bit value of register R.
//
// NOTES:
// Indices are defined above and can be accessed easily
// e.g. var regAVal = Read8BitReg(A, AF);
//
function Read8BitReg(R, RR) {
    return RR.getUint8(R);
}

// Write8BitReg(R, RR, val)
//
// IN:  R:   Index of 8-bit register within 16-bit register (Int)
//      RR:  16-bit register that contains 8-bit register (DataView)
//      val: value to write (Int)
// OUT: n/a
//
// DESCRIPTION:
// Writes the value val to 8-bit register R.
//
// NOTES:
// Indices are defined above and can be accessed easily
// e.g. Write8BitReg(A, AF, 0xFF);
//
function Write8BitReg(R, RR, val) {
    return RR.setUint8(R, val);
}

// SetFlag(F)
//
// IN:  F:   Index of flag to set
// OUT: n/a
//
// DESCRIPTION:
// Sets flag F.
//
// NOTES:
// Indices are defined above and can be accessed easily
// e.g. SetFlag(F_N);
//
function SetFlag(F) {
    let jackson_sux = Read8BitReg(F, AF) | (1 << F);
    Write8BitReg(F, AF, jackson_sux);
}

// ResetFlag(F)
//
// IN:  F:   Index of flag to reset
// OUT: n/a
//
// DESCRIPTION:
// Resets flag F.
//
// NOTES:
// Indices are defined above and can be accessed easily
// e.g. ResetFlag(F_N);
//
function ResetFlag(F) {
    let jackson_sux = Read8BitReg(F, AF) & ~(1 << F);
    Write8BitReg(F, AF, jackson_sux);
}

// ReadFlag(F)
//
// IN:  F:   Index of flag to read
// OUT: Value of flag
//
// DESCRIPTION:
// Reads flag F.
//
// NOTES:
// Indices are defined above and can be accessed easily
// e.g. ReadFlag(F_N);
//
function ReadFlag(F) {
    return Read8BitReg(F, AF) & (1 << F);
}

// SetZeroFlag(val)
//
// IN:  val1: value to check
// OUT: n/a
//
// Description:
// Sets the zero flag if val is zero, otherwise resets it.
//
function SetZeroFlag(val) {
    if (!val) SetFlag(F_Z);
    else ResetFlag(F_Z);
}

// SetSubtractionFlag(val)
//
// IN:  val1: value to check
// OUT: n/a
//
// Description:
// Sets the subtraction flag if val is negative, otherwise resets it.
//
function SetSubtractionFlag(val) {
    if (val < 0) SetFlag(F_N);
    else ResetFlag(F_N);
}

// SetHalfCarry(val1, val2)
//
// IN:  val1: value of first opearand
//      val2: value of second operand
// OUT: n/a
//
// Description:
// Sets the half carry flag if val1 + val2 carries bit 4, otherwise resets it
//
function SetHalfCarryFlagBit3To4(val1, val2) {
    if ((((val1 & 0xf) + (val2 & 0xf)) & 0x10) == 0x10) SetFlag(F_H);
    else ResetFlag(F_H);
}

// SetHalfCarryFlagBit11To12(val1, val2)
//
// IN:  val1: value of first opearand
//      val2: value of second operand
// OUT: n/a
//
// Description:
// Sets the half carry flag if val1 + val2 carries bit 12, otherwise resets it
//
function SetHalfCarryFlagBit11To12(val1, val2) {
    if (((((val1>>8) & 0xf) + ((val2>>8) & 0xf)) & 0x10) == 0x10) SetFlag(F_H);
    else ResetFlag(F_H);
}

// SetCarryFlag8Bit(result)
//
// IN:  result: result of operation
// OUT: n/a
//
// Description:
// Sets the carry flag if result is > 0xFF, otherwise resets it
//
function SetCarryFlag8Bit(result) {
    if (result > 0xFF) SetFlag(F_C);
    else ResetFlag(F_C);
}

// SetCarryFlag16Bit(result)
//
// IN:  result: result of operation
// OUT: n/a
//
// Description:
// Sets the carry flag if result is > 0xFFFF, otherwise resets it
//
function SetCarryFlag16Bit(result) {
    if (result > 0xFFFF) SetFlag(F_C);
    else ResetFlag(F_C);
}
