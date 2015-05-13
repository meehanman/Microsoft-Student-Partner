Imports System
Imports System.Threading
Imports System.Windows.Controls
Imports Microsoft.Phone.Controls
Imports Microsoft.Phone.Shell
Imports Microsoft.Phone.Tasks

Partial Public Class MainPage
    Inherits PhoneApplicationPage

    ' Constructor
    Public Sub New()
        InitializeComponent()

        ' Set the data context of the listbox control to the sample data
        DataContext = App.ViewModel

        ' Sample code to localize the ApplicationBar
        'BuildLocalizedApplicationBar()
    End Sub

    ' Load data for the ViewModel Items
    Protected Overrides Sub OnNavigatedTo(e As NavigationEventArgs)
        loaddata()
    End Sub

    Function loaddata()
        If Not App.ViewModel.IsDataLoaded Then
            App.ViewModel.LoadData()
            ' If Not App.ViewModel.IsDataLoaded Then
            'MessageBox.Show("Sorry there was a problem there. This app requires an Internet Connection which we cannot find. Please connect to the internet and restart the app!", "No Internet Connection", MessageBoxButton.OK)
            '    btnrefresh.Visibility = System.Windows.Visibility.Visible
            ' End If

        Else

        End If
    End Function
    ' Handle selection changed on ListBox
    'Private Sub MainLongListSelector_SelectionChanged(ByVal sender As Object, ByVal e As SelectionChangedEventArgs)
    '    ' If selected item is Nothing (no selection) do nothing
    '    If MainLongListSelector.SelectedItem Is Nothing Then
    '        Return
    '    End If

    '    ' Navigate to the new page
    '    NavigationService.Navigate(New Uri("/DetailsPage.xaml?selectedItem=" & (CType(MainLongListSelector.SelectedItem, ItemViewModel)).ID, UriKind.Relative))

    '    ' Reset selected item to Nothing (no selection)
    '    MainLongListSelector.SelectedItem = Nothing
    'End Sub

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

    Private Sub MainLongListSelector_SelectionChanged(sender As Object, e As SelectionChangedEventArgs)
        ' If selected item is Nothing (no selection) do nothing
        If MainLongListSelector.SelectedItem Is Nothing Then
            Return
        End If

        ' Navigate to the new page
        NavigationService.Navigate(New Uri("/DetailsPage.xaml?selectedItem=" & (CType(MainLongListSelector.SelectedItem, ItemViewModel)).ID, UriKind.Relative))

        ' Reset selected item to Nothing (no selection)
        MainLongListSelector.SelectedItem = Nothing

        'Dim webBrowserTask As WebBrowserTask = New WebBrowserTask()
        'webBrowserTask.Uri = New Uri("http://www.google.com/search?btnI=I'm+Feeling+Lucky&q=Avicii vs Nicky Romero+ - +I Could Be The One (Nicktim) site:youtube.com/", UriKind.Absolute)

        'webBrowserTask.Show()
    End Sub

    Private Sub btnrefresh_Click(sender As Object, e As RoutedEventArgs) Handles btnrefresh.Click
        loaddata()
    End Sub
End Class