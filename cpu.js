// Constants
const CLK_F         = 4194304;  // Clock frequency (Hz)
const RAM_SIZE      = 8 * 1024; // 8 KB
const REGISTER_SIZE = 2;        // Bytes

// Memory
var RamBuffer     = new ArrayBuffer(RAM_SIZE);
var Ram           = new DataView(RamBuffer);
var EchoRamBuffer = new ArrayBuffer(RAM_SIZE);
var EchoRam       = new DataView(EchoRamBuffer);
var Rom;
var Instruction   = 0x00;

// Helpers
var RomReader   = new FileReader();

// Flags
var Debug                 = true;
var InterruptMasterEnable = false;

// ReadRom()
//
// IN:  n/a
// OUT: n/a
//
// DESCRIPTION:
// Reads a rom into the Rom variable and starts the CPU.
//
// NOTES:
// In debug mode this will simply read the value of Rom[PC] and update 
// the UI waiting for the user to manually fetch and decode instructions.
//
function ReadRom() {
    RomReader.onload = function () 
    {
        Rom = new DataView(RomReader.result);

        if (Debug) 
            UpdateNextVarUI();
        else
            RunGamePerson();
    };
    RomReader.readAsArrayBuffer(document.getElementById("RomFileInput").files[0]);
}

// RunGamePerson()
//
// IN:  n/a
// OUT: n/a
//
// DESCRIPTION:
// Main CPU loop. Fetches 8-bit instructions from where PC
// points to, starting at ROM 0x0100, and executes them.
//
function RunGamePerson() {
    while (true) {
        // TODO: HandleInterrupts();
        FetchAndDecode();
        Execute();
    }
}

// FetchAndDecode()
//
// IN:  n/a
// OUT: n/a
//
// DESCRIPTION:
// Fetches and decodes the next 8-bit instruction.
//
// NOTES:
// Debug UI is updated if Debug flag is set.
//
function FetchAndDecode() {
    Instruction = ReadAndIncrementPC8Bit();
    if(Debug) UpdateDebugUI();
}

// Execute()
//
// IN:  n/a
// OUT: n/a
//
// DESCRIPTION:
// Executes the last decoded instruction.
//
// NOTES:
// Debug UI is updated if Debug flag is set.
//
function Execute() {
    ExecuteInstruction(Instruction);
    if(Debug) UpdateDebugUI();
}

// Read8BitPcValue()
//
// IN:  n/a
// OUT: 8-bit value pointed to by PC
//
// DESCRIPTION:
// Reads the 8-bit value pointed to by PC and
// increments PC by 1.
//
function ReadAndIncrementPC8Bit() {
    let jackson_sux = Read16BitReg(PC);
    Write16BitReg(PC, Read16BitReg(PC) + 1);
    return Rom.getUint8(jackson_sux);
}

// ReadAndIncrementPC8BitSigned()
//
// IN:  n/a
// OUT: 8-bit signed value pointed to by PC
//
// DESCRIPTION:
// Reads the 8-bit signed value pointed to by PC and
// increments PC by 1.
//
function ReadAndIncrementPC8BitSigned() {
    let jackson_sux = Read16BitReg(PC);
    Write16BitReg(PC, Read16BitReg(PC) + 1);
    return Rom.getInt8(jackson_sux);
}

// Read16BitPcValue()
//
// IN:  n/a
// OUT: 16-bit value pointed to by PC
//
// DESCRIPTION:
// Reads the 16-bit value pointed to by PC and
// increments PC by 2.
//
function ReadAndIncrementPC16Bit() {
    let jackson_sux = Read16BitReg(PC);
    Write16BitReg(PC, Read16BitReg(PC) + 2);
    return Rom.getUint16(jackson_sux, LITTLE_ENDIAN);
}

// ReadAddress(address)
//
// IN:  address: 16-bit address to read from
// OUT: 8-bit value pointed to by address
//
// DESCRIPTION:
// Reads the 8-bit value pointed to by address.
//
// NOTES:
// https://gbdev.gg8.se/wiki/articles/Memory_Map
//
function ReadAddress(address) {
    if (address > 0xFFFE) {        // (FFFF-FFFF) Interrupts Enable Register (IE)

    } else if (address > 0xFF7F) { // (FF80-FFFE) High RAM (HRAM)

    } else if (address > 0xFEFF) { // (FF00-FF7F) I/O Registers

    } else if (address > 0xFE9F) { // (FEA0-FEFF) Not Usable

    } else if (address > 0xFDFF) { // (FE00-FE9F) Sprite attribute table (OAM)

    } else if (address > 0xDFFF) { // (E000-FDFF) Mirror of C000~DDFF (ECHO RAM) Typically not used

    } else if (address > 0xBFFF) { // (C000-DFFF) 8KB Work RAM (WRAM) bank 0+1	
        address -= 0xC000;
        return Ram.getUint8(address);
    } else if (address > 0x9FFF) { // (A000-BFFF) 8KB External RAM In cartridge, switchable bank if any

    } else if (address > 0x7FFF) { // (8000-9FFF) 8KB Video RAM (VRAM) Only bank 0 in Non-CGB mode

    } else {                       // (0000-3FFF) 16KB ROM bank 00 From cartridge, usually a fixed bank
        // address -= 0;
        return Rom.getUint8(address);
    }
}

// WriteAddress(address, val)
//
// IN:  address: 16-bit address to write to
//      val:     8-bit value to write
// OUT: n/a
//
// DESCRIPTION:
// Writes the 8-bit value val to the address pointed to by address.
//
// NOTES:
// https://gbdev.gg8.se/wiki/articles/Memory_Map
//
function WriteAddress(address, val) {
    if (address > 0xFFFE) {        // (FFFF-FFFF) Interrupts Enable Register (IE)

    } else if (address > 0xFF7F) { // (FF80-FFFE)   High RAM (HRAM)

    } else if (address > 0xFEFF) { // (FF00-FF7F)   I/O Registers

    } else if (address > 0xFE9F) { // (FEA0-FEFF)   Not Usable

    } else if (address > 0xFDFF) { // (FE00-FE9F)   Sprite attribute table (OAM)

    } else if (address > 0xDFFF) { // (E000-FDFF)   Mirror of C000~DDFF (ECHO RAM)	Typically not used

    } else if (address > 0xBFFF) { // (C000-DFFF)   8KB Work RAM (WRAM) bank 0+1
        address -= 0xC000;
        Ram.setUint8(address, val);
        return;
    } else if (address > 0x9FFF) { // (A000-BFFF)   8KB External RAM	In cartridge, switchable bank if any

    } else if (address > 0x7FFF) { // (8000-9FFF)   8KB Video RAM (VRAM)	Only bank 0 in Non-CGB mode

    } else {                       // (0000-3FFF)	16KB ROM bank 00	From cartridge, usually a fixed bank
        //address -= 0;
        Rom.setUint8(address, val);
        return;
    }
}

// ExecuteInstruction(opcode)
//
// IN:  opcode: CPU instruction code
// OUT: n/a
//
// DESCRIPTION:
// Executes the CPU instruction specified by opcode.
//
// NOTES:
// https://meganesulli.com/generate-gb-opcodes/
//
function ExecuteInstruction(opcode) {
    switch (opcode) {
        case 0x00: Execute0x00(); break; case 0x01: Execute0x01(); break; case 0x02: Execute0x02(); break; case 0x03: Execute0x03(); break; case 0x04: Execute0x04(); break; case 0x05: Execute0x05(); break; case 0x06: Execute0x06(); break; case 0x07: Execute0x07(); break; case 0x08: Execute0x08(); break; case 0x09: Execute0x09(); break; case 0x0A: Execute0x0A(); break; case 0x0B: Execute0x0B(); break; case 0x0C: Execute0x0C(); break; case 0x0D: Execute0x0D(); break; case 0x0E: Execute0x0E(); break; case 0x0F: Execute0x0F(); break;
        case 0x10: Execute0x10(); break; case 0x11: Execute0x11(); break; case 0x12: Execute0x12(); break; case 0x13: Execute0x13(); break; case 0x14: Execute0x14(); break; case 0x15: Execute0x15(); break; case 0x16: Execute0x16(); break; case 0x17: Execute0x17(); break; case 0x18: Execute0x18(); break; case 0x19: Execute0x19(); break; case 0x1A: Execute0x1A(); break; case 0x1B: Execute0x1B(); break; case 0x1C: Execute0x1C(); break; case 0x1D: Execute0x1D(); break; case 0x1E: Execute0x1E(); break; case 0x1F: Execute0x1F(); break;
        case 0x20: Execute0x20(); break; case 0x21: Execute0x21(); break; case 0x22: Execute0x22(); break; case 0x23: Execute0x23(); break; case 0x24: Execute0x24(); break; case 0x25: Execute0x25(); break; case 0x26: Execute0x26(); break; case 0x27: Execute0x27(); break; case 0x28: Execute0x28(); break; case 0x29: Execute0x29(); break; case 0x2A: Execute0x2A(); break; case 0x2B: Execute0x2B(); break; case 0x2C: Execute0x2C(); break; case 0x2D: Execute0x2D(); break; case 0x2E: Execute0x2E(); break; case 0x2F: Execute0x2F(); break;
        case 0x30: Execute0x30(); break; case 0x31: Execute0x31(); break; case 0x32: Execute0x32(); break; case 0x33: Execute0x33(); break; case 0x34: Execute0x34(); break; case 0x35: Execute0x35(); break; case 0x36: Execute0x36(); break; case 0x37: Execute0x37(); break; case 0x38: Execute0x38(); break; case 0x39: Execute0x39(); break; case 0x3A: Execute0x3A(); break; case 0x3B: Execute0x3B(); break; case 0x3C: Execute0x3C(); break; case 0x3D: Execute0x3D(); break; case 0x3E: Execute0x3E(); break; case 0x3F: Execute0x3F(); break;
        case 0x40: Execute0x40(); break; case 0x41: Execute0x41(); break; case 0x42: Execute0x42(); break; case 0x43: Execute0x43(); break; case 0x44: Execute0x44(); break; case 0x45: Execute0x45(); break; case 0x46: Execute0x46(); break; case 0x47: Execute0x47(); break; case 0x48: Execute0x48(); break; case 0x49: Execute0x49(); break; case 0x4A: Execute0x4A(); break; case 0x4B: Execute0x4B(); break; case 0x4C: Execute0x4C(); break; case 0x4D: Execute0x4D(); break; case 0x4E: Execute0x4E(); break; case 0x4F: Execute0x4F(); break;
        case 0x50: Execute0x50(); break; case 0x51: Execute0x51(); break; case 0x52: Execute0x52(); break; case 0x53: Execute0x53(); break; case 0x54: Execute0x54(); break; case 0x55: Execute0x55(); break; case 0x56: Execute0x56(); break; case 0x57: Execute0x57(); break; case 0x58: Execute0x58(); break; case 0x59: Execute0x59(); break; case 0x5A: Execute0x5A(); break; case 0x5B: Execute0x5B(); break; case 0x5C: Execute0x5C(); break; case 0x5D: Execute0x5D(); break; case 0x5E: Execute0x5E(); break; case 0x5F: Execute0x5F(); break;
        case 0x60: Execute0x60(); break; case 0x61: Execute0x61(); break; case 0x62: Execute0x62(); break; case 0x63: Execute0x63(); break; case 0x64: Execute0x64(); break; case 0x65: Execute0x65(); break; case 0x66: Execute0x66(); break; case 0x67: Execute0x67(); break; case 0x68: Execute0x68(); break; case 0x69: Execute0x69(); break; case 0x6A: Execute0x6A(); break; case 0x6B: Execute0x6B(); break; case 0x6C: Execute0x6C(); break; case 0x6D: Execute0x6D(); break; case 0x6E: Execute0x6E(); break; case 0x6F: Execute0x6F(); break;
        case 0x70: Execute0x70(); break; case 0x71: Execute0x71(); break; case 0x72: Execute0x72(); break; case 0x73: Execute0x73(); break; case 0x74: Execute0x74(); break; case 0x75: Execute0x75(); break; case 0x76: Execute0x76(); break; case 0x77: Execute0x77(); break; case 0x78: Execute0x78(); break; case 0x79: Execute0x79(); break; case 0x7A: Execute0x7A(); break; case 0x7B: Execute0x7B(); break; case 0x7C: Execute0x7C(); break; case 0x7D: Execute0x7D(); break; case 0x7E: Execute0x7E(); break; case 0x7F: Execute0x7F(); break;
        case 0x80: Execute0x80(); break; case 0x81: Execute0x81(); break; case 0x82: Execute0x82(); break; case 0x83: Execute0x83(); break; case 0x84: Execute0x84(); break; case 0x85: Execute0x85(); break; case 0x86: Execute0x86(); break; case 0x87: Execute0x87(); break; case 0x88: Execute0x88(); break; case 0x89: Execute0x89(); break; case 0x8A: Execute0x8A(); break; case 0x8B: Execute0x8B(); break; case 0x8C: Execute0x8C(); break; case 0x8D: Execute0x8D(); break; case 0x8E: Execute0x8E(); break; case 0x8F: Execute0x8F(); break;
        case 0x90: Execute0x90(); break; case 0x91: Execute0x91(); break; case 0x92: Execute0x92(); break; case 0x93: Execute0x93(); break; case 0x94: Execute0x94(); break; case 0x95: Execute0x95(); break; case 0x96: Execute0x96(); break; case 0x97: Execute0x97(); break; case 0x98: Execute0x98(); break; case 0x99: Execute0x99(); break; case 0x9A: Execute0x9A(); break; case 0x9B: Execute0x9B(); break; case 0x9C: Execute0x9C(); break; case 0x9D: Execute0x9D(); break; case 0x9E: Execute0x9E(); break; case 0x9F: Execute0x9F(); break;
        case 0xA0: Execute0xA0(); break; case 0xA1: Execute0xA1(); break; case 0xA2: Execute0xA2(); break; case 0xA3: Execute0xA3(); break; case 0xA4: Execute0xA4(); break; case 0xA5: Execute0xA5(); break; case 0xA6: Execute0xA6(); break; case 0xA7: Execute0xA7(); break; case 0xA8: Execute0xA8(); break; case 0xA9: Execute0xA9(); break; case 0xAA: Execute0xAA(); break; case 0xAB: Execute0xAB(); break; case 0xAC: Execute0xAC(); break; case 0xAD: Execute0xAD(); break; case 0xAE: Execute0xAE(); break; case 0xAF: Execute0xAF(); break;
        case 0xB0: Execute0xB0(); break; case 0xB1: Execute0xB1(); break; case 0xB2: Execute0xB2(); break; case 0xB3: Execute0xB3(); break; case 0xB4: Execute0xB4(); break; case 0xB5: Execute0xB5(); break; case 0xB6: Execute0xB6(); break; case 0xB7: Execute0xB7(); break; case 0xB8: Execute0xB8(); break; case 0xB9: Execute0xB9(); break; case 0xBA: Execute0xBA(); break; case 0xBB: Execute0xBB(); break; case 0xBC: Execute0xBC(); break; case 0xBD: Execute0xBD(); break; case 0xBE: Execute0xBE(); break; case 0xBF: Execute0xBF(); break;
        case 0xC0: Execute0xC0(); break; case 0xC1: Execute0xC1(); break; case 0xC2: Execute0xC2(); break; case 0xC3: Execute0xC3(); break; case 0xC4: Execute0xC4(); break; case 0xC5: Execute0xC5(); break; case 0xC6: Execute0xC6(); break; case 0xC7: Execute0xC7(); break; case 0xC8: Execute0xC8(); break; case 0xC9: Execute0xC9(); break; case 0xCA: Execute0xCA(); break; case 0xCB: Execute0xCB(); break; case 0xCC: Execute0xCC(); break; case 0xCD: Execute0xCD(); break; case 0xCE: Execute0xCE(); break; case 0xCF: Execute0xCF(); break;
        case 0xD0: Execute0xD0(); break; case 0xD1: Execute0xD1(); break; case 0xD2: Execute0xD2(); break; case 0xD3: Execute0xD3(); break; case 0xD4: Execute0xD4(); break; case 0xD5: Execute0xD5(); break; case 0xD6: Execute0xD6(); break; case 0xD7: Execute0xD7(); break; case 0xD8: Execute0xD8(); break; case 0xD9: Execute0xD9(); break; case 0xDA: Execute0xDA(); break; case 0xDB: Execute0xDB(); break; case 0xDC: Execute0xDC(); break; case 0xDD: Execute0xDD(); break; case 0xDE: Execute0xDE(); break; case 0xDF: Execute0xDF(); break;
        case 0xE0: Execute0xE0(); break; case 0xE1: Execute0xE1(); break; case 0xE2: Execute0xE2(); break; case 0xE3: Execute0xE3(); break; case 0xE4: Execute0xE4(); break; case 0xE5: Execute0xE5(); break; case 0xE6: Execute0xE6(); break; case 0xE7: Execute0xE7(); break; case 0xE8: Execute0xE8(); break; case 0xE9: Execute0xE9(); break; case 0xEA: Execute0xEA(); break; case 0xEB: Execute0xEB(); break; case 0xEC: Execute0xEC(); break; case 0xED: Execute0xED(); break; case 0xEE: Execute0xEE(); break; case 0xEF: Execute0xEF(); break;
        case 0xF0: Execute0xF0(); break; case 0xF1: Execute0xF1(); break; case 0xF2: Execute0xF2(); break; case 0xF3: Execute0xF3(); break; case 0xF4: Execute0xF4(); break; case 0xF5: Execute0xF5(); break; case 0xF6: Execute0xF6(); break; case 0xF7: Execute0xF7(); break; case 0xF8: Execute0xF8(); break; case 0xF9: Execute0xF9(); break; case 0xFA: Execute0xFA(); break; case 0xFB: Execute0xFB(); break; case 0xFC: Execute0xFC(); break; case 0xFD: Execute0xFD(); break; case 0xFE: Execute0xFE(); break; case 0xFF: Execute0xFF(); break;
    }
}
