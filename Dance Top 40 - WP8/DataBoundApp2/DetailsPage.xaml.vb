Imports System
Imports System.Threading
Imports System.Windows.Controls
Imports Microsoft.Phone.Controls
Imports Microsoft.Phone.Shell
Imports Microsoft.Phone.Tasks

Partial Public Class DetailsPage
    Inherits PhoneApplicationPage
    ' Constructor
    Public Sub New()
        InitializeComponent()

        ' Sample code to localize the ApplicationBar
        'BuildLocalizedApplicationBar()

    End Sub

    ' When page is navigated to set data context to selected item in list
    Protected Overrides Sub OnNavigatedTo(ByVal e As NavigationEventArgs)
        If DataContext Is Nothing Then
            Dim selectedIndex As String = ""
            If NavigationContext.QueryString.TryGetValue("selectedItem", selectedIndex) Then
                Dim index As Integer = Integer.Parse(selectedIndex)
                DataContext = App.ViewModel.Items(index)
            End If
        End If
    End Sub

    ' Sample code for building a localized ApplicationBar
    'Private Sub BuildLocalizedApplicationBar()
    '    ' Set the page's ApplicationBar to a new instance of ApplicationBar.
    '    ApplicationBar = New ApplicationBar()

    '    ' Create a new button and set the text value to the localized string from AppResources.
    '    Dim appBarButton As New ApplicationBarIconButton(New Uri("/Assets/AppBar/appbar.add.rest.png", UriKind.Relative))
    '    appBarButton.Text = AppResources.AppBarButtonText
    '    ApplicationBar.Buttons.Add(appBarButton)

    '    ' Create a new menu item with the localized string from AppResources.
    '    Dim appBarMenuItem As New ApplicationBarMenuItem(AppResources.AppBarMenuItemText)
    '    ApplicationBar.MenuItems.Add(appBarMenuItem)
    'End Sub

    Private Sub Button_Click_1(sender As Object, e As RoutedEventArgs)
        Dim webBrowserTask As WebBrowserTask = New WebBrowserTask()
        webBrowserTask.Uri = New Uri(apiurl.Text, UriKind.Absolute)

        webBrowserTask.Show()
    End Sub
End Class