/*
Register Description
15          0
|  H  |  L  |

Memory Array (Little Endian)
0           15
|  L  |  H  |
*/
const LITTLE_ENDIAN = true;
const HIGH = 1;
const LOW  = 0;

// Constants
const RESET_VECTOR = 0x0100;
const STACK_VECTOR = 0xFFFE;
const AF_BOOT      = 0x01B0;
const BC_BOOT      = 0x0013;
const DE_BOOT      = 0x00D8;
const HL_BOOT      = 0x014D;

// Program Counter
const PCBuffer = new ArrayBuffer(2);
const PC = new DataView(PCBuffer);
Write16BitReg(PC, RESET_VECTOR);

// Stack Pointer
const SPBuffer = new ArrayBuffer(2);
const SP = new DataView(SPBuffer);
Write16BitReg(SP, STACK_VECTOR);

// AF - Accumulator/Flags
const AFBuffer = new ArrayBuffer(2);
const AF = new DataView(AFBuffer);
Write16BitReg(AF, AF_BOOT);
const F_Z = 7; // Zero flag bit
const F_N = 6; // Subtraction flag bit
const F_H = 5; // Half carry flag bit
const F_C = 4; // Carry flag bit

// BC - Gen Storage
const BCBuffer = new ArrayBuffer(2);
const BC = new DataView(BCBuffer);
Write16BitReg(BC, BC_BOOT);

// DE - Gen Storage
const DEBuffer = new ArrayBuffer(2);
const DE = new DataView(DEBuffer);
Write16BitReg(DE, DE_BOOT);

// HL - Address Pointer
const HLBuffer = new ArrayBuffer(2);
const HL = new DataView(HLBuffer);
Write16BitReg(HL, HL_BOOT);

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
// e.g. var regAVal = Read8BitReg(HIGH, AF);
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
// e.g. Write8BitReg(HIGH, AF, 0xFF);
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
    let jackson_sux = Read8BitReg(LOW, AF) | (1 << F);
    Write8BitReg(LOW, AF, jackson_sux);
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
    let jackson_sux = Read8BitReg(LOW, AF) & ~(1 << F);
    Write8BitReg(LOW, AF, jackson_sux);
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
    return Read8BitReg(LOW, AF) & (1 << F);
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
    if (val == 0) SetFlag(F_Z);
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
    if(val2 >= 0) {
        if ((((val1 & 0xf) + (val2 & 0xf)) & 0x10)) SetFlag(F_H);
        else ResetFlag(F_H);
    } else {
        if ((((val1 & 0xf) - (-val2 & 0xf)) & 0x10)) SetFlag(F_H);
        else ResetFlag(F_H);
    }
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
    if (val2 >= 0) {
        if ((((val1 & 0xfff) + (val2 & 0xfff)) & 0x1000)) SetFlag(F_H);
        else ResetFlag(F_H);
    } else {
        if ((((val1 & 0xfff) - (-val2 & 0xfff)) & 0x1000)) SetFlag(F_H);
        else ResetFlag(F_H);
    }
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
    if (result > 0xFF || result < 0) SetFlag(F_C);
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
    if (result > 0xFFFF || result < 0) SetFlag(F_C);
    else ResetFlag(F_C);
}
