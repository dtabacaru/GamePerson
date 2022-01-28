const CLK_F         = 4.194304e6; // Clock frequency (Hz)
const RAM_SIZE      = 8 * 1024;   // 8 KB
const REGISTER_SIZE = 2;          // Bytes

const BITS_8  = 0;
const BITS_16 = 1;

var RamSpace  = new Uint8Array(RAM_SIZE);
var RomSpace  = [];
var RomReader = new FileReader();

var StackPointer   = 0;
var ProgramCounter = 0x0100;  // ROM application starts at 0x0100

var RegisterAF = 0; // A = Accumulator; F = Flag; A = High, F = Low
var RegisterBC = 0; // Gen storage; B = High, C = Low
var RegisterDE = 0; // Gen storage; D = High, E = Low
var RegisterHL = 0; // Gen storage / memory pointer; H = High, L = Low

function ReadRom() {
    RomReader.onload = function () 
    {
        RomSpace = new Uint8Array(RomReader.result);
        RunGamePerson();
    };

    RomReader.readAsArrayBuffer(document.getElementById("RomFileInput").files[0]);
}

function RunGamePerson() {
    // Main CPU loop
    while (true) {
        let delay = ProcessInstruction(Get8BitValue());
        // TODO: Wait for delay time before next instruction
    }
}

function Get8BitValue() {
    let jackson_sux = RomSpace[ProgramCounter];
    ProgramCounter += 1; // 8 bit cpu = 1 byte increments
    return jackson_sux;
}

function Get16BitValue() {
    return Get8BitValue() + (Get8BitValue() << 8);
}

// https://gbdev.gg8.se/wiki/articles/Memory_Map
// control: 0=8bit,1=16bit
// TODO: Implement me!
function ReadAddress(address, control) {
    if (address > 0xFFFE) { // (FFFF-FFFF) Interrupts Enable Register (IE)

    } else if (address > 0xFF7F) { // (FF80-FFFE)   High RAM (HRAM)

    } else if (address > 0xFEFF) { // (FF00-FF7F)   I/O Registers

    } else if (address > 0xFE9F) { // (FEA0-FEFF)   Not Usable

    } else if (address > 0xFDFF) { // (FE00-FE9F)   Sprite attribute table (OAM)

    } else if (address > 0xDFFF) { // (E000-FDFF)   Mirror of C000~DDFF (ECHO RAM)	Typically not used

    } else if (address > 0xBFFF) { // (C000-DFFF)   8KB Work RAM (WRAM) bank 0+1	
        address -= 0xC000;
        switch (control) {
            case 0:
                return RamSpace[address];
            case 1:
                return RamSpace[address] + (RomSpace[address] << 8);
        }
    } else if (address > 0x9FFF) { // (A000-BFFF)   8KB External RAM	In cartridge, switchable bank if any

    } else if (address > 0x7FFF) { // (8000-9FFF)   8KB Video RAM (VRAM)	Only bank 0 in Non-CGB mode

    } else { // (0000-3FFF)	16KB ROM bank 00	From cartridge, usually a fixed bank
        switch (control) {
            case 0:
                return RomSpace[address];
            case 1:
                return RomSpace[address] + (RomSpace[address] << 8);
        }
        
    }
}

// https://gbdev.gg8.se/wiki/articles/Memory_Map
// TODO: Implement me!
// control: 0=8bit,1=16bit
function WriteAddress(address, control, val) {

    //TODO: val check? handle rollover here?

    if (address > 0xFFFE) { // (FFFF-FFFF) Interrupts Enable Register (IE)

    } else if (address > 0xFF7F) { // (FF80-FFFE)   High RAM (HRAM)

    } else if (address > 0xFEFF) { // (FF00-FF7F)   I/O Registers

    } else if (address > 0xFE9F) { // (FEA0-FEFF)   Not Usable

    } else if (address > 0xFDFF) { // (FE00-FE9F)   Sprite attribute table (OAM)

    } else if (address > 0xDFFF) { // (E000-FDFF)   Mirror of C000~DDFF (ECHO RAM)	Typically not used

    } else if (address > 0xBFFF) { // (C000-DFFF)   8KB Work RAM (WRAM) bank 0+1
        address -= 0xC000;
        switch (control) {
            case 0:
                RomSpace[address] = val;
                return;
            case 1:
                RomSpace[address]   = val & 0x00FF;
                RomSpace[address+1] = val & 0xFF00;
                return;
        }
    } else if (address > 0x9FFF) { // (A000-BFFF)   8KB External RAM	In cartridge, switchable bank if any

    } else if (address > 0x7FFF) { // (8000-9FFF)   8KB Video RAM (VRAM)	Only bank 0 in Non-CGB mode

    } else { // (0000-3FFF)	16KB ROM bank 00	From cartridge, usually a fixed bank
        switch (control) {
            case 0:
                RomSpace[address] = val;
                return;
            case 1:
                RomSpace[address]   = val & 0x00FF;
                RomSpace[address+1] = val & 0xFF00;
                return;
        }
    }
}

// TODO: Return how long to wait before next instruction
// TODO: Fix LD instructions that load from memory address
function ProcessInstruction(op) {
    switch (op) {

        case 0x00:
            // NOP
            break;
        case 0x01:
            // LD BC, d16
            RegisterBC = Get16BitValue();
            break;
        case 0x02:
            // LD (BC), A
            RegisterBC = RegisterAF >> 8;
            break;
        case 0x03:
            // INC BC
            break;
        case 0x04:
            // INC B
            break;
        case 0x05:
            // DEC B
            break;
        case 0x06:
            // LD B, d8
            RegisterBC = (RegisterBC & 0xFF) + (Get8BitValue() << 8);
            break;
        case 0x07:
            // RLCA
            break;
        case 0x08:
            // LD (a16), SP
            // TODO: Implement memory map
            break;
        case 0x09:
            // ADD HL, BC
            break;
        case 0x0A:
            // LD A, (BC)
            RegisterAF = (RegisterAF & 0xFF) + ReadAddress(RegisterBC, BITS_8);
            break;
        case 0x0B:
            // DEC BC
            break;
        case 0x0C:
            // INC C
            break;
        case 0x0D:
            // DEC C
            break;
        case 0x0E:
            // LD C, d8
            RegisterBC = Get8BitValue() + (RegisterBC & 0xFF00);
            break;
        case 0x0F:
            // RRCA
            break;
        case 0x10:
            // STOP
            break;
        case 0x11:
            // LD DE, d16
            RegisterDE = Get16BitValue();
            break;
        case 0x12:
            // LD(DE), A
            RegisterDE = RegisterAF >> 8;
            break;
        case 0x13:
            // INC DE
            break;
        case 0x14:
            // INC D
            break;
        case 0x15:
            // DEC D
            break;
        case 0x16:
            // LD D, d8
            RegisterDE = (RegisterDE & 0xFF) + (Get8BitValue() << 8);
            break;
        case 0x17:
            // RLA
            break;
        case 0x18:
            // JR s8
            break;
        case 0x19:
            // ADD HL, DE
            break;
        case 0x1A:
            // LD A, (DE)
            RegisterAF = (RegisterAF & 0xFF) + ((RegisterDE & 0xFF) << 8);
            break;
        case 0x1B:
            // DEC DE
            break;
        case 0x1C:
            // INC E
            break;
        case 0x1D:
            // DEC E
            break;
        case 0x1E:
            // LD E, d8
            RegisterDE = Get8BitValue() + (RegisterDE & 0xFF00);
            break;
        case 0x1F:
            // RRA
            break;
        case 0x20:
            // JR NZ, s8
            break;
        case 0x21:
            // LD HL, d16
            RegisterHL = Get16BitValue();
            break;
        case 0x22:
            // LD (HL+), A
            // TODO: Carry flags? Overflow?
            RegisterHL = (RegisterAF >> 8) + 1;
            break;
        case 0x23:
            // INC HL
            break;
        case 0x24:
            // INC H
            break;
        case 0x25:
            // DEC H
            break;
        case 0x26:
            // LD H, d8
            RegisterHL = (RegisterHL & 0xFF) + (Get8BitValue() << 8);
            break;
        case 0x27:
            // DAA
            break;
        case 0x28:
            // JR Z, s8
            break;
        case 0x29:
            // ADD HL, HL
            break;
        case 0x2A:
            // LD A, (HL +)
            // TODO: Carry flags? Overflow?
            RegisterAF = (RegisterAF & 0xFF) + (RegisterHL & 0xFF);
            RegisterHL += 1;
            break;
        case 0x2B:
            // DEC HL
            break;
        case 0x2C:
            // INC L
            break;
        case 0x2D:
            // DEC L
            break;
        case 0x2E:
            // LD L, d8
            RegisterHL = Get8BitValue() + (RegisterHL & 0xFF00);
            break;
        case 0x2F:
            // CPL
            break;
        case 0x30:
            // JR NC, s8
            break;
        case 0x31:
            // LD SP, d16
            StackPointer = Get16BitValue();
            break;
        case 0x32:
            // LD(HL-), A
            // TODO: Carry flags? Overflow?
            RegisterHL = (RegisterAF >> 8) - 1;
            break;
        case 0x33:
            // INC SP
            break;
        case 0x34:
            // INC (HL)
            break;
        case 0x35:
            // DEC (HL)
            break;
        case 0x36:
            // LD(HL), d8
            RegisterHL = Get8BitValue();
            break;
        case 0x37:
            // SCF
            break;
        case 0x38:
            // JR C, s8
            break;
        case 0x39:
            // ADD HL, SP
            break;
        case 0x3A:
            // LD A, (HL-)
            // TODO: Carry flags? Overflow?
            RegisterAF = (RegisterAF & 0xFF) + (RegisterHL & 0xFF);
            RegisterHL -= 1;
            break;
        case 0x3B:
            // DEC SP
            break;
        case 0x3C:
            // INC A
            break;
        case 0x3D:
            // DEC A
            break;
        case 0x3E:
            // LD A, d8
            RegisterAF = (RegisterAF & 0xFF) + (Get8BitValue() << 8);
            break;
        case 0x3F:
            // CCF
            break;
        case 0x40:
            // LD B, B
            break;
        case 0x41:
            // LD B, C
            RegisterBC = (RegisterBC & 0xFF) + ((RegisterBC & 0xFF) << 8);
            break;
        case 0x42:
            // LD B, D
            RegisterBC = (RegisterBC & 0xFF) + (RegisterDE & 0xFF00);
            break;
        case 0x43:
            // LD B, E
            RegisterBC = (RegisterBC & 0xFF) + ((RegisterDE & 0xFF) << 8);
            break;
        case 0x44:
            // LD B, H
            RegisterBC = (RegisterBC & 0xFF) + (RegisterHL & 0xFF00);
            break;
        case 0x45:
            // LD B, L
            // Fall through
        case 0x46:
            // LD B, (HL)
            RegisterBC = (RegisterBC & 0xFF) + ((RegisterHL & 0xFF) << 8);
            break;
        case 0x47:
            // LD B, A
            RegisterBC = (RegisterBC & 0xFF) + (RegisterAF & 0xFF00);
            break;
        case 0x48:
            // LD C, B
            RegisterBC = ((RegisterBC & 0xFF00) >> 8) + (RegisterBC & 0xFF00);
            break;
        case 0x49:
            // LD C, C
            break;
        case 0x4A:
            // LD C, D
            RegisterBC = ((RegisterDE & 0xFF00) >> 8) + (RegisterBC & 0xFF00);
            break;
        case 0x4B:
            // LD C, E
            RegisterBC = (RegisterDE & 0xFF) + (RegisterBC & 0xFF00);
            break;
        case 0x4C:
            // LD C, H
            RegisterBC = ((RegisterHL & 0xFF00) >> 8) + (RegisterBC & 0xFF00);
            break;
        case 0x4D:
            // LD C, L
            // Fall through
        case 0x4E:
            // LD C, (HL)
            RegisterBC = (RegisterHL & 0xFF) + (RegisterBC & 0xFF00);
            break;
        case 0x4F:
            // LD C, A
            RegisterBC = ((RegisterAF & 0xFF00) >> 8) + (RegisterBC & 0xFF00);
            break;
        case 0x50:
            // LD D, B
            RegisterDE = (RegisterDE & 0xFF) + (RegisterBC & 0xFF00);
            break;
        case 0x51:
            // LD D, C
            RegisterDE = (RegisterDE & 0xFF) + ((RegisterBC & 0xFF) << 8);
            break;
        case 0x52:
            // LD D, D
            break;
        case 0x53:
            // LD D, E
            RegisterDE = (RegisterDE & 0xFF) + ((RegisterDE & 0xFF) << 8);
            break;
        case 0x54:
            // LD D, H
            RegisterDE = (RegisterDE & 0xFF) + (RegisterHL & 0xFF00);
            break;
        case 0x55:
            // LD D, L
            // Fall through
        case 0x56:
            // LD D, (HL)
            RegisterDE = (RegisterDE & 0xFF) + ((RegisterHL & 0xFF) << 8);
            break;
        case 0x57:
            // LD D, A
            RegisterDE = (RegisterDE & 0xFF) + (RegisterAF & 0xFF00);
            break;
        case 0x58:
            // LD E, B
            RegisterDE = ((RegisterBC & 0xFF00) >> 8) + (RegisterDE & 0xFF00);
            break;
        case 0x59:
            // LD E, C
            RegisterDE = (RegisterBC & 0xFF) + (RegisterDE & 0xFF00);
            break;
        case 0x5A:
            // LD E, D
            RegisterDE = ((RegisterDE & 0xFF00) >> 8) + (RegisterDE & 0xFF00);
            break;
        case 0x5B:
            // LD E, E
            break;
        case 0x5C:
            // LD E, H
            RegisterDE = ((RegisterHL & 0xFF00) >> 8) + (RegisterDE & 0xFF00);
            break;
        case 0x5D:
            // LD E, L
            // Fall through
        case 0x5E:
            // LD E, (HL)
            RegisterDE = (RegisterHL & 0xFF) + (RegisterDE & 0xFF00);
            break;
        case 0x5F:
            // LD E, A
            RegisterDE = ((RegisterAF & 0xFF00) >> 8) + (RegisterDE & 0xFF00);
            break;
        case 0x60:
            // LD H, B
            RegisterHL = (RegisterHL & 0xFF) + (RegisterBC & 0xFF00);
            break;
        case 0x61:
            // LD H, C
            RegisterHL = (RegisterHL & 0xFF) + ((RegisterBC & 0xFF) << 8);
            break;
        case 0x62:
            // LD H, D
            RegisterHL = (RegisterHL & 0xFF) + (RegisterDE & 0xFF00);
            break;
        case 0x63:
            // LD H, E
            RegisterHL = (RegisterHL & 0xFF) + ((RegisterDE & 0xFF) << 8);
            break;
        case 0x64:
            // LD H, H
            break;
        case 0x65:
            // LD H, L
            // Fall through
        case 0x66:
            // LD H, (HL)
            RegisterHL = (RegisterHL & 0xFF) + ((RegisterHL & 0xFF) << 8);
            break;
        case 0x67:
            // LD H, A
            RegisterHL = (RegisterHL & 0xFF) + (RegisterAF & 0xFF00);
            break;
        case 0x68:
            // LD L, B
            RegisterHL = ((RegisterBC & 0xFF00) >> 8) + (RegisterHL & 0xFF00);
            break;
        case 0x69:
            // LD L, C
            RegisterHL = (RegisterBC & 0xFF) + (RegisterHL & 0xFF00);
            break;
        case 0x6A:
            // LD L, D
            RegisterHL = ((RegisterDE & 0xFF00) >> 8) + (RegisterHL & 0xFF00);
            break;
        case 0x6B:
            // LD L, E
            RegisterHL = (RegisterDE & 0xFF) + (RegisterHL & 0xFF00);
            break;
        case 0x6C:
            // LD L, H
            RegisterHL = ((RegisterHL & 0xFF00) >> 8) + (RegisterHL & 0xFF00);
            break;
        case 0x6D:
            // LD L, L
            break;
        case 0x6E:
            // LD L, (HL)
            break;
        case 0x6F:
            // LD L, A
            RegisterHL = ((RegisterAF & 0xFF00) >> 8) + (RegisterHL & 0xFF00);
            break;
        case 0x70:
            // LD (HL), B
            RegisterHL = (RegisterBC & 0xFF00) >> 8;
            break;
        case 0x71:
            // LD (HL), C
            RegisterHL = RegisterBC & 0xFF;
            break;
        case 0x72:
            // LD(HL), D
            RegisterHL = (RegisterDE & 0xFF00) >> 8;
            break;
        case 0x73:
            // LD (HL), E
            RegisterHL = RegisterDE & 0xFF;
            break;
        case 0x74:
            // LD (HL), H
            RegisterHL = (RegisterHL & 0xFF00) >> 8;
            break;
        case 0x75:
            // LD (HL), L
            RegisterHL = RegisterHL & 0xFF;
            break;
        case 0x76:
            // HALT
            break;
        case 0x77:
            // LD (HL), A
            RegisterHL = (RegisterAF & 0xFF00) >> 8;
            break;
        case 0x78:
            // LD A, B
            RegisterAF = (RegisterAF & 0xFF) + (RegisterBC & 0xFF00);
            break;
        case 0x79:
            // LD A, C
            RegisterAF = (RegisterAF & 0xFF) + ((RegisterBC & 0xFF) << 8);
            break;
        case 0x7A:
            // LD A, D
            RegisterAF = (RegisterAF & 0xFF) + (RegisterDE & 0xFF00);
            break;
        case 0x7B:
            // LD A, E
            RegisterAF = (RegisterAF & 0xFF) + ((RegisterDE & 0xFF) << 8);
            break;
        case 0x7C:
            // LD A, H
            RegisterAF = (RegisterAF & 0xFF) + (RegisterHL & 0xFF00);
            break;
        case 0x7D:
            // LD A, L
            // Fall through
        case 0x7E:
            // LD A, (HL)
            RegisterAF = (RegisterAF & 0xFF) + ((RegisterHL & 0xFF) << 8);
            break;
        case 0x7F:
            // LD A, A
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
        case 0xA8:
            break;
        case 0xA9:
            break;
        case 0xAA:
            break;
        case 0xAB:
            break;
        case 0xAC:
            break;
        case 0xAD:
            break;
        case 0xAE:
            break;
        case 0xAF:
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
        case 0xC2:
            break;
        case 0xC3:
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
        case 0xCA:
            break;
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
        case 0xD2:
            break;
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
        case 0xDA:
            break;
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
        case 0xE0:
            // LD (a8), A
            // TODO: Implement memory map
            break;
        case 0xE1:
            break;
        case 0xE2:
            // LD (C), A
            // TODO: Implement memory map
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
        case 0xE9:
            break;
        case 0xEA:
            // LD (a16), A
            // TODO: Implement memory map
            break;
        case 0xEB:
            break;
        case 0xEC:
            break;
        case 0xED:
            break;
        case 0xEE:
            break;
        case 0xEF:
            break;
        case 0xF0:
            // LD A, (a8)
            // TODO: Implement memory map
            break;
        case 0xF1:
            break;
        case 0xF2:
            // LD A, (C)
            // TODO: Implement memory map
            break;
        case 0xF3:
            break;
        case 0xF4:
            break;
        case 0xF5:
            break;
        case 0xF6:
            break;
        case 0xF7:
            break;
        case 0xF8:
            // LD HL, SP+s8
            // TODO Get signed 8 bit
            RegisterHL = StackPointer;// + Get8BitValue();
            break;
        case 0xF9:
            break;
        case 0xFA:
            // LD A, (a16)
            // TODO: Implement memory map
            break;
        case 0xFB:
            break;
        case 0xFC:
            break;
        case 0xFD:
            break;
        case 0xFE:
            break;
        case 0xFF:
            break;
    }
}
