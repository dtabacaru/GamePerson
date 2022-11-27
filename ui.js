// NumberToHexString(val, padding)
//
// IN:  val:     Decimal value to convert to hex
//      padding: Number of 0s to pad
// OUT: n/a
//
// DESCRIPTION:
// Returns a hex string representation of val, with padding number of digits.
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
function ReadMemBox() {
    let jackson_sux = parseInt("0x" + document.getElementById("MemBoxInput").value);

    if (!isNaN(jackson_sux)) {
        if (jackson_sux >= 0 && jackson_sux <= 0xFFFF) {
            let lowerByte = ReadAddress(jackson_sux);
            let higherByte = jackson_sux <= 0xFFFE ? ReadAddress(jackson_sux + 1) : 0;
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
function UpdateNextVarUI() {
    document.getElementById("NextVar").innerHTML = NumberToHexString(Rom.getUint16(Read16BitReg(PC), false), 4);
}

// UpdateDebugUI()
//
// IN:  n/a
// OUT: n/a
//
// DESCRIPTION:
// Updates the Debug Fetch/Execute UI elements
//
function UpdateDebugUI() {
    document.getElementById("InstructionVar")   .innerHTML = InstructionStrings[Instruction];
    document.getElementById("OpcodeVar")        .innerHTML = NumberToHexString(Instruction, 2);
    document.getElementById("NextVar")          .innerHTML = NumberToHexString(Rom.getUint16(Read16BitReg(PC), false), 4);
    document.getElementById("ProgramCounterVar").innerHTML = NumberToHexString(Read16BitReg(PC), 4);
    document.getElementById("StackPointerVar")  .innerHTML = NumberToHexString(Read16BitReg(SP), 4);
    document.getElementById("AFVar")            .innerHTML = NumberToHexString(Read16BitReg(AF), 4);
    document.getElementById("BCVar")            .innerHTML = NumberToHexString(Read16BitReg(BC), 4);
    document.getElementById("DEVar")            .innerHTML = NumberToHexString(Read16BitReg(DE), 4);
    document.getElementById("HLVar")            .innerHTML = NumberToHexString(Read16BitReg(HL), 4);

    document.getElementById("FetchButton")  .disabled = !document.getElementById("FetchButton").disabled;
    document.getElementById("ExecuteButton").disabled = !document.getElementById("ExecuteButton").disabled;
}
