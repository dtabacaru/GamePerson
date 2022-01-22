var CLK_F    = 4.194304e6;     // Clock frequency (Hz)
var RAM_SIZE = 8 * 1024;       // 8 KB
var RAM = new Array(RAM_SIZE); // The emulated RAM space
var ROM = [];                  // The emulated ROM space

var SP = 0;      // Stack pointer
var PC = 0x0100; // Program counter

var REGISTERS = [];
REGISTERS["AF"] = 0; // A = Accumulator; F = Flag
REGISTERS["BC"] = 0; // Gen storage
REGISTERS["DE"] = 0; // Gen storage
REGISTERS["HL"] = 0; // Gen storage / memory pointer

function IncrementCounter() {
    PC += 1; // CPU is 8 bit = 1 byte
}

function ProcessInstruction(op) {
    switch (op) {
    
    case 0x00:    
    break;
    
    case 0x01:    
    break;
    
    case 0x02:    
    break;
    
    case 0x03:    
    break;
    
    case 0x04:    
    break;
    
    case 0x05:    
    break;
    
    case 0x06:   
    break;
    
    case 0x07:    
    break;
    
    case 0x08:    
    break;
    
    case 0x09    
    break;
    
    case 0x0A:    
    break;
    
    case 0x0B:    
    break;
    
    case 0x0C:    
    break;
    
    case 0x0D:
    break;
    
    case 0x0E:    
    break;
    
    case 0x0F:    
    break;
    
    case 0x10:    
    break;
    
    case 0x11:
    break;
    
    case 0x12:
    break;
    
    case 0x13:
    break;
    
    case 0x14:
    break;
    
    case 0x15:
    break;
    
    case 0x16:
    break;
    
    case 0x17:
    break;
    
    case 0x18:
    break;
    
    case 0x19:
    break;
    
    case 0x1A:
    break;
    
    case 0x1B:
    break;
    
    case 0x1C:
    break;
    
    case 0x1D:
    break;
    
    case 0x1E:
    break;
    
    case 0x1F:
    break;
    
    
    }
}
