const CLK_F         = 4.194304e6; // Clock frequency (Hz)
const RAM_SIZE      = 8 * 1024;   // 8 KB
const REGISTER_SIZE = 2;          // Bytes

var Ram  = new Uint8Array(RAM_SIZE);
var EchoRam   = new Uint8Array(RAM_SIZE);
var Rom  = [];
var RomReader = new FileReader();
var Instruction = 0x00;

function ReadRom() {
    RomReader.onload = function () 
    {
        Rom = new Uint8Array(RomReader.result);
        //RunGamePerson();
    };
    RomReader.readAsArrayBuffer(document.getElementById("RomFileInput").files[0]);
}

function RunGamePerson() {
    while (true) { // Main CPU loop
        Step();
    }
}

function NumberToHexString(val, padding) {
    var jackson_sux = Number(val).toString(16);
    while (jackson_sux.length < padding) {
        jackson_sux = "0" + jackson_sux;
    }
    return "0x" + jackson_sux;
}

function ReadMemBox() {
    let address = parseInt(document.getElementById("MemBoxInput").value);

    if (!isNaN(address)) {
        if (address >= 0 && address <= 0xFFFF) {
            let lowerByte = ReadAddress(address);
            let higherByte = address < 0xFFFE ? ReadAddress(address+1) : 0;
            document.getElementById("MemBoxVar").innerHTML = NumberToHexString(lowerByte | (higherByte << 8), 4);
        }
    }
}

function UpdateDebug() {
    document.getElementById("InstructionVar").innerHTML = InstructionStrings[Instruction];
    document.getElementById("OpcodeVar").innerHTML = NumberToHexString(Instruction, 2);
    document.getElementById("NextVar").innerHTML = NumberToHexString((Rom[ProgramCounter] << 8) | Rom[ProgramCounter+1], 4);
    document.getElementById("ProgramCounterVar").innerHTML = NumberToHexString(ProgramCounter, 4);
    document.getElementById("StackPointerVar").innerHTML = NumberToHexString(StackPointer, 4);
    document.getElementById("AFVar").innerHTML = NumberToHexString(RegisterAF, 4);
    document.getElementById("BCVar").innerHTML = NumberToHexString(RegisterBC, 4);
    document.getElementById("DEVar").innerHTML = NumberToHexString(RegisterDE, 4);
    document.getElementById("HLVar").innerHTML = NumberToHexString(RegisterHL, 4);
}

function Step() {
    Instruction = Get8BitValue()
    ProcessInstruction(Instruction);
    UpdateDebug();
}

function Get8BitValue() {
    let jackson_sux = Rom[ProgramCounter];
    ProgramCounter += 1; // 8 bit cpu = 1 byte increments
    return jackson_sux;
}

function GetSigned8BitValue() {
    let jackson_sux = new DataView(Rom, ProgramCounter, 1).getInt8(0, true);
    ProgramCounter += 1; // 8 bit cpu = 1 byte increments
    return jackson_sux;
}

function Get16BitValue() {
    return Get8BitValue() + (Get8BitValue() << 8);
}

// https://gbdev.gg8.se/wiki/articles/Memory_Map
// TODO: Implement me!
function ReadAddress(address) {
    if (address > 0xFFFE) {        // (FFFF-FFFF) Interrupts Enable Register (IE)

    } else if (address > 0xFF7F) { // (FF80-FFFE) High RAM (HRAM)

    } else if (address > 0xFEFF) { // (FF00-FF7F) I/O Registers

    } else if (address > 0xFE9F) { // (FEA0-FEFF) Not Usable

    } else if (address > 0xFDFF) { // (FE00-FE9F) Sprite attribute table (OAM)

    } else if (address > 0xDFFF) { // (E000-FDFF) Mirror of C000~DDFF (ECHO RAM) Typically not used

    } else if (address > 0xBFFF) { // (C000-DFFF) 8KB Work RAM (WRAM) bank 0+1	
        address -= 0xC000;
        return Ram[address];
    } else if (address > 0x9FFF) { // (A000-BFFF) 8KB External RAM In cartridge, switchable bank if any

    } else if (address > 0x7FFF) { // (8000-9FFF) 8KB Video RAM (VRAM) Only bank 0 in Non-CGB mode

    } else {                       // (0000-3FFF) 16KB ROM bank 00 From cartridge, usually a fixed bank
        // address -= 0;
        return Rom[address];
    }
}

// https://gbdev.gg8.se/wiki/articles/Memory_Map
// TODO: Implement me!
function WriteAddress(address, val) {

    //TODO: val check? handle rollover here?

    if (address > 0xFFFE) {        // (FFFF-FFFF) Interrupts Enable Register (IE)

    } else if (address > 0xFF7F) { // (FF80-FFFE)   High RAM (HRAM)

    } else if (address > 0xFEFF) { // (FF00-FF7F)   I/O Registers

    } else if (address > 0xFE9F) { // (FEA0-FEFF)   Not Usable

    } else if (address > 0xFDFF) { // (FE00-FE9F)   Sprite attribute table (OAM)

    } else if (address > 0xDFFF) { // (E000-FDFF)   Mirror of C000~DDFF (ECHO RAM)	Typically not used

    } else if (address > 0xBFFF) { // (C000-DFFF)   8KB Work RAM (WRAM) bank 0+1
        address -= 0xC000;
        Ram[address] = val;
        return;
    } else if (address > 0x9FFF) { // (A000-BFFF)   8KB External RAM	In cartridge, switchable bank if any

    } else if (address > 0x7FFF) { // (8000-9FFF)   8KB Video RAM (VRAM)	Only bank 0 in Non-CGB mode

    } else {                       // (0000-3FFF)	16KB ROM bank 00	From cartridge, usually a fixed bank
        //address -= 0;
        Rom[address] = val;
        return;
    }
}

function ProcessInstruction(op) {
    
    switch (op) {
        // NOP
        case 0x00:
            break;
        // LD BC, d16
        case 0x01:
            RegisterBC = Get16BitValue();
            break;
        // LD (BC), A
        case 0x02:
            WriteAddress(RegisterBC, ReadRegisterA());
            break;
        // INC BC
        case 0x03:
            break;
        // INC B
        case 0x04:
            break;
        // DEC B
        case 0x05:
            break;
        // LD B, d8
        case 0x06:
            WriteRegisterB(Get8BitValue());
            break;
        // RLCA    
        case 0x07:
            break;
        // LD (a16), SP
        case 0x08:
            let address = Get16BitValue();
            WriteAddress(address,   ReadRegisterP());
            WriteAddress(address+1, ReadRegisterS());
            break;
        // ADD HL, BC
        case 0x09:
            break;
        // LD A, (BC)
        case 0x0A:
            WriteRegisterA(ReadAddress(RegisterBC));
            break;
        // DEC BC
        case 0x0B:
            break;
        // INC C
        case 0x0C:
            break;
        // DEC C
        case 0x0D:
            break;
        // LD C, d8
        case 0x0E:
            WriteRegisterC(Get8BitValue());
            break;
        // RRCA
        case 0x0F:
            break;
        // STOP
        case 0x10:
            break;
        // LD DE, d16
        case 0x11:
            RegisterDE = Get16BitValue();
            break;
        // LD(DE), A
        case 0x12:
            WriteAddress(RegisterDE, ReadRegisterA());
            break;
        // INC DE
        case 0x13:
            break;
        // INC D
        case 0x14:
            break;
        // DEC D
        case 0x15:
            break;
        // LD D, d8
        case 0x16:
            WriteRegisterD(Get8BitValue());
            break;
        // RLA
        case 0x17:
            break;
        // JR s8
        case 0x18:
            break;
        // ADD HL, DE
        case 0x19:
            break;
        // LD A, (DE)
        case 0x1A:
            WriteRegisterA(ReadAddress(ReadRegisterDE));
            break;
        // DEC DE
        case 0x1B:
            break;
        // INC E
        case 0x1C:
            break;
        // DEC E
        case 0x1D:
            break;
        // LD E, d8
        case 0x1E:
            WriteRegisterE(Get8BitValue());
            break;
        // RRA
        case 0x1F:
            break;
        // JR NZ, s8
        case 0x20:
            break;
        // LD HL, d16
        case 0x21:
            RegisterHL = Get16BitValue();
            break;
        // LD (HL+), A
        case 0x22:
            // TODO: Carry flags? Overflow?
            WriteAddress(RegisterHL, ReadRegisterA());
            RegisterHL += 1;
            break;
        // INC HL
        case 0x23:
            break;
        // INC H
        case 0x24:
            break;
        // DEC H
        case 0x25:
            break;
        // LD H, d8
        case 0x26:
            WriteRegisterH(Get8BitValue());
            break;
        // DAA
        case 0x27:
            break;
        // JR Z, s8
        case 0x28:
            break;
        // ADD HL, HL
        case 0x29:
            break;
        // LD A, (HL+)
        case 0x2A:
            // TODO: Carry flags? Overflow?
            WriteRegisterA(ReadAddress(RegisterHL));
            RegisterHL += 1;
            break;
        // DEC HL
        case 0x2B:
            break;
        // INC L
        case 0x2C:
            break;
        // DEC L
        case 0x2D:
            break;
        // LD L, d8
        case 0x2E:
            WriteRegisterL(Get8BitValue());
            break;
        // CPL
        case 0x2F:
            break;
        // JR NC, s8
        case 0x30:
            break;
        // LD SP, d16
        case 0x31:
            StackPointer = Get16BitValue();
            break;
        // LD(HL-), A
        case 0x32:
            // TODO: Carry flags? Overflow?
            WriteAddress(RegisterHL, ReadRegisterA());
            RegisterHL -= 1;
            break;
        // INC SP
        case 0x33:
            break;
        // INC (HL)
        case 0x34:
            break;
        // DEC (HL)
        case 0x35:
            break;
        // LD(HL), d8
        case 0x36:
            WriteAddress(RegisterHL, Get8BitValue());
            break;
        // SCF
        case 0x37:
            break;
        // JR C, s8
        case 0x38:
            break;
        // ADD HL, SP
        case 0x39:
            break;
        // LD A, (HL-)
        case 0x3A:    
            // TODO: Carry flags? Overflow?
            WriteRegisterA(ReadAddress(RegisterHL));
            RegisterHL -= 1;
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
            WriteRegisterA(Get8BitValue());
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
        // LD (a8), A
        case 0xE0:
            WriteAddress(Get8BitValue(), ReadRegisterA());
            break;
        case 0xE1:
            break;
        // LD (C), A
        case 0xE2:
            WriteAddress(ReadRegisterC(), ReadRegisterA());
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
        // LD (a16), A
        case 0xEA:
            WriteAddress(Get16BitValue(), ReadRegisterA());
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
        // LD A, (a8)
        case 0xF0:
            WriteRegisterA(ReadAddress(Get8BitValue()));
            break;
        case 0xF1:
            break;
        // LD A, (C)
        case 0xF2:
            WriteRegisterA(ReadAddress(ReadRegisterC()));
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
        // LD HL, SP+s8
        case 0xF8:
            RegisterHL = StackPointer + GetSigned8BitValue();
            break;
        // LD SP, HL
        case 0xF9:
            StackPointer = RegisterHL;
            break;
        // LD A, (a16)
        case 0xFA:
            WriteRegisterA(ReadAddress(Get16BitValue()));
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
