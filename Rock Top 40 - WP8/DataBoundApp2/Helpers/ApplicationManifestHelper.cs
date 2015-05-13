using System;
using System.Linq;
using System.Xml.Linq;

namespace DataBoundApp2.Helpers
{
    public static class ApplicationManifestHelper
    {
        public static ManifestData Read()
        {
            ManifestData data = new ManifestData();
            XElement manifestXml = XElement.Load("WMAppManifest.xml");
            var appElement = manifestXml.Descendants("App").FirstOrDefault();
            if (appElement != null)
            {
                data.ProductId = (string)appElement.Attribute("ProductID");
                data.Title = (string)appElement.Attribute("Title");
                data.RuntimeType = (string)appElement.Attribute("RuntimeType");
                data.Version = (string)appElement.Attribute("Version");
                data.Genre = (string)appElement.Attribute("Genre");
                data.Author = (string)appElement.Attribute("Author");
                data.Description = (string)appElement.Attribute("Description");
                data.Publisher = (string)appElement.Attribute("Publisher");
            }

            appElement = manifestXml.Descendants("PrimaryToken").FirstOrDefault();

            if (appElement != null)
            {
                data.TokenId = (string)appElement.Attribute("TokenID");
            }

            return data;
        }
    }

    public class ManifestData
    {
        public string TokenId;
        public string Genre;
        public string Author;
        public string Description;
        public string Publisher;
        public string Title;
        public string Version;
        public string RuntimeType;
        public string ProductId;
    }
}
