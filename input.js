/*
Bit 7 - Not used
Bit 6 - Not used
Bit 5 - P15 Select Action buttons    (0=Select)
Bit 4 - P14 Select Direction buttons (0=Select)
Bit 3 - P13 Input: Down  or Start    (0=Pressed) (Read Only)
Bit 2 - P12 Input: Up    or Select   (0=Pressed) (Read Only)
Bit 1 - P11 Input: Left  or B        (0=Pressed) (Read Only)
Bit 0 - P10 Input: Right or A        (0=Pressed) (Read Only)
*/

/* NOTES
 * 
 * write bits to register 0xFF00
 */
//in the GB manual d16 immediate bits means what register the PC is currently pointing to

/*
 * document.addEventListener('keyup', function (event)){
    if (event.keyCode == 38) {
        RegisterIF = RegisterIF + 0x10;
        RegisterP1 = RegisterP1 +
        //alert('Up was pressed');

    }
    else if (event.keyCode == 40) {
        //alert('Down was pressed');
    }
}
 * 
 */



//make all these an array you dummy. also missing second page of registers
//add this to dan's memory map under I/O registers

var RegisterP1 = 0;
var RegisterSB = 0;
var RegisterSC = 0;
var RegisterDIV = 0;
var RegisterTIMA = 0;
var RegisterTMA = 0;
var RegisterTAC = 0;
var RegisterIF = 0;
var RegisterIE = 0;


document.addEventListener('keyup', function (event) {
    if (event.keyCode == 38) {
        RegisterIF |= 0x10;
        RegisterP1 |= 0x04;
        //alert('Up was pressed');

    }
    else if (event.keyCode == 40) {
        RegisterIF |= 0x10;
        RegisterP1 |= 0x04;
        //alert('Down was pressed');
    }

    else if (event.keyCode == 37) {
        //alert('Left was pressed');
    }

    else if (event.keyCode == 39) {
        //alert('Right was pressed');
    }
});

