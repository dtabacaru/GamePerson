/* NOTES
Bit 7 - Not used
Bit 6 - Not used
Bit 5 - P15 Select Action buttons    (0=Select)  ROM polls by pulling low    active LOW
Bit 4 - P14 Select Direction buttons (0=Select)  ROM polls by pulling low    active LOW
Bit 3 - P13 Input: Down  or Start    (0=Pressed) (Read Only)
Bit 2 - P12 Input: Up    or Select   (0=Pressed) (Read Only)
Bit 1 - P11 Input: Left  or B        (0=Pressed) (Read Only)
Bit 0 - P10 Input: Right or A        (0=Pressed) (Read Only)
 *
 *
 *  
 *  add this to dan's memory map under I/O registers 
 *  there is a note about 0BJ registers on page 272
 *  9 = IME gameboy manual does not state an address, top of page 269
 *  need to decide whether I need if or else if statement for P14 & P15. probably else if since ROM polls each pin sequentially 
 */


var ControlRegister = []; // control register array

var P14 = 1; // pulling P14 low polls directional buttons
var P15 = 1; // pulling P15 low polls action buttons

//#defines used for ControlRegister
const P1    = 0; //address 0xFF00
const SB    = 1; //address 0xFF01
const SC    = 2; //address0xFF02
const DIV   = 3; //address0xFF04
const TIMA  = 4; //address 0xFF05
const TMA   = 5; //address0xFF06
const TAC   = 6; //address0xFF07
const IF    = 7; //address0xFF0F
const IE    = 8; //address0xFFFF
const IME   = 9; //addressIME gameboy manual does not state an address, top of page 269
const LCDC  = 10; //address0xFF40
const STAT  = 11; //address0xFF41
const SCY   = 12; //address0xFF42
const SCX   = 13; //address0xFF43
const LY    = 14; //address0xFF44
const LYC   = 15; //address0xFF45
const DMA   = 16; //address0xFF46
const BGP   = 17; //address0xFF47
const OBP0  = 18; //address0xFF48
const OBP1  = 19; // 19 = OBP1 address 0xFF49
const WYone = 20; // 20 = WY address 0xFF4A   window Y-coordinate
const WYtwo = 21; // 21 = WY address 0xFF4B   window X-coordinate
const KEY1  = 22; //address 0xFF4D
const VBK   = 23; //address 0xFF4F
const HDMA1 = 24; //address 0xFF51
const HDMA2 = 25; //address 0xFF52
const HDMA3 = 26; //address 0xFF53
const HDMA4 = 27; //address 0xFF54
const HDMA5 = 28; //address 0xFF55
const RP    = 29; //address 0xFF56
const BCPS  = 30; //address 0xFF68
const BCPD  = 31; //address 0xFF69
const OCPS  = 32; //address 0xFF6A
const OCPD  = 33; //address 0xFF6B
const SVBK  = 34; //address 0xFF70
const OBJ01 = 35; //OBJ0 address 0xFE00   LCD Y-coordinate
const OBJ02 = 36; //OBJ0 address 0xFE01   LCD X-coordinate
const OBJ03 = 37; //OBJ0 address 0xFE02   character code
const OBJ04 = 38; //38 = OBJ0 address 0xFE03   attribute flag



document.addEventListener('keyup', function (event) {
    if (P14 == 0) { //checking if P14 is pulled low by ROM
        if (event.keyCode == 38) { // pressing the up arrow
            ControlRegister[IF] |= 0x10; //set IF flag
            ControlRegister[P1] &= 0b11111011; // set bit 2 low

        }
        else if (event.keyCode == 40) { // pressing the down arrow
            ControlRegister[IF] |= 0x10; //set IF flag
            ControlRegister[P1] &= 0b11110111; // set bit 3 low
        }

        else if (event.keyCode == 37) { // pressing the left arrow
            ControlRegister[IF] |= 0x10; //set IF flag
            ControlRegister[P1] &= 0b11111101; //set bit 1 low
        }

        else if (event.keyCode == 39) { // pressing the right arrow
            ControlRegister[IF] |= 0x10; //set IF flag
            ControlRegister[P1] &= 0b11111110; // set bit 0 low
        }
    }

     else if (P15 == 0) { // checkig if P15 is pulled low by ROM
        if (event.keyCode == 83) { // pressing the 'S' key for button A on the gameboy
            ControlRegister[IF] |= 0x10; //set IF flag
            ControlRegister[P1] &= 0b11111110; // set 0 bit low
        }

        else if (event.keyCode == 65) { // pressing the 'A' key for button B on the gameboy
            ControlRegister[IF] |= 0x10; //set IF flag
            ControlRegister[P1] &= 0b11111101; //set bit 1 low
        }

        else if (event.keyCode == 82) { // pressing the R key for button select on the gameboy
            ControlRegister[IF] |= 0x10; //set IF flag
            ControlRegister[P1] &= 0b11111011; // set bit 2 low

        }

        else if (event.keyCode == 84) { // pressing the T key for button start on the gameboy
            ControlRegister[IF] |= 0x10; //set IF flag
            ControlRegister[P1] &= 0b11110111; // set bit 3 low
        }
    }
    
});

