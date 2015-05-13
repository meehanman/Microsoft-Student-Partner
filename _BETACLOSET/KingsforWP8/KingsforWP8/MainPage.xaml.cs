using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Navigation;
using Microsoft.Phone.Controls;
using Microsoft.Phone.Shell;
using KingsforWP8.Resources;
using System.Windows.Media.Imaging;
using System.Windows.Media;
using Microsoft.Devices;

namespace KingsforWP8
{

    public partial class MainPage : PhoneApplicationPage
    {
        deck cardDeck = new deck();
        String[,] rules = new string[,] {{"A","Waterfall","Everyone Chugs, You can stop when the person to your right stops, or just keep going!"},
                                         {"2","You","Give a drink!"},
                                         {"3","Me","Take a drink!"},
                                         {"4","Whores","Chicks drink!"},
                                         {"5","Slap","Last person to slap the table drinks!"},
                                         {"6","Dicks","Guys Drink!"},
                                         {"7","Thumbmaster","You are the thumbmaster. Place your thumb on the edge of the table at any time, everyone must too. Last person to do so drinks!"},
                                         {"8","Categories","Take turns naming an item in the chosen category quickly. First to pause or miss drinks!"},
                                         {"9","Bust a Rhyme","You choose a word. Take turns saying rhyming words quickly. First to pause or miss drinks!"},
                                         {"10","Social","Cheers, Everyone drinks!"},
                                         {"J","Rule","Make a rule. If someone breaks it at any time they must drink!"},
                                         {"Q","Quiz Masters","Take turns asking questions to each other quickly. First to pause or laugh drinks!"},
                                         {"K","King's Cup","Pour your drink into the cup. Last King drawn drinks the cup and ends the game!"}};
        // Constructor
        public MainPage()
        {
            InitializeComponent();
            //BuildLocalizedApplicationBar();
            cardDeck.shuffle();
        }

        public void setCard()
        {
            bottomFace.Text = topFace.Text = cardDeck.getFace();
            bottomSuit.Source = topSuit.Source = new BitmapImage(new Uri(cardDeck.getSuit(), UriKind.Relative));
            txtRule.Text = rules[cardDeck.getCardLocation(cardDeck.getFace()), 1];
            txtDesc.Text = rules[cardDeck.getCardLocation(cardDeck.getFace()), 2];
            if (bottomFace.Text == "K")
            {
                //cardDeck.KingCountUp();
                VibrateController testVibrateController = VibrateController.Default;
                testVibrateController.Start(TimeSpan.FromSeconds(3));
                cardDeck.KingCountUp();
                //beerLogo.Source = new BitmapImage(new Uri("beer" + cardDeck.getKingCount() + ".png", UriKind.Relative));
                if (cardDeck.getKingCount() == 1) { beerLogo1.Visibility = whileBar.Visibility = Visibility.Visible; }
                if (cardDeck.getKingCount() == 2) { beerLogo2.Visibility = Visibility.Visible; }
                if (cardDeck.getKingCount() == 3) { beerLogo3.Visibility = Visibility.Visible; }
                if (cardDeck.getKingCount() == 4) { beerLogo4.Visibility = Visibility.Visible; }
                if (cardDeck.getKingCount() == 4)
                {
                    beerLogo.Source = bottomSuit.Source = topSuit.Source = new BitmapImage(new Uri("", UriKind.Relative));
                    beerLogo1.Visibility = beerLogo2.Visibility = beerLogo3.Visibility = beerLogo4.Visibility = whileBar.Visibility = Visibility.Collapsed;
                    txtRule.Text = "Game Ended (4 Kings)";
                    txtDesc.Text = "You take the pint in the middle of the table and drink it all! Every last drop.";
                    bottomFace.Text = topFace.Text = "";
                    cardDeck.shuffle();
                }
            }
            if (cardDeck.getSuit() == "hearts.png" || cardDeck.getSuit() == "diamonds.png")
            {
                txtRule.Foreground = new SolidColorBrush(Colors.Red);
                txtDesc.Foreground = new SolidColorBrush(Colors.Red);
            }
            else
            {
                txtRule.Foreground = new SolidColorBrush(Colors.Black);
                txtDesc.Foreground = new SolidColorBrush(Colors.Black);
            }
        }
        
        private void MainCanvas_Tap(object sender, System.Windows.Input.GestureEventArgs e)
        {
            cardDeck.nextCard();
            setCard();
        }

        // Sample code for building a localized ApplicationBar
        //private void BuildLocalizedApplicationBar()
        //{
        //    // Set the page's ApplicationBar to a new instance of ApplicationBar.
        //    ApplicationBar = new ApplicationBar();

        //    // Create a new button and set the text value to the localized string from AppResources.
        //    ApplicationBarIconButton appBarButton = new ApplicationBarIconButton(new Uri("/Assets/AppBar/appbar.add.rest.png", UriKind.Relative));
        //    appBarButton.Text = AppResources.AppBarButtonText;
        //    ApplicationBar.Buttons.Add(appBarButton);

        //    // Create a new menu item with the localized string from AppResources.
        //    ApplicationBarMenuItem appBarMenuItem = new ApplicationBarMenuItem(AppResources.AppBarMenuItemText);
        //    ApplicationBar.MenuItems.Add(appBarMenuItem);
        //}
    }
}