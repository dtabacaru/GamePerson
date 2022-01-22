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

    }
}
