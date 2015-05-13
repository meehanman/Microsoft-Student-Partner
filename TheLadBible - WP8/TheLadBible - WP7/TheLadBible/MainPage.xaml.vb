Imports Microsoft.Phone.Tasks
Imports Microsoft.Phone.Controls
Partial Public Class MainPage
    Inherits PhoneApplicationPage

    ' Constructor
    Public Sub New()
        InitializeComponent()
    End Sub

    Private Sub Button2_Click(sender As System.Object, e As System.Windows.RoutedEventArgs) Handles Button2.Click
        Dim marketplaceReviewTask As MarketplaceReviewTask = New MarketplaceReviewTask()

        marketplaceReviewTask.Show()
    End Sub

    Private Sub Button3_Click(sender As System.Object, e As System.Windows.RoutedEventArgs) Handles Button3.Click
        Dim webBrowserTask As WebBrowserTask = New WebBrowserTask()

        webBrowserTask.Uri = New Uri("http://www.theladbible.com/?ref=roozo&ref1=skribbles", UriKind.Absolute)

        WebBrowserTask.Show()

    End Sub

    Private Sub Button1_Click(sender As System.Object, e As System.Windows.RoutedEventArgs) Handles Button1.Click
        NavigationService.Navigate(New Uri("/about.xaml", UriKind.Relative))
    End Sub
    'Animation

    Private Sub Button4_Click(sender As System.Object, e As System.Windows.RoutedEventArgs) Handles Button4.Click
        NavigationService.Navigate(New Uri("/tails.xaml", UriKind.Relative))
    End Sub
End Class
