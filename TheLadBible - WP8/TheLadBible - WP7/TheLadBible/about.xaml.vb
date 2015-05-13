Imports Microsoft.Phone.Tasks
Imports Microsoft.Phone.Controls
Partial Public Class about
    Inherits PhoneApplicationPage

    Public Sub New()
        InitializeComponent()
    End Sub

    Private Sub Button2_Click(sender As System.Object, e As System.Windows.RoutedEventArgs) Handles Button2.Click
        Dim webBrowserTask As WebBrowserTask = New WebBrowserTask()
        webBrowserTask.Uri = New Uri("http://roozo.co.uk", UriKind.Absolute)

        WebBrowserTask.Show()
    End Sub

    Private Sub Button1_Click(sender As System.Object, e As System.Windows.RoutedEventArgs) Handles Button1.Click
        Dim webBrowserTask As WebBrowserTask = New WebBrowserTask()
        webBrowserTask.Uri = New Uri("http://skibbles.co.uk", UriKind.Absolute)

        webBrowserTask.Show()
    End Sub
End Class
