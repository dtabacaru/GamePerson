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

// CPU Functions

// ReadRom
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
// Main CPU loop. Fetches 8-bit instructions from where ProgramCounter
// points to, starting at ROM 0x0100, and executes them.
//
// NOTES:
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
// OUT: 8-bit value pointed to by ProgramCounter
//
// DESCRIPTION:
// Reads the 8-bit value pointed to by ProgramCounter and
// increments ProgramCounter by 1.
//
// NOTES:
//
function ReadAndIncrementPC8Bit() {
    return Rom.getUint8(ProgramCounter++);
}

// ReadAndIncrementPC8BitSigned()
//
// IN:  n/a
// OUT: 8-bit signed value pointed to by ProgramCounter
//
// DESCRIPTION:
// Reads the 8-bit signed value pointed to by ProgramCounter and
// increments ProgramCounter by 1.
//
// NOTES:
//
function ReadAndIncrementPC8BitSigned() {
    return Rom.getInt8(ProgramCounter++);
}

// Read16BitPcValue()
//
// IN:  n/a
// OUT: 16-bit value pointed to by ProgramCounter
//
// DESCRIPTION:
// Reads the 16-bit value pointed to by ProgramCounter and
// increments ProgramCounter by 2.
//
// NOTES:
//
function ReadAndIncrementPC16Bit() {
    return ReadAndIncrementPC8Bit() + (ReadAndIncrementPC8Bit() << 8);
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
// Flags denoted by ---- ZNHC
//
function ExecuteInstruction(opcode) {
    switch (opcode) {
        // NOP
        // ----
        case 0x00:
            break;
        // LD BC, d16
        // ----
        case 0x01:
            WriteRegisterBC(ReadAndIncrementPC16Bit());
            break;
        // LD (BC), A
        // ----
        case 0x02:
            WriteAddress(RegisterBC, ReadRegisterA());
            break;
        // INC BC
        // ----
        case 0x03:
            WriteRegisterBC(RegisterBC + 1);
            break;
        // INC B
        // Z0H-
        case 0x04: {
            let old_val = ReadRegisterB();
            WriteRegisterB(old_val + 1);
            UnsetNFlag();
            if(!ReadRegisterB())
                SetZFlag();
            if(((old_val & 0x0F)+1) & 0x10)
                SetHFlag();
            break;
        }
        // DEC B
        // Z1H-
        case 0x05: {
            let old_val = ReadRegisterB();
            WriteRegisterB(old_val - 1);
            SetNFlag();
            if(!ReadRegisterB())
                SetZFlag();
            if(((old_val & 0x0F)-1) & 0x10) //
                SetHFlag();
            break;
        }
        // LD B, d8
        case 0x06:
            WriteRegisterB(ReadAndIncrementPC8Bit());
            break;
        // RLCA    
        case 0x07:
            break;
        // LD (a16), SP
        case 0x08: {
            let address = ReadAndIncrementPC16Bit();
            WriteAddress(address,     ReadRegisterP());
            WriteAddress(address + 1, ReadRegisterS());
            break;
        }
        // ADD HL, BC
        case 0x09:
            break;
        // LD A, (BC)
        case 0x0A:
            WriteRegisterA(ReadAddress(RegisterBC));
            break;
        // DEC BC
        case 0x0B:
            WriteRegisterBC(RegisterBC - 1);
            break;
        // INC C
        case 0x0C:
            break;
        // DEC C
        case 0x0D:
            break;
        // LD C, d8
        case 0x0E:
            WriteRegisterC(ReadAndIncrementPC8Bit());
            break;
        // RRCA
        case 0x0F:
            break;
        // STOP
        case 0x10:
            break;
        // LD DE, d16
        case 0x11:
            WriteRegisterDE(ReadAndIncrementPC16Bit());
            break;
        // LD(DE), A
        case 0x12:
            WriteAddress(RegisterDE, ReadRegisterA());
            break;
        // INC DE
        case 0x13:
            WriteRegisterDE(RegisterDE + 1);
            break;
        // INC D
        case 0x14:
            break;
        // DEC D
        case 0x15:
            break;
        // LD D, d8
        case 0x16:
            WriteRegisterD(ReadAndIncrementPC8Bit());
            break;
        // RLA
        case 0x17:
            break;
        // JR s8
        case 0x18:
            ProgramCounter += ReadAndIncrementPC8BitSigned();
            break;
        // ADD HL, DE
        case 0x19:
            break;
        // LD A, (DE)
        case 0x1A:
            WriteRegisterA(ReadAddress(RegisterDE));
            break;
        // DEC DE
        case 0x1B:
            WriteRegisterDE(RegisterDE - 1);
            break;
        // INC E
        case 0x1C:
            break;
        // DEC E
        case 0x1D:
            break;
        // LD E, d8
        case 0x1E:
            WriteRegisterE(ReadAndIncrementPC8Bit());
            break;
        // RRA
        case 0x1F:
            break;
        // JR NZ, s8
        case 0x20: {
            let offset = ReadAndIncrementPC8BitSigned();
            if(!ReadZFlag())
                ProgramCounter += offset;
            break;
        }
        // LD HL, d16
        case 0x21:
            WriteRegisterHL(ReadAndIncrementPC16Bit());
            break;
        // LD (HL+), A
        case 0x22:
            WriteAddress(RegisterHL, ReadRegisterA());
            WriteRegisterHL(RegisterHL + 1);
            break;
        // INC HL
        case 0x23:
            WriteRegisterHL(RegisterHL + 1);
            break;
        // INC H
        case 0x24:
            break;
        // DEC H
        case 0x25:
            break;
        // LD H, d8
        case 0x26:
            WriteRegisterH(ReadAndIncrementPC8Bit());
            break;
        // DAA
        case 0x27:
            break;
        // JR Z, s8
        case 0x28: {
            let offset = ReadAndIncrementPC8BitSigned();
            if(ReadZFlag())
                ProgramCounter += offset;
            break;
        }
        // ADD HL, HL
        case 0x29:
            break;
        // LD A, (HL+)
        case 0x2A:
            WriteRegisterA(ReadAddress(RegisterHL));
            WriteRegisterHL(RegisterHL + 1);
            break;
        // DEC HL
        case 0x2B:
            WriteRegisterHL(RegisterHL - 1);
            break;
        // INC L
        case 0x2C:
            break;
        // DEC L
        case 0x2D:
            break;
        // LD L, d8
        case 0x2E:
            WriteRegisterL(ReadAndIncrementPC8Bit());
            break;
        // CPL
        case 0x2F:
            break;
        // JR NC, s8
        case 0x30: {
            let offset = ReadAndIncrementPC8BitSigned();
            if(!ReadCFlag())
                ProgramCounter += offset;
            break;
        }
        // LD SP, d16
        case 0x31:
            WriteRegisterSP(ReadAndIncrementPC16Bit());
            break;
        // LD(HL-), A
        case 0x32:
            WriteAddress(RegisterHL, ReadRegisterA());
            WriteRegisterHL(RegisterHL-1);
            break;
        // INC SP
        case 0x33:
            WriteRegisterSP(StackPointer + 1);
            break;
        // INC (HL)
        case 0x34:
            break;
        // DEC (HL)
        case 0x35:
            break;
        // LD(HL), d8
        case 0x36:
            WriteAddress(RegisterHL, ReadAndIncrementPC8Bit());
            break;
        // SCF
        case 0x37:
            break;
        // JR C, s8
        case 0x38: {
            let offset = ReadAndIncrementPC8BitSigned();
            if(ReadCFlag())
                ProgramCounter += offset;
            break;
        }
        // ADD HL, SP
        case 0x39:
            break;
        // LD A, (HL-)
        case 0x3A:    
            WriteRegisterA(ReadAddress(RegisterHL));
            WriteRegisterHL(RegisterHL-1);
            break;
        // DEC SP
        case 0x3B:
            break;
        // INC A
        case 0x3C:
            break;
        // DEC A
        case 0x3D:
            break;
        // LD A, d8
        case 0x3E:
            WriteRegisterA(ReadAndIncrementPC8Bit());
            break;
        // CCF
        case 0x3F:
            break;
        // LD B, B
        case 0x40:
            break;
        // LD B, C
        case 0x41:
            WriteRegisterB(ReadRegisterC());
            break;
        // LD B, D    
        case 0x42:
            WriteRegisterB(ReadRegisterD());
            break;
        // LD B, E
        case 0x43:
            WriteRegisterB(ReadRegisterE());
            break;
        // LD B, H
        case 0x44:
            WriteRegisterB(ReadRegisterH());
            break;
        // LD B, L
        case 0x45:
            WriteRegisterB(ReadRegisterL());
            break;
        // LD B, (HL)
        case 0x46:
            WriteRegisterB(ReadAddress(RegisterHL));
            break;
        // LD B, A
        case 0x47:
            WriteRegisterB(ReadRegisterA());
            break;
        // LD C, B
        case 0x48:
            WriteRegisterC(ReadRegisterB());
            break;
        // LD C, C
        case 0x49:
            break;
        // LD C, D
        case 0x4A:
            WriteRegisterC(ReadRegisterD());
            break;
        // LD C, E
        case 0x4B:
            WriteRegisterC(ReadRegisterE());
            break;
        // LD C, H
        case 0x4C:
            WriteRegisterC(ReadRegisterH());
            break;
        // LD C, L
        case 0x4D:
            WriteRegisterC(ReadRegisterL());
            break;
        // LD C, (HL)
        case 0x4E:
            WriteRegisterC(ReadAddress(RegisterHL));
            break;
        // LD C, A
        case 0x4F:
            WriteRegisterC(ReadRegisterA());
            break;
        // LD D, B
        case 0x50:
            WriteRegisterD(ReadRegisterB());
            break;
        // LD D, C
        case 0x51:
            WriteRegisterD(ReadRegisterC());
            break;
        // LD D, D
        case 0x52:
            break;
        // LD D, E
        case 0x53:
            WriteRegisterD(ReadRegisterE());
            break;
        // LD D, H
        case 0x54:
            WriteRegisterD(ReadRegisterH());
            break;
        // LD D, L
        case 0x55:
            WriteRegisterD(ReadRegisterL());
            break;
        // LD D, (HL)
        case 0x56:
            WriteRegisterD(ReadAddress(RegisterHL));
            break;
        // LD D, A
        case 0x57:
            WriteRegisterD(ReadRegisterA());
            break;
        // LD E, B
        case 0x58:
            WriteRegisterE(ReadRegisterB());
            break;
        // LD E, C
        case 0x59:
            WriteRegisterE(ReadRegisterC());
            break;
        // LD E, D
        case 0x5A:
            WriteRegisterE(ReadRegisterD());
            break;
        // LD E, E
        case 0x5B:
            // jackson_sux
            break;
        // LD E, H
        case 0x5C:
            WriteRegisterE(ReadRegisterH());
            break;
        // LD E, L
        case 0x5D:
            WriteRegisterE(ReadRegisterL());
            break;
        // LD E, (HL)
        case 0x5E:
            WriteRegisterE(ReadAddress(RegisterHL));
            break;
        // LD E, A
        case 0x5F:
            WriteRegisterE(ReadRegisterA());
            break;
        // LD H, B
        case 0x60:
            WriteRegisterH(ReadRegisterB());
            break;
        // LD H, C
        case 0x61:
            WriteRegisterH(ReadRegisterC());
            break;
        // LD H, D
        case 0x62:
            WriteRegisterH(ReadRegisterD());
            break;
        // LD H, E
        case 0x63:
            WriteRegisterH(ReadRegisterE());
            break;
        // LD H, H
        case 0x64:
            // jackson_sux
            break;
        // LD H, L
        case 0x65:
            WriteRegisterH(ReadRegisterL());
            break;
        // LD H, (HL)
        case 0x66:
            WriteRegisterH(ReadAddress(RegisterHL));
            break;
        // LD H, A
        case 0x67:
            WriteRegisterH(ReadRegisterA());
            break;
        // LD L, B
        case 0x68:
            WriteRegisterL(ReadRegisterB());
            break;
        // LD L, C
        case 0x69:
            WriteRegisterL(ReadRegisterC());
            break;
        // LD L, D
        case 0x6A:
            WriteRegisterL(ReadRegisterD());
            break;
        // LD L, E
        case 0x6B:
            WriteRegisterL(ReadRegisterE());
            break;
        // LD L, H
        case 0x6C:
            WriteRegisterL(ReadRegisterH());
            break;
        // LD L, L
        case 0x6D:
            // jackson_sux
            break;
        // LD L, (HL)
        case 0x6E:
            WriteRegisterL(ReadAddress(RegisterHL));
            break;
        // LD L, A
        case 0x6F:
            WriteRegisterL(ReadRegisterA());
            break;
        // LD (HL), B
        case 0x70:
            WriteAddress(RegisterHL, ReadRegisterB());
            break;
        // LD (HL), C
        case 0x71:
            WriteAddress(RegisterHL, ReadRegisterC());
            break;
        // LD(HL), D
        case 0x72:
            WriteAddress(RegisterHL, ReadRegisterD());
            break;
        // LD (HL), E
        case 0x73:
            WriteAddress(RegisterHL, ReadRegisterE());
            break;
        // LD (HL), H
        case 0x74:
            WriteAddress(RegisterHL, ReadRegisterH());
            break;
        // LD (HL), L
        case 0x75:
            WriteAddress(RegisterHL, ReadRegisterL());
            break;
        // HALT
        case 0x76:
            break;
        // LD (HL), A
        case 0x77:
            WriteAddress(RegisterHL, ReadRegisterA());
            break;
        // LD A, B
        case 0x78:
            WriteRegisterA(ReadRegisterB());
            break;
        // LD A, C
        case 0x79:
            WriteRegisterA(ReadRegisterC());
            break;
        // LD A, D
        case 0x7A:
            WriteRegisterA(ReadRegisterD());
            break;
        // LD A, E
        case 0x7B:
            WriteRegisterA(ReadRegisterE());
            break;
        // LD A, H
        case 0x7C:
            WriteRegisterA(ReadRegisterH());
            break;
        // LD A, L
        case 0x7D:
            WriteRegisterA(ReadRegisterL());
            break;
        // LD A, (HL)
        case 0x7E:
            WriteRegisterA(ReadAddress(RegisterHL));
            break;
        // LD A, A
        case 0x7F:
            // jackson_sux
            break;
        case 0x80:
            break;
        case 0x81:
            break;
        case 0x82:
            break;
        case 0x83:
            break;
        case 0x84:
            break;
        case 0x85:
            break;
        case 0x86:
            break;
        case 0x87:
            break;
        case 0x88:
            break;
        case 0x89:
            break;
        case 0x8A:
            break;
        case 0x8B:
            break;
        case 0x8C:
            break;
        case 0x8D:
            break;
        case 0x8E:
            break;
        case 0x8F:
            break;
        case 0x90:
            break;
        case 0x91:
            break;
        case 0x92:
            break;
        case 0x93:
            break;
        case 0x94:
            break;
        case 0x95:
            break;
        case 0x96:
            break;
        case 0x97:
            break;
        case 0x98:
            break;
        case 0x99:
            break;
        case 0x9A:
            break;
        case 0x9B:
            break;
        case 0x9C:
            break;
        case 0x9D:
            break;
        case 0x9E:
            break;
        case 0x9F:
            break;
        case 0xA0:
            break;
        case 0xA1:
            break;
        case 0xA2:
            break;
        case 0xA3:
            break;
        case 0xA4:
            break;
        case 0xA5:
            break;
        case 0xA6:
            break;
        case 0xA7:
            break;
        // XOR B
        case 0xA8:
            WriteRegisterA(ReadRegisterB() ^ ReadRegisterA());
            if(!ReadRegisterA()) SetZFlag();
            break;
        // XOR C
        case 0xA9:
            WriteRegisterA(ReadRegisterC() ^ ReadRegisterA());
            if(!ReadRegisterA()) SetZFlag();
            break;
        // XOR D
        case 0xAA: 
            WriteRegisterA(ReadRegisterD() ^ ReadRegisterA());
            if(!ReadRegisterA()) SetZFlag();
            break;
        // XOR E
        case 0xAB: 
            WriteRegisterA(ReadRegisterE() ^ ReadRegisterA());
            if(!ReadRegisterA()) SetZFlag();
            break;
        // XOR H
        case 0xAC:
            WriteRegisterA(ReadRegisterH() ^ ReadRegisterA());
            if(!ReadRegisterA()) SetZFlag();
            break;
        // XOR L
        case 0xAD: 
            WriteRegisterA(ReadRegisterL() ^ ReadRegisterA());
            if(!ReadRegisterA()) SetZFlag();
            break;
        // XOR (HL)
        case 0xAE: 
            WriteRegisterA(ReadAddress(RegisterHL) ^ ReadRegisterA());
            if(!ReadRegisterA()) SetZFlag();
            break;
        // XOR A
        case 0xAF: 
            WriteRegisterA(ReadRegisterA() ^ ReadRegisterA());
            if(!ReadRegisterA()) SetZFlag();
            break;
        case 0xB0:
            break;
        case 0xB1:
            break;
        case 0xB2:
            break;
        case 0xB3:
            break;
        case 0xB4:
            break;
        case 0xB5:
            break;
        case 0xB6:
            break;
        case 0xB7:
            break;
        case 0xB8:
            break;
        case 0xB9:
            break;
        case 0xBA:
            break;
        case 0xBB:
            break;
        case 0xBC:
            break;
        case 0xBD:
            break;
        case 0xBE:
            break;
        case 0xBF:
            break;
        case 0xC0:
            break;
        case 0xC1:
            break;
        // JP NZ, a16
        case 0xC2: {
            let address = ReadAndIncrementPC16Bit();
            if(!ReadZFlag())
                ProgramCounter = address;
            break;
        }
        // JP a16
        case 0xC3:
            ProgramCounter = ReadAndIncrementPC16Bit();
            break;
        case 0xC4:
            break;
        case 0xC5:
            break;
        case 0xC6:
            break;
        case 0xC7:
            break;
        case 0xC8:
            break;
        case 0xC9:
            break;
        // JP Z, a16
        case 0xCA: {
            let address = ReadAndIncrementPC16Bit();
            if(ReadZFlag())
                ProgramCounter = address;
            break;
        }
        case 0xCB:
            break;
        case 0xCC:
            break;
        case 0xCD:
            break;
        case 0xCE:
            break;
        case 0xCF:
            break;
        case 0xD0:
            break;
        case 0xD1:
            break;
        // JP NC, a16
        case 0xD2: {
            let address = ReadAndIncrementPC16Bit();
            if(!ReadCFlag())
                ProgramCounter = address;
            break;
        }
        case 0xD3:
            break;
        case 0xD4:
            break;
        case 0xD5:
            break;
        case 0xD6:
            break;
        case 0xD7:
            break;
        case 0xD8:
            break;
        case 0xD9:
            break;
        // JP C, a16
        case 0xDA: {
            let address = ReadAndIncrementPC16Bit();
            if(ReadCFlag())
                ProgramCounter = address;
            break;
        }
        case 0xDB:
            break;
        case 0xDC:
            break;
        case 0xDD:
            break;
        case 0xDE:
            break;
        case 0xDF:
            break;
        // LD (a8), A
        case 0xE0:
            WriteAddress(0xFF00+ReadAndIncrementPC8Bit(), ReadRegisterA());
            break;
        case 0xE1:
            break;
        // LD (C), A
        case 0xE2:
            WriteAddress(0xFF00+ReadRegisterC(), ReadRegisterA());
            break;
        case 0xE3:
            break;
        case 0xE4:
            break;
        case 0xE5:
            break;
        case 0xE6:
            break;
        case 0xE7:
            break;
        case 0xE8:
            break;
        // JP HL
        case 0xE9:
            ProgramCounter = RegisterHL;
            break;
        // LD (a16), A
        case 0xEA:
            WriteAddress(ReadAndIncrementPC16Bit(), ReadRegisterA());
            break;
        case 0xEB:
            break;
        case 0xEC:
            break;
        case 0xED:
            break;
        // XOR d8
        case 0xEE: 
            WriteRegisterA(ReadAndIncrementPC8Bit() ^ ReadRegisterA());
            if(!ReadRegisterA()) SetZFlag();
            break;
        case 0xEF:
            break;
        // LD A, (a8)
        case 0xF0:
            WriteRegisterA(ReadAddress(0xFF00+ReadAndIncrementPC8Bit()));
            break;
        case 0xF1:
            break;
        // LD A, (C)
        case 0xF2:
            WriteRegisterA(ReadAddress(0xFF00+ReadRegisterC()));
            break;
        case 0xF3:
            break;
        // DI
        case 0xF4:
            InterruptMasterEnable = false;
            break;
        case 0xF5:
            break;
        case 0xF6:
            break;
        case 0xF7:
            break;
        // LD HL, SP+s8
        case 0xF8:
            WriteRegisterHL(StackPointer + ReadAndIncrementPC8BitSigned());
            break;
        // LD SP, HL
        case 0xF9:
            WriteRegisterSP(RegisterHL);
            break;
        // LD A, (a16)
        case 0xFA:
            WriteRegisterA(ReadAddress(ReadAndIncrementPC16Bit()));
            break;
        // EI
        case 0xFB:
            InterruptMasterEnable = true;
            break;
        case 0xFC:
            break;
        case 0xFD:
            break;
        // CP d8
        case 0xFE:
            if(ReadRegisterA() == ReadAndIncrementPC8Bit())
                SetZFlag();
            break;
        case 0xFF:
            break;
    }
}

// Helper Functions

// NumberToHexString(val, padding)
//
// IN:  val:     Decimal value to convert to hex
//      padding: Number of 0s to pad
// OUT: n/a
//
// DESCRIPTION:
// Returns a hex string representation of val, with padding number of digits.
//
// NOTES:
//
function NumberToHexString(val, padding) {
    var jackson_sux = Number(val).toString(16);
    while (jackson_sux.length < padding) {
        jackson_sux = "0" + jackson_sux;
    }
    return "0x" + jackson_sux.toUpperCase();
}

// ReadMemBox()
//
// IN:  n/a
// OUT: n/a
//
// DESCRIPTION:
// Updates the read memory UI elements
//
// NOTES:
//
function ReadMemBox() {
    let jackson_sux = parseInt("0x"+document.getElementById("MemBoxInput").value);

    if (!isNaN(jackson_sux)) {
        if (jackson_sux >= 0 && jackson_sux <= 0xFFFF) {
            let lowerByte = ReadAddress(jackson_sux);
            let higherByte = jackson_sux < 0xFFFE ? ReadAddress(jackson_sux+1) : 0;
            document.getElementById("MemBoxVar").innerHTML = NumberToHexString(lowerByte | (higherByte << 8), 4);
        }
    }
}

// UpdateNextVarUI()
//
// IN:  n/a
// OUT: n/a
//
// DESCRIPTION:
// Updates the Rom[PC] UI element
//
// NOTES:
//
function UpdateNextVarUI() {
    document.getElementById("NextVar").innerHTML = NumberToHexString((Rom.getUint8(ProgramCounter) << 8) | Rom.getUint8(ProgramCounter+1) , 4);
}

// UpdateDebugUI()
//
// IN:  n/a
// OUT: n/a
//
// DESCRIPTION:
// Updates the Debug Fetch/Execute UI elements
//
// NOTES:
// 
function UpdateDebugUI() {
    document.getElementById("InstructionVar").innerHTML = InstructionStrings[Instruction];
    document.getElementById("OpcodeVar").innerHTML = NumberToHexString(Instruction, 2);
    document.getElementById("NextVar").innerHTML = NumberToHexString((Rom.getUint8(ProgramCounter) << 8) | Rom.getUint8(ProgramCounter+1) , 4);
    document.getElementById("ProgramCounterVar").innerHTML = NumberToHexString(ProgramCounter, 4);
    document.getElementById("StackPointerVar").innerHTML = NumberToHexString(StackPointer, 4);
    document.getElementById("AFVar").innerHTML = NumberToHexString(RegisterAF, 4);
    document.getElementById("BCVar").innerHTML = NumberToHexString(RegisterBC, 4);
    document.getElementById("DEVar").innerHTML = NumberToHexString(RegisterDE, 4);
    document.getElementById("HLVar").innerHTML = NumberToHexString(RegisterHL, 4);

    document.getElementById("FetchButton").disabled = !document.getElementById("FetchButton").disabled;
    document.getElementById("ExecuteButton").disabled = !document.getElementById("ExecuteButton").disabled;
}