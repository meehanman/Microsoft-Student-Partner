using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Navigation;
using Microsoft.Phone.Controls;
using Microsoft.Phone.Shell;
using easyL8.Resources;
using System.Windows.Media;
using System.Windows.Shapes;
using Newtonsoft.Json;

namespace easyL8
{
    public partial class MainPage : PhoneApplicationPage
    {
        // Constructor
        public MainPage()
        {
            InitializeComponent();
            DrawCanvas();
            //for (int i = 0; i < 8; i++){for (int j = 0; j < 8; j++){buttonColor((string)(i + "" + j), "white");} //Blacken all squares
            
            // Sample code to localize the ApplicationBar
            //BuildLocalizedApplicationBar();
        }
        Smartlight Smartl8 = new Smartlight();
        private string masterAddress = "http://54.228.218.122/l8-server-simulator/l8s";
        private string l8ID = "/75263350ffe051e37a870a327f166fc6";
        private int x = 0;
        private int y = 0;

        /// <summary>
        /// /////////////////////////////////////////////////////////////////////////////////////////////////
        /// </summary>
        /// <param name="color"></param>
        public void SetsuperLED(string color)
        {
            string jsonexample = "{\"superled\":\"" + color + "\"}";
            Uri myUri = new Uri(masterAddress + l8ID + "/superled");
            SendPost(myUri, jsonexample, "SEND");
        }

        public void resetMatrix()
        {
            string matrixColor = "#FFFFFF";
            int[,] matrix = new int[8,8];
			for (int i = 0; i< 8; i++) {
				for (int j = 0; j < 8; j++) {
                    string jsonexample = "{\"led" + i + j + "\":\"" + matrixColor + "\"}";
                    buttonColor((string)(i + "" + j), matrixColor);
                    y = 0;
                    x = 0;
                    txtblocktest.Text = "";
                    Uri myUri = new Uri(masterAddress + l8ID);
                    SendPost(myUri, jsonexample, "SEND");
				}
			}
        }



        public void snakeLED(string color)
        {
            string jsonexample = "{\"led"+x+y+"\":\"" + color + "\"}";
            buttonColor((string)(x+""+y), color);
            if (y != 7)
            {
                y++;
            }
            else if (x != 7)
            {
                x++; y = 0;
            }
            else if (y == 7 && x == 7)
            {
                y = 0; x = 0;
            }
            Uri myUri = new Uri(masterAddress + l8ID);
            SendPost(myUri, jsonexample,"SEND");
        }

        public void SendPost(Uri uri, string json, string type)
        {
            var webClient = new WebClient();

            if (type == "SEND")
            {
                webClient.Headers[HttpRequestHeader.ContentType] = "application/json";
                webClient.UploadStringCompleted += this.sendPostCompleted;
                webClient.UploadStringAsync(uri, "PUT", json);
            }
            else
            {
                webClient.DownloadStringAsync(uri);
                webClient.DownloadStringCompleted += this.RecievePostCompleted;
            }
            
        }
        private void sendPostCompleted(object sender, UploadStringCompletedEventArgs e)
        {
            // Handle result
            try
            {
                txtblocktest.Text += "";
                txtblocktest.Text += e.Result;
                if (e.Result != "[]")
                {
                    JsonConvert.DeserializeObject<Smartlight>(e.Result);
                    txtblocktest.Text = e.Result + txtblocktest.Text;
                }
            }
            catch { }

        }
        
        private void RecievePostCompleted(object sender, DownloadStringCompletedEventArgs e)
        {
            // Handle result
            try
            {
                Smartl8 = JsonConvert.DeserializeObject<Smartlight>(e.Result);
                txtblocktest.Text = e.Result + txtblocktest.Text;
                for (int i = 0; i < 8; i++)
                {
                    for (int j = 0; j < 8; j++)
                    {
                        String[] LEDARRAY = Smartl8.getLED();
                        String a = (i + "" + j);

                        buttonColor((i + "" + j), LEDARRAY[Convert.ToInt32(a, 8)]);
                    }
                }
            }
            catch { }

        }

        public void getLEDs(){
            Uri myUri = new Uri(masterAddress + l8ID + "/led?" + DateTime.Now.ToString("yyyyMMddHHmmssffff"));
            SendPost(myUri, "[]", "RECIEVE");
        }

        private void btnr_Click(object sender, RoutedEventArgs e)
        {
            SetsuperLED("#FF0000");
            snakeLED("#FF0000");
        }

        private void btno_Click(object sender, RoutedEventArgs e)
        {
            SetsuperLED("#FFA500");
            snakeLED("#FFA500");
        }

        private void btng_Click(object sender, RoutedEventArgs e)
        {
            SetsuperLED("#008000");
            snakeLED("#008000");
        }

        private void btny_Click(object sender, RoutedEventArgs e)
        {
            SetsuperLED("#FFFF00");
            snakeLED("#FFFF00");
        }

        private void btnb_Click(object sender, RoutedEventArgs e)
        {
            SetsuperLED("#0000FF");
            snakeLED("#0000FF");
        }

        private void btni_Click(object sender, RoutedEventArgs e)
        {
            SetsuperLED("#800080");
            snakeLED("#800080");
        }

        private void btnv_Click(object sender, RoutedEventArgs e)
        {
            SetsuperLED("#EE82EE");
            snakeLED("#EE82EE");
        }

        private void btnw_Click(object sender, RoutedEventArgs e)
        {
            SetsuperLED("#FFFFFF");
            snakeLED("#FFFFFF");
        }

        public void buttonColor(string xy, string color){
            L8Box.Children.OfType<Rectangle>().First(x => x.Name.Equals(xy)).Fill = colorChanger(HEXtoRGB(color));
        }

        public Color HEXtoRGB(string hex)
        {
            if (hex.Length == 7 && hex.Substring(0,1) == "#")
            {
                byte decValue1 = Convert.ToByte(hex.Substring(1, 2), 16);
                byte decValue2 = Convert.ToByte(hex.Substring(3, 2), 16);
                byte decValue3 = Convert.ToByte(hex.Substring(5, 2), 16);
                return Color.FromArgb(255, decValue1, decValue2, decValue3);
            }
            else 
            { 
                return Color.FromArgb(255, 255, 255, 255); //IF not a real hex, return white
            }
        }

        private void l8_Smartlight_Hold(object sender, System.Windows.Input.GestureEventArgs e)
        {
            resetMatrix();
        }

        private RadialGradientBrush colorChanger(Color color)
        {
            RadialGradientBrush Pixelbrush = new RadialGradientBrush();
            GradientStop start = new GradientStop();
            start.Color = Colors.White; start.Offset = 0.0;
            GradientStop end = new GradientStop();
            end.Color = color; end.Offset = 0.655;
            Pixelbrush.GradientStops.Add(start);
            Pixelbrush.GradientStops.Add(end);
            return Pixelbrush;
        }

        private void DrawCanvas(){

            Rectangle pixel;

            for (int i = 0; i < 8; i++)
            {
                for (int j = 0; j < 8; j++)
                {
                    pixel = new Rectangle();
                    pixel.Fill = colorChanger(Colors.Black);
                    pixel.Width = pixel.Height = 50;
                    pixel.RadiusX = pixel.RadiusY = 5;
                    pixel.Name = i+""+j; //ie 00, 01, 02
                    L8Box.Children.Add(pixel);
                    Canvas.SetTop(pixel, (i * 51));
                    Canvas.SetLeft(pixel, (j*51));
                }
            }

        }

        private void btnTESTUPDATE_Click(object sender, RoutedEventArgs e)
        {
            getLEDs();
        }
       
    }
}