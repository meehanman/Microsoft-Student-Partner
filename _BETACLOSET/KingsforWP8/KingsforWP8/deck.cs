using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KingsforWP8
{
    class deck
    {
        string[] suit = new string[] { "", "spades.png", "hearts.png", "diamonds.png", "clubs.png" };
        string[] face = new string[] { null, "A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K" };
        string[] cardRow = new string[] {"1A", "12", "13", "14", "15", "16", "17", "18", "19", "110", "1J", "1Q", "1K",
                                         "2A", "22", "23", "24", "25", "26", "27", "28", "29", "210", "2J", "2Q", "2K",
                                         "3A", "32", "33", "34", "35", "36", "37", "38", "39", "310", "3J", "3Q", "3K",
                                         "4A", "42", "43", "44", "45", "46", "47", "48", "49", "410", "4J", "4Q", "4K"};
        string[] cardDeck = new string[52];
        int kingCount = 0;

        public deck()
        {
            cardDeck = new string[52];
        }
        public void shuffle()
        {
            Random rnd = new Random();
            cardDeck = cardRow.OrderBy(x => rnd.Next()).ToArray();
            this.position = 0;
            this.kingCount = 0;
        }


        public int getKingCount()
        {
            return this.kingCount;
        }
        public void KingCountUp()
        {
            this.kingCount++;
        }
        //Position
        private int position;
        public int getPosition()
        {
            return this.position;
        }
        public void setPosition(int a)
        {
            if (a < 52 && a >= 0)
            {
                this.position = a;
            }
        }


        public void nextCard()
        {
            if (this.position < 51)
            {
                position++;
            }
            else
            {
                this.shuffle();
            }

        }
        public void previousCard()
        {
            this.position--;
        }

        public String cardHistory(int x)
        {
            return cardDeck[this.position + x];
        }

        public string getCard()
        {
            return cardDeck[this.position];
        }

        public String getSuit()
        {
            return suit[Convert.ToInt16(getCard().Substring(0, 1))];
        }
        public int getCardLocation(String n)
        {
            switch (n)
            {
                case "A":
                    return 0;
                case "2":
                    return 1;
                case "3":
                    return 2;
                case "4":
                    return 3;
                case "5":
                    return 4;
                case "6":
                    return 5;
                case "7":
                    return 6;
                case "8":
                    return 7;
                case "9":
                    return 8;
                case "10":
                    return 9;
                case "J":
                    return 10;
                case "Q":
                    return 11;
                case "K":
                    return 12;
                default:
                    return 0;
            }
        }
        public String getFace()
        {
            return getCard().Substring(1, getCard().Length - 1);
        }

        public String toString()
        {
            String output = "";
            for (int i = 0; i < cardDeck.Length; i++)
            {
               output+= ":" + i + ":>" + cardDeck[i];
            }
            return output;
        }


    }
}
