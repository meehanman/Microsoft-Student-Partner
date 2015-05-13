Imports System.Net
Imports System.Windows
Imports Microsoft.Phone.Controls
Imports System.Runtime.Serialization.Json
Imports System.IO
Imports System.Text
Imports Newtonsoft.Json
Imports Microsoft.Phone.Tasks

Partial Public Class Commandment
    Inherits PhoneApplicationPage


    Public Sub New()
        InitializeComponent()

        Dim client As New WebClient()
        Dim uri As New Uri("http://ut4.azurewebsites.net/tlb.php")

        AddHandler client.DownloadStringCompleted, AddressOf DownloadStringCallback
        client.DownloadStringAsync(uri)
        txtcontent.Text = "Loaded!"
    End Sub
    'To be counted up
    Dim MAX As Integer 'Set upon download complete
    Dim MIN As Integer = 1
    Dim pubarray() As String 'Holds the downloaded results
    Dim rn As New Random 'Used for the random generator 


    Public Sub DownloadStringCallback(sender As Object, e As DownloadStringCompletedEventArgs)
        Dim json As String = e.Result
        Dim result = JsonConvert.DeserializeObject(Of RootObject)(json)

        'PageTitle.Text = Convert.ToString(result.NoOfEntries) & " entries"

        'MyList.ItemsSource = result.entries
        Dim i As Integer = 0
        MAX = (CInt(result.entries.Count) - 1)
        ReDim pubarray(MAX)
        While i < (MAX)
            pubarray(i) = result.entries.Item(i).entry
            i += 1
        End While
            Showme("rand")
    End Sub

    Public Function GetRandomNumber(Optional Low As Integer = 1, Optional High As Integer = 100) As Integer
        ' Returns a random number,
        ' between the optional Low and High parameters
        Return rn.[Next](Low, High)
    End Function

    Public Function Showme(mode As String, Optional newnumber As Integer = 0)
        Dim content, number, upper, lower As String
        upper = MAX
        lower = MIN

        Dim rand As Integer
        If (mode = "rand") Then
            rand = GetRandomNumber(lower, upper)
        Else
            rand = newnumber
            'If (rand < lower Or rand > upper) Then
            '    rand = GetRandomNumber(lower, upper)
            'End If
            If (rand < lower) Then
                rand = MAX
            ElseIf (rand > upper) Then
                rand = MIN
            End If
        End If
        'Setting parameters
        content = pubarray(rand)
        number = "#" + CStr(rand)

        txtblocknumber.Text = number
        txtcontent.Text = content

        Return True
    End Function

    'Function change(movement As Integer)
    '    If movement = 1 And location = MAX Then
    '        txtcontent.Text = returnValues("content", 1)
    '        txtblocknumber.Text = returnValues("#", 1)
    '        Return False
    '    ElseIf movement = -1 And location = 0 Then
    '        txtcontent.Text = returnValues("content", MAX)
    '        txtblocknumber.Text = returnValues("#", MAX)
    '        Return False
    '    Else
    '        location += movement
    '        txtcontent.Text = returnValues("content", location)
    '        txtblocknumber.Text = returnValues("#", location)
    '        Return True
    '    End If
    'End Function
    'Public Function Showme(mode As String, Optional newnumber As Integer = 0)
    '    Dim content, number, upper, lower As String
    '    'Say the number of the first and last entry
    '    upper = 144
    '    lower = 1

    '    Dim rand As Integer
    '    If (mode = "rand") Then
    '        rand = GetRandomNumber(lower, upper)
    '    Else
    '        rand = newnumber
    '        If (rand < lower Or rand > upper) Then
    '            rand = GetRandomNumber(lower, upper)
    '        End If
    '    End If
    '    content = "Ooops"
    '    number = "#-1"
    'End Function

    'Function returnValues(type As String, position As Integer)
    '    'Valadation before values are returned
    '    If ((position - 1) < 0) Then : position += 1
    '    End If

    '    If ((position) > MAX) Then : position += -1
    '    End If
    '    'End of valadation
    '    If type = "#" Then
    '        Return type + CStr(position)
    '    Else
    '        Return CStr(pubarray(position - 1))
    '    End If
    'End Function

    Public Class Entry
        Public Property entry() As String
            Get
                Return m_entry
            End Get
            Set(value As String)
                m_entry = value
            End Set
        End Property
        Private m_entry As String
    End Class

    Public Class RootObject
        Public Property NoOfEntries() As Integer
            Get
                Return m_NoOfEntries
            End Get
            Set(value As Integer)
                m_NoOfEntries = value
            End Set
        End Property
        Private m_NoOfEntries As Integer
        Public Property entries() As List(Of Entry)
            Get
                Return m_entries
            End Get
            Set(value As List(Of Entry))
                m_entries = value
            End Set
        End Property
        Private m_entries As List(Of Entry)
    End Class
    'Buttons doing their stuff below
    Private Sub Button1_Click(sender As Object, e As RoutedEventArgs) Handles Button1.Click
        '+1
        Dim thenumber = txtblocknumber.Text.Substring(1) + 1
        Showme("show", thenumber)
    End Sub
    Private Sub btnp_Click(sender As Object, e As RoutedEventArgs) Handles btnp.Click
        '-1
        Dim thenumber = txtblocknumber.Text.Substring(1) - 1
        Showme("show", thenumber)
    End Sub
    Private Sub txtcontent_Tap(ByVal sender As Object, ByVal e As System.Windows.Input.GestureEventArgs)
        If (txtcontent.Text <> "Loaded!") Then
            Showme("rand")
        End If

    End Sub

    Private Sub Button_Click_1(sender As Object, e As RoutedEventArgs)

    End Sub

    Private Sub a5_Click(sender As Object, e As RoutedEventArgs) Handles a5.Click
        'Dim webBrowserTask As WebBrowserTask = New WebBrowserTask()
        Dim shareurl As String = "http://ut4.azurewebsites.net/share.php?sharedata="
        shareurl += txtcontent.Text
        shareurl += "&shareid="
        shareurl += txtblocknumber.Text
        shareurl = shareurl
        'webBrowserTask.Uri = New Uri(shareurl, UriKind.Absolute)

        'webBrowserTask.Show()
        Dim emailComposeTask As New EmailComposeTask() With { _
            .Subject = "theladbible", _
             .Body = "Funny link here         " + shareurl, _
             .[To] = "", _
             .Cc = "", _
             .Bcc = "" _
        }

        emailComposeTask.Show()
    End Sub

    Private Sub ShareEmail(sender As Object, e As System.Windows.Input.GestureEventArgs)
        
    End Sub

    Private Sub Button_Click_2(sender As Object, e As RoutedEventArgs)
        If (a1.Visibility = System.Windows.Visibility.Visible) Then
            btnshare.Content = "Share"
            a1.Visibility = System.Windows.Visibility.Collapsed
            a3.Visibility = System.Windows.Visibility.Collapsed
            a5.Visibility = System.Windows.Visibility.Collapsed
        Else
            btnshare.Content = "Close"
            a1.Visibility = System.Windows.Visibility.Visible
            a3.Visibility = System.Windows.Visibility.Visible
            a5.Visibility = System.Windows.Visibility.Visible
        End If
    End Sub
End Class
