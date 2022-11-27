// Constants
const CLK_F         = 4194304;  // Clock frequency (Hz)
const RAM_SIZE      = 8 * 1024; // 8 KB

// Memory
const RamBuffer     = new ArrayBuffer(RAM_SIZE);
const Ram           = new DataView(RamBuffer);
const EchoRamBuffer = new ArrayBuffer(RAM_SIZE);
const EchoRam       = new DataView(EchoRamBuffer);
const RomReader     = new FileReader();
var   Rom;
var   Instruction   = 0x00;

// Flags
var Halt                  = false;
var Interrupt             = false;
var InterruptMasterEnable = false;

const Debug               = true; // TODO: Disable this one day...

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

    while (Halt) {
        // Wait
    }

    if (Interrupt) {
        HandleInterrupts();
    }

    ExecuteInstruction(Instruction);
    if(Debug) UpdateDebugUI();
}

function HandleInterrupts() {
    // TODO
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
    Write16BitReg(PC, jackson_sux + 1);
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
    Write16BitReg(PC, jackson_sux + 1);
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
    Write16BitReg(PC, jackson_sux + 2);
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
        address -= 0xFFFF;
    } else if (address > 0xFF7F) { // (FF80-FFFE) High RAM (HRAM)
        address -= 0xFF80;
    } else if (address > 0xFEFF) { // (FF00-FF7F) I/O Registers
        address -= 0xFF00;
    } else if (address > 0xFE9F) { // (FEA0-FEFF) Not Usable
        address -= 0xFEA0;
    } else if (address > 0xFDFF) { // (FE00-FE9F) Sprite attribute table (OAM)
        address -= 0xFE00;
    } else if (address > 0xDFFF) { // (E000-FDFF) Mirror of C000~DDFF (ECHO RAM) Typically not used
        address -= 0xE000;
    } else if (address > 0xBFFF) { // (C000-DFFF) 8KB Work RAM (WRAM) bank 0+1	
        address -= 0xC000;
        return Ram.getUint8(address);
    } else if (address > 0x9FFF) { // (A000-BFFF) 8KB External RAM In cartridge, switchable bank if any
        address -= 0xA000;
    } else if (address > 0x7FFF) { // (8000-9FFF) 8KB Video RAM (VRAM) Only bank 0 in Non-CGB mode
        address -= 0x8000;
    } else {                       // (0000-3FFF) 16KB ROM bank 00 From cartridge, usually a fixed bank
        // address -= 0x0000;
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
        address -= 0xFFFF;
    } else if (address > 0xFF7F) { // (FF80-FFFE)   High RAM (HRAM)
        address -= 0xFF80;
    } else if (address > 0xFEFF) { // (FF00-FF7F)   I/O Registers
        address -= 0xFF00;
    } else if (address > 0xFE9F) { // (FEA0-FEFF)   Not Usable
        address -= 0xFEA0;
    } else if (address > 0xFDFF) { // (FE00-FE9F)   Sprite attribute table (OAM)
        address -= 0xFE00;
    } else if (address > 0xDFFF) { // (E000-FDFF)   Mirror of C000~DDFF (ECHO RAM)	Typically not used
        address -= 0xE000;
    } else if (address > 0xBFFF) { // (C000-DFFF)   8KB Work RAM (WRAM) bank 0+1
        address -= 0xC000;
        Ram.setUint8(address, val);
    } else if (address > 0x9FFF) { // (A000-BFFF)   8KB External RAM	In cartridge, switchable bank if any
        address -= 0xA000;
    } else if (address > 0x7FFF) { // (8000-9FFF)   8KB Video RAM (VRAM)	Only bank 0 in Non-CGB mode
        address -= 0x8000;
    } else {                       // (0000-3FFF)	16KB ROM bank 00	From cartridge, usually a fixed bank
        //address -= 0x0000;
        Rom.setUint8(address, val);
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
        case 0x00: Op0x00(); break; case 0x01: Op0x01(); break; case 0x02: Op0x02(); break; case 0x03: Op0x03(); break; case 0x04: Op0x04(); break; case 0x05: Op0x05(); break; case 0x06: Op0x06(); break; case 0x07: Op0x07(); break; case 0x08: Op0x08(); break; case 0x09: Op0x09(); break; case 0x0A: Op0x0A(); break; case 0x0B: Op0x0B(); break; case 0x0C: Op0x0C(); break; case 0x0D: Op0x0D(); break; case 0x0E: Op0x0E(); break; case 0x0F: Op0x0F(); break;
        case 0x10: Op0x10(); break; case 0x11: Op0x11(); break; case 0x12: Op0x12(); break; case 0x13: Op0x13(); break; case 0x14: Op0x14(); break; case 0x15: Op0x15(); break; case 0x16: Op0x16(); break; case 0x17: Op0x17(); break; case 0x18: Op0x18(); break; case 0x19: Op0x19(); break; case 0x1A: Op0x1A(); break; case 0x1B: Op0x1B(); break; case 0x1C: Op0x1C(); break; case 0x1D: Op0x1D(); break; case 0x1E: Op0x1E(); break; case 0x1F: Op0x1F(); break;
        case 0x20: Op0x20(); break; case 0x21: Op0x21(); break; case 0x22: Op0x22(); break; case 0x23: Op0x23(); break; case 0x24: Op0x24(); break; case 0x25: Op0x25(); break; case 0x26: Op0x26(); break; case 0x27: Op0x27(); break; case 0x28: Op0x28(); break; case 0x29: Op0x29(); break; case 0x2A: Op0x2A(); break; case 0x2B: Op0x2B(); break; case 0x2C: Op0x2C(); break; case 0x2D: Op0x2D(); break; case 0x2E: Op0x2E(); break; case 0x2F: Op0x2F(); break;
        case 0x30: Op0x30(); break; case 0x31: Op0x31(); break; case 0x32: Op0x32(); break; case 0x33: Op0x33(); break; case 0x34: Op0x34(); break; case 0x35: Op0x35(); break; case 0x36: Op0x36(); break; case 0x37: Op0x37(); break; case 0x38: Op0x38(); break; case 0x39: Op0x39(); break; case 0x3A: Op0x3A(); break; case 0x3B: Op0x3B(); break; case 0x3C: Op0x3C(); break; case 0x3D: Op0x3D(); break; case 0x3E: Op0x3E(); break; case 0x3F: Op0x3F(); break;
        case 0x40: Op0x40(); break; case 0x41: Op0x41(); break; case 0x42: Op0x42(); break; case 0x43: Op0x43(); break; case 0x44: Op0x44(); break; case 0x45: Op0x45(); break; case 0x46: Op0x46(); break; case 0x47: Op0x47(); break; case 0x48: Op0x48(); break; case 0x49: Op0x49(); break; case 0x4A: Op0x4A(); break; case 0x4B: Op0x4B(); break; case 0x4C: Op0x4C(); break; case 0x4D: Op0x4D(); break; case 0x4E: Op0x4E(); break; case 0x4F: Op0x4F(); break;
        case 0x50: Op0x50(); break; case 0x51: Op0x51(); break; case 0x52: Op0x52(); break; case 0x53: Op0x53(); break; case 0x54: Op0x54(); break; case 0x55: Op0x55(); break; case 0x56: Op0x56(); break; case 0x57: Op0x57(); break; case 0x58: Op0x58(); break; case 0x59: Op0x59(); break; case 0x5A: Op0x5A(); break; case 0x5B: Op0x5B(); break; case 0x5C: Op0x5C(); break; case 0x5D: Op0x5D(); break; case 0x5E: Op0x5E(); break; case 0x5F: Op0x5F(); break;
        case 0x60: Op0x60(); break; case 0x61: Op0x61(); break; case 0x62: Op0x62(); break; case 0x63: Op0x63(); break; case 0x64: Op0x64(); break; case 0x65: Op0x65(); break; case 0x66: Op0x66(); break; case 0x67: Op0x67(); break; case 0x68: Op0x68(); break; case 0x69: Op0x69(); break; case 0x6A: Op0x6A(); break; case 0x6B: Op0x6B(); break; case 0x6C: Op0x6C(); break; case 0x6D: Op0x6D(); break; case 0x6E: Op0x6E(); break; case 0x6F: Op0x6F(); break;
        case 0x70: Op0x70(); break; case 0x71: Op0x71(); break; case 0x72: Op0x72(); break; case 0x73: Op0x73(); break; case 0x74: Op0x74(); break; case 0x75: Op0x75(); break; case 0x76: Op0x76(); break; case 0x77: Op0x77(); break; case 0x78: Op0x78(); break; case 0x79: Op0x79(); break; case 0x7A: Op0x7A(); break; case 0x7B: Op0x7B(); break; case 0x7C: Op0x7C(); break; case 0x7D: Op0x7D(); break; case 0x7E: Op0x7E(); break; case 0x7F: Op0x7F(); break;
        case 0x80: Op0x80(); break; case 0x81: Op0x81(); break; case 0x82: Op0x82(); break; case 0x83: Op0x83(); break; case 0x84: Op0x84(); break; case 0x85: Op0x85(); break; case 0x86: Op0x86(); break; case 0x87: Op0x87(); break; case 0x88: Op0x88(); break; case 0x89: Op0x89(); break; case 0x8A: Op0x8A(); break; case 0x8B: Op0x8B(); break; case 0x8C: Op0x8C(); break; case 0x8D: Op0x8D(); break; case 0x8E: Op0x8E(); break; case 0x8F: Op0x8F(); break;
        case 0x90: Op0x90(); break; case 0x91: Op0x91(); break; case 0x92: Op0x92(); break; case 0x93: Op0x93(); break; case 0x94: Op0x94(); break; case 0x95: Op0x95(); break; case 0x96: Op0x96(); break; case 0x97: Op0x97(); break; case 0x98: Op0x98(); break; case 0x99: Op0x99(); break; case 0x9A: Op0x9A(); break; case 0x9B: Op0x9B(); break; case 0x9C: Op0x9C(); break; case 0x9D: Op0x9D(); break; case 0x9E: Op0x9E(); break; case 0x9F: Op0x9F(); break;
        case 0xA0: Op0xA0(); break; case 0xA1: Op0xA1(); break; case 0xA2: Op0xA2(); break; case 0xA3: Op0xA3(); break; case 0xA4: Op0xA4(); break; case 0xA5: Op0xA5(); break; case 0xA6: Op0xA6(); break; case 0xA7: Op0xA7(); break; case 0xA8: Op0xA8(); break; case 0xA9: Op0xA9(); break; case 0xAA: Op0xAA(); break; case 0xAB: Op0xAB(); break; case 0xAC: Op0xAC(); break; case 0xAD: Op0xAD(); break; case 0xAE: Op0xAE(); break; case 0xAF: Op0xAF(); break;
        case 0xB0: Op0xB0(); break; case 0xB1: Op0xB1(); break; case 0xB2: Op0xB2(); break; case 0xB3: Op0xB3(); break; case 0xB4: Op0xB4(); break; case 0xB5: Op0xB5(); break; case 0xB6: Op0xB6(); break; case 0xB7: Op0xB7(); break; case 0xB8: Op0xB8(); break; case 0xB9: Op0xB9(); break; case 0xBA: Op0xBA(); break; case 0xBB: Op0xBB(); break; case 0xBC: Op0xBC(); break; case 0xBD: Op0xBD(); break; case 0xBE: Op0xBE(); break; case 0xBF: Op0xBF(); break;
        case 0xC0: Op0xC0(); break; case 0xC1: Op0xC1(); break; case 0xC2: Op0xC2(); break; case 0xC3: Op0xC3(); break; case 0xC4: Op0xC4(); break; case 0xC5: Op0xC5(); break; case 0xC6: Op0xC6(); break; case 0xC7: Op0xC7(); break; case 0xC8: Op0xC8(); break; case 0xC9: Op0xC9(); break; case 0xCA: Op0xCA(); break; case 0xCB: Op0xCB(); break; case 0xCC: Op0xCC(); break; case 0xCD: Op0xCD(); break; case 0xCE: Op0xCE(); break; case 0xCF: Op0xCF(); break;
        case 0xD0: Op0xD0(); break; case 0xD1: Op0xD1(); break; case 0xD2: Op0xD2(); break; case 0xD3: Op0xD3(); break; case 0xD4: Op0xD4(); break; case 0xD5: Op0xD5(); break; case 0xD6: Op0xD6(); break; case 0xD7: Op0xD7(); break; case 0xD8: Op0xD8(); break; case 0xD9: Op0xD9(); break; case 0xDA: Op0xDA(); break; case 0xDB: Op0xDB(); break; case 0xDC: Op0xDC(); break; case 0xDD: Op0xDD(); break; case 0xDE: Op0xDE(); break; case 0xDF: Op0xDF(); break;
        case 0xE0: Op0xE0(); break; case 0xE1: Op0xE1(); break; case 0xE2: Op0xE2(); break; case 0xE3: Op0xE3(); break; case 0xE4: Op0xE4(); break; case 0xE5: Op0xE5(); break; case 0xE6: Op0xE6(); break; case 0xE7: Op0xE7(); break; case 0xE8: Op0xE8(); break; case 0xE9: Op0xE9(); break; case 0xEA: Op0xEA(); break; case 0xEB: Op0xEB(); break; case 0xEC: Op0xEC(); break; case 0xED: Op0xED(); break; case 0xEE: Op0xEE(); break; case 0xEF: Op0xEF(); break;
        case 0xF0: Op0xF0(); break; case 0xF1: Op0xF1(); break; case 0xF2: Op0xF2(); break; case 0xF3: Op0xF3(); break; case 0xF4: Op0xF4(); break; case 0xF5: Op0xF5(); break; case 0xF6: Op0xF6(); break; case 0xF7: Op0xF7(); break; case 0xF8: Op0xF8(); break; case 0xF9: Op0xF9(); break; case 0xFA: Op0xFA(); break; case 0xFB: Op0xFB(); break; case 0xFC: Op0xFC(); break; case 0xFD: Op0xFD(); break; case 0xFE: Op0xFE(); break; case 0xFF: Op0xFF(); break;
    }
}

// ExecuteCbInstruction(opcode)
//
// IN:  opcode: CB CPU instruction code
// OUT: n/a
//
// DESCRIPTION:
// Executes the CB CPU instruction specified by opcode.
//
// NOTES:
// https://meganesulli.com/generate-gb-opcodes/
//
function ExecuteCbInstruction(opcode) {
    switch (opcode) {
        case 0x00: Cb0x00(); break; case 0x01: Cb0x01(); break; case 0x02: Cb0x02(); break; case 0x03: Cb0x03(); break; case 0x04: Cb0x04(); break; case 0x05: Cb0x05(); break; case 0x06: Cb0x06(); break; case 0x07: Cb0x07(); break; case 0x08: Cb0x08(); break; case 0x09: Cb0x09(); break; case 0x0A: Cb0x0A(); break; case 0x0B: Cb0x0B(); break; case 0x0C: Cb0x0C(); break; case 0x0D: Cb0x0D(); break; case 0x0E: Cb0x0E(); break; case 0x0F: Cb0x0F(); break;
        case 0x10: Cb0x10(); break; case 0x11: Cb0x11(); break; case 0x12: Cb0x12(); break; case 0x13: Cb0x13(); break; case 0x14: Cb0x14(); break; case 0x15: Cb0x15(); break; case 0x16: Cb0x16(); break; case 0x17: Cb0x17(); break; case 0x18: Cb0x18(); break; case 0x19: Cb0x19(); break; case 0x1A: Cb0x1A(); break; case 0x1B: Cb0x1B(); break; case 0x1C: Cb0x1C(); break; case 0x1D: Cb0x1D(); break; case 0x1E: Cb0x1E(); break; case 0x1F: Cb0x1F(); break;
        case 0x20: Cb0x20(); break; case 0x21: Cb0x21(); break; case 0x22: Cb0x22(); break; case 0x23: Cb0x23(); break; case 0x24: Cb0x24(); break; case 0x25: Cb0x25(); break; case 0x26: Cb0x26(); break; case 0x27: Cb0x27(); break; case 0x28: Cb0x28(); break; case 0x29: Cb0x29(); break; case 0x2A: Cb0x2A(); break; case 0x2B: Cb0x2B(); break; case 0x2C: Cb0x2C(); break; case 0x2D: Cb0x2D(); break; case 0x2E: Cb0x2E(); break; case 0x2F: Cb0x2F(); break;
        case 0x30: Cb0x30(); break; case 0x31: Cb0x31(); break; case 0x32: Cb0x32(); break; case 0x33: Cb0x33(); break; case 0x34: Cb0x34(); break; case 0x35: Cb0x35(); break; case 0x36: Cb0x36(); break; case 0x37: Cb0x37(); break; case 0x38: Cb0x38(); break; case 0x39: Cb0x39(); break; case 0x3A: Cb0x3A(); break; case 0x3B: Cb0x3B(); break; case 0x3C: Cb0x3C(); break; case 0x3D: Cb0x3D(); break; case 0x3E: Cb0x3E(); break; case 0x3F: Cb0x3F(); break;
        case 0x40: Cb0x40(); break; case 0x41: Cb0x41(); break; case 0x42: Cb0x42(); break; case 0x43: Cb0x43(); break; case 0x44: Cb0x44(); break; case 0x45: Cb0x45(); break; case 0x46: Cb0x46(); break; case 0x47: Cb0x47(); break; case 0x48: Cb0x48(); break; case 0x49: Cb0x49(); break; case 0x4A: Cb0x4A(); break; case 0x4B: Cb0x4B(); break; case 0x4C: Cb0x4C(); break; case 0x4D: Cb0x4D(); break; case 0x4E: Cb0x4E(); break; case 0x4F: Cb0x4F(); break;
        case 0x50: Cb0x50(); break; case 0x51: Cb0x51(); break; case 0x52: Cb0x52(); break; case 0x53: Cb0x53(); break; case 0x54: Cb0x54(); break; case 0x55: Cb0x55(); break; case 0x56: Cb0x56(); break; case 0x57: Cb0x57(); break; case 0x58: Cb0x58(); break; case 0x59: Cb0x59(); break; case 0x5A: Cb0x5A(); break; case 0x5B: Cb0x5B(); break; case 0x5C: Cb0x5C(); break; case 0x5D: Cb0x5D(); break; case 0x5E: Cb0x5E(); break; case 0x5F: Cb0x5F(); break;
        case 0x60: Cb0x60(); break; case 0x61: Cb0x61(); break; case 0x62: Cb0x62(); break; case 0x63: Cb0x63(); break; case 0x64: Cb0x64(); break; case 0x65: Cb0x65(); break; case 0x66: Cb0x66(); break; case 0x67: Cb0x67(); break; case 0x68: Cb0x68(); break; case 0x69: Cb0x69(); break; case 0x6A: Cb0x6A(); break; case 0x6B: Cb0x6B(); break; case 0x6C: Cb0x6C(); break; case 0x6D: Cb0x6D(); break; case 0x6E: Cb0x6E(); break; case 0x6F: Cb0x6F(); break;
        case 0x70: Cb0x70(); break; case 0x71: Cb0x71(); break; case 0x72: Cb0x72(); break; case 0x73: Cb0x73(); break; case 0x74: Cb0x74(); break; case 0x75: Cb0x75(); break; case 0x76: Cb0x76(); break; case 0x77: Cb0x77(); break; case 0x78: Cb0x78(); break; case 0x79: Cb0x79(); break; case 0x7A: Cb0x7A(); break; case 0x7B: Cb0x7B(); break; case 0x7C: Cb0x7C(); break; case 0x7D: Cb0x7D(); break; case 0x7E: Cb0x7E(); break; case 0x7F: Cb0x7F(); break;
        case 0x80: Cb0x80(); break; case 0x81: Cb0x81(); break; case 0x82: Cb0x82(); break; case 0x83: Cb0x83(); break; case 0x84: Cb0x84(); break; case 0x85: Cb0x85(); break; case 0x86: Cb0x86(); break; case 0x87: Cb0x87(); break; case 0x88: Cb0x88(); break; case 0x89: Cb0x89(); break; case 0x8A: Cb0x8A(); break; case 0x8B: Cb0x8B(); break; case 0x8C: Cb0x8C(); break; case 0x8D: Cb0x8D(); break; case 0x8E: Cb0x8E(); break; case 0x8F: Cb0x8F(); break;
        case 0x90: Cb0x90(); break; case 0x91: Cb0x91(); break; case 0x92: Cb0x92(); break; case 0x93: Cb0x93(); break; case 0x94: Cb0x94(); break; case 0x95: Cb0x95(); break; case 0x96: Cb0x96(); break; case 0x97: Cb0x97(); break; case 0x98: Cb0x98(); break; case 0x99: Cb0x99(); break; case 0x9A: Cb0x9A(); break; case 0x9B: Cb0x9B(); break; case 0x9C: Cb0x9C(); break; case 0x9D: Cb0x9D(); break; case 0x9E: Cb0x9E(); break; case 0x9F: Cb0x9F(); break;
        case 0xA0: Cb0xA0(); break; case 0xA1: Cb0xA1(); break; case 0xA2: Cb0xA2(); break; case 0xA3: Cb0xA3(); break; case 0xA4: Cb0xA4(); break; case 0xA5: Cb0xA5(); break; case 0xA6: Cb0xA6(); break; case 0xA7: Cb0xA7(); break; case 0xA8: Cb0xA8(); break; case 0xA9: Cb0xA9(); break; case 0xAA: Cb0xAA(); break; case 0xAB: Cb0xAB(); break; case 0xAC: Cb0xAC(); break; case 0xAD: Cb0xAD(); break; case 0xAE: Cb0xAE(); break; case 0xAF: Cb0xAF(); break;
        case 0xB0: Cb0xB0(); break; case 0xB1: Cb0xB1(); break; case 0xB2: Cb0xB2(); break; case 0xB3: Cb0xB3(); break; case 0xB4: Cb0xB4(); break; case 0xB5: Cb0xB5(); break; case 0xB6: Cb0xB6(); break; case 0xB7: Cb0xB7(); break; case 0xB8: Cb0xB8(); break; case 0xB9: Cb0xB9(); break; case 0xBA: Cb0xBA(); break; case 0xBB: Cb0xBB(); break; case 0xBC: Cb0xBC(); break; case 0xBD: Cb0xBD(); break; case 0xBE: Cb0xBE(); break; case 0xBF: Cb0xBF(); break;
        case 0xC0: Cb0xC0(); break; case 0xC1: Cb0xC1(); break; case 0xC2: Cb0xC2(); break; case 0xC3: Cb0xC3(); break; case 0xC4: Cb0xC4(); break; case 0xC5: Cb0xC5(); break; case 0xC6: Cb0xC6(); break; case 0xC7: Cb0xC7(); break; case 0xC8: Cb0xC8(); break; case 0xC9: Cb0xC9(); break; case 0xCA: Cb0xCA(); break; case 0xCB: Cb0xCB(); break; case 0xCC: Cb0xCC(); break; case 0xCD: Cb0xCD(); break; case 0xCE: Cb0xCE(); break; case 0xCF: Cb0xCF(); break;
        case 0xD0: Cb0xD0(); break; case 0xD1: Cb0xD1(); break; case 0xD2: Cb0xD2(); break; case 0xD3: Cb0xD3(); break; case 0xD4: Cb0xD4(); break; case 0xD5: Cb0xD5(); break; case 0xD6: Cb0xD6(); break; case 0xD7: Cb0xD7(); break; case 0xD8: Cb0xD8(); break; case 0xD9: Cb0xD9(); break; case 0xDA: Cb0xDA(); break; case 0xDB: Cb0xDB(); break; case 0xDC: Cb0xDC(); break; case 0xDD: Cb0xDD(); break; case 0xDE: Cb0xDE(); break; case 0xDF: Cb0xDF(); break;
        case 0xE0: Cb0xE0(); break; case 0xE1: Cb0xE1(); break; case 0xE2: Cb0xE2(); break; case 0xE3: Cb0xE3(); break; case 0xE4: Cb0xE4(); break; case 0xE5: Cb0xE5(); break; case 0xE6: Cb0xE6(); break; case 0xE7: Cb0xE7(); break; case 0xE8: Cb0xE8(); break; case 0xE9: Cb0xE9(); break; case 0xEA: Cb0xEA(); break; case 0xEB: Cb0xEB(); break; case 0xEC: Cb0xEC(); break; case 0xED: Cb0xED(); break; case 0xEE: Cb0xEE(); break; case 0xEF: Cb0xEF(); break;
        case 0xF0: Cb0xF0(); break; case 0xF1: Cb0xF1(); break; case 0xF2: Cb0xF2(); break; case 0xF3: Cb0xF3(); break; case 0xF4: Cb0xF4(); break; case 0xF5: Cb0xF5(); break; case 0xF6: Cb0xF6(); break; case 0xF7: Cb0xF7(); break; case 0xF8: Cb0xF8(); break; case 0xF9: Cb0xF9(); break; case 0xFA: Cb0xFA(); break; case 0xFB: Cb0xFB(); break; case 0xFC: Cb0xFC(); break; case 0xFD: Cb0xFD(); break; case 0xFE: Cb0xFE(); break; case 0xFF: Cb0xFF(); break;
    }
}
