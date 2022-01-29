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
 *  make all these an array you dummy. also missing second page of registers
 *  add this to dan's memory map under I/O registers  
 */


//Control register array descriptions
// 0 = P1 address 0xFF00
// 1 = SB address 0xFF01
// 2 = SC address 0xFF02
// 3 = DIV address 0xFF04
// 4 = TIMA address 0xFF05
// 5 = TMA address 0xFF06
// 6 = TAC address 0xFF07
// 7 = IF address 0xFF0F
// 8 = IE address 0xFFFF
// 9 = IME gameboy manual does not state an address, top of page 269
// 10 = LCDC address 0xFF40
// 11 = STAT address 0xFF41
// 12 = SCY address 0xFF42
// 13 = SCX address 0xFF43
// 14 = LY address 0xFF44
// 15 = LYC address 0xFF45
// 16 = DMA address 0xFF46
// 17 = BGP address 0xFF47
// 18 = OBP0 address 0xFF48
// 19 = OBP1 address 0xFF49
// 20 = WY address 0xFF4A   window Y-coordinate
// 21 = WY address 0xFF4B   window X-coordinate
// 22 = KEY1 address 0xFF4D
// 23 = VBK address 0xFF4F
// 24 = HDMA1 address 0xFF51
// 25 = HDMA2 address 0xFF52
// 26 = HDMA3 addrress 0xFF53
// 27 = HDMA4 address 0xFF54
// 28 = HDMA5 address 0xFF55
// 29 = RP address 0xFF56
// 30 = BCPS address 0xFF68
// 31 = BCPD address 0xFF69
// 32 = OCPS address 0xFF6A
// 33 = OCPD address 0xFF6B
// 34 = SVBK address 0xFF70
// 35 = OBJ0 address 0xFE00   LCD Y-coordinate
// 36 = OBJ0 address 0xFE01   LCD X-coordinate
// 37 = OBJ0 address 0xFE02   character code
// 38 = OBJ0 address 0xFE03   attribute flag

const P1    = 0;
const SB    = 1;
const SC    = 2;
const DIV   = 3;
const TIMA  = 4;
const TMA   = 5;
const TAC   = 6;
const IF    = 7;
const IE    = 8;
const IME   = 9;// 9 = IME gameboy manual does not state an address, top of page 269
const LCDC  = 10;
const STAT  = 11;
const SCY   = 12;
const SCX   = 13;
const LY    = 14;
const LYC   = 15;
const DMA   = 16;
const BGP   = 17;
const OBP0  = 18;
const OBP1  = 19;
const WYone = 20;// 20 = WY address 0xFF4A   window Y-coordinate
const WYtwo = 21;// 21 = WY address 0xFF4B   window X-coordinate
const KEY1  = 22;
const VBK   = 23;
const HDMA1 = 24;
const HDMA2 = 25;
const HDMA3 = 26;
const HDMA4 = 27;
const HDMA5 = 28;
const RP    = 29;
const BCPS  = 30;
const BCPD  = 31;
const OCPS  = 32;
const OCPD  = 33;
const SVBK  = 34;
const OBJ01 = 35;// 35 = OBJ0 address 0xFE00   LCD Y-coordinate
const OBJ02 = 36;// 36 = OBJ0 address 0xFE01   LCD X-coordinate
const OBJ03 = 37;// 37 = OBJ0 address 0xFE02   character code
const OBJ04 = 38;// 38 = OBJ0 address 0xFE03   attribute flag
//there is a note about 0BJ registers on page 272

var ControlRegister = []; // constrol register array
var P14 = 1; // pulling P14 low polls directional buttons
var P15 = 1; // pulling P15 low polls action buttons


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

    if (P15 == 0) { // checkig if P15 is pulled low by ROM
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

