using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace easyL8
{
    public class Smartlight
    {
        private string[] ledArray = new string[64];

        public string led00 { get; set; }
        public string led01 { get; set; }
        public string led02 { get; set; }
        public string led03 { get; set; }
        public string led04 { get; set; }
        public string led05 { get; set; }
        public string led06 { get; set; }
        public string led07 { get; set; }
        public string led10 { get; set; }
        public string led11 { get; set; }
        public string led12 { get; set; }
        public string led13 { get; set; }
        public string led14 { get; set; }
        public string led15 { get; set; }
        public string led16 { get; set; }
        public string led17 { get; set; }
        public string led20 { get; set; }
        public string led21 { get; set; }
        public string led22 { get; set; }
        public string led23 { get; set; }
        public string led24 { get; set; }
        public string led25 { get; set; }
        public string led26 { get; set; }
        public string led27 { get; set; }
        public string led30 { get; set; }
        public string led31 { get; set; }
        public string led32 { get; set; }
        public string led33 { get; set; }
        public string led34 { get; set; }
        public string led35 { get; set; }
        public string led36 { get; set; }
        public string led37 { get; set; }
        public string led40 { get; set; }
        public string led41 { get; set; }
        public string led42 { get; set; }
        public string led43 { get; set; }
        public string led44 { get; set; }
        public string led45 { get; set; }
        public string led46 { get; set; }
        public string led47 { get; set; }
        public string led50 { get; set; }
        public string led51 { get; set; }
        public string led52 { get; set; }
        public string led53 { get; set; }
        public string led54 { get; set; }
        public string led55 { get; set; }
        public string led56 { get; set; }
        public string led57 { get; set; }
        public string led60 { get; set; }
        public string led61 { get; set; }
        public string led62 { get; set; }
        public string led63 { get; set; }
        public string led64 { get; set; }
        public string led65 { get; set; }
        public string led66 { get; set; }
        public string led67 { get; set; }
        public string led70 { get; set; }
        public string led71 { get; set; }
        public string led72 { get; set; }
        public string led73 { get; set; }
        public string led74 { get; set; }
        public string led75 { get; set; }
        public string led76 { get; set; }
        public string led77 { get; set; }

        public string[] getLED()
        {
            this.clearLED();
            ledArray = new string[] { led00, led01, led02, led03, led04, led05, led06, led07, 
                                            led10, led11, led12, led13, led14, led15, led16, led17,
                                        led20, led21, led22, led23, led24, led25, led26, led27,
                                            led30, led31, led32, led33, led34, led35, led36, led37,
                                        led04, led41, led42, led43, led44, led45, led46, led47,
                                            led50, led51, led52, led53, led54, led55, led56, led57,
                                        led60, led61, led62, led63, led64, led65, led66, led67,
                                            led70, led71, led72, led73, led74, led75, led76, led77};
            return ledArray;
        }
        public void clearLED()
        {
            ledArray = new String[] {};
        }
    }
}
