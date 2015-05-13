Imports System.ComponentModel
Imports System.Collections.ObjectModel
Imports Newtonsoft.Json
'
'
'
' Loads Values from Website
'
'
'
'
'
'
Public Class MainViewModel
    Implements INotifyPropertyChanged

    Public Sub New()
        Me.Items = New ObservableCollection(Of ItemViewModel)()
    End Sub

    ''' <summary>
    ''' A collection for ItemViewModel objects.
    ''' </summary>
    Public Property Items() As ObservableCollection(Of ItemViewModel)

    Private _sampleProperty As String = "Sample Runtime Property Value"
    ''' <summary>
    ''' Sample ViewModel property; this property is used in the view to display its value using a Binding
    ''' </summary>
    ''' <returns></returns>
    Public Property SampleProperty() As String
        Get
            Return _sampleProperty
        End Get
        Set(ByVal value As String)
            If Not value.Equals(_sampleProperty) Then
                _sampleProperty = value
                NotifyPropertyChanged("SampleProperty")
            End If
        End Set
    End Property

    ''' <summary>
    ''' Sample property that returns a localized string
    ''' </summary>
    Public ReadOnly Property LocalizedSampleProperty() As String
        Get
            Return AppResources.SampleProperty
        End Get
    End Property

    Public Property IsDataLoaded() As Boolean

    ''' <summary>
    ''' Creates and adds a few ItemViewModel objects into the Items collection.
    ''' </summary>
    Public Sub LoadData()
        Try
            Dim client As New WebClient()
            Dim uri As New Uri("http://ut4.azurewebsites.net/dt4.php")

            AddHandler client.DownloadStringCompleted, AddressOf DownloadStringCallback
            client.DownloadStringAsync(uri)
        Catch

        End Try

    End Sub

    Public Sub DownloadStringCallback(sender As Object, e As DownloadStringCompletedEventArgs)

        Try
            Dim json As String = e.Result
            Dim result = JsonConvert.DeserializeObject(Of RootObject)(json)


            ' Sample data; replace with real data
            Dim i = 0
            While i < result.entries.Count
                Me.Items.Add(New ItemViewModel() With {.ID = i, .singleimgurl = result.entries(i).singleimgurl, .YoutubeLink = result.entries(i).youtubelink, .LineOne = result.entries(i).title, .LineOnePoint5 = result.entries(i).position, .LineTwo = result.entries(i).artist, .LineThree = result.entries(i).youtubelink})
                i += 1
            End While


            Me.IsDataLoaded = True
        Catch
            MessageBox.Show("Sorry there was a problem there. This app requires an Internet Connection which we cannot find. Please connect to the internet and restart the app!", "No Internet Connection", MessageBoxButton.OK)

        End Try
        

    End Sub

    Public Event PropertyChanged As PropertyChangedEventHandler Implements INotifyPropertyChanged.PropertyChanged

    Public Sub NotifyPropertyChanged(ByVal propertyName As String)
        Dim handler As PropertyChangedEventHandler = PropertyChangedEvent
        If handler IsNot Nothing Then
            handler(Me, New PropertyChangedEventArgs(propertyName))
        End If
    End Sub










    'JSON Classes
    Public Class Entry
        Public Property position() As Integer
            Get
                Return m_position
            End Get
            Set(value As Integer)
                m_position = Value
            End Set
        End Property
        Private m_position As Integer
        Public Property artist() As String
            Get
                Return m_artist
            End Get
            Set(value As String)
                m_artist = Value
            End Set
        End Property
        Private m_artist As String
        Public Property title() As String
            Get
                Return m_title
            End Get
            Set(value As String)
                m_title = Value
            End Set
        End Property
        Private m_title As String
        Public Property singleimgurl() As String
            Get
                Return m_singleimgurl
            End Get
            Set(value As String)
                m_singleimgurl = Value
            End Set
        End Property
        Private m_singleimgurl As String
        Public Property youtubelink() As String
            Get
                Return m_youtubelink
            End Get
            Set(value As String)
                m_youtubelink = Value
            End Set
        End Property
        Private m_youtubelink As String
        Public Property youtubelogo() As String
            Get
                Return m_youtubelogo
            End Get
            Set(value As String)
                m_youtubelogo = Value
            End Set
        End Property
        Private m_youtubelogo As String
    End Class

    Public Class RootObject
        Public Property chartDate() As Integer
            Get
                Return m_chartDate
            End Get
            Set(value As Integer)
                m_chartDate = Value
            End Set
        End Property
        Private m_chartDate As Integer
        Public Property retrieved() As Integer
            Get
                Return m_retrieved
            End Get
            Set(value As Integer)
                m_retrieved = Value
            End Set
        End Property
        Private m_retrieved As Integer
        Public Property entries() As List(Of Entry)
            Get
                Return m_entries
            End Get
            Set(value As List(Of Entry))
                m_entries = Value
            End Set
        End Property
        Private m_entries As List(Of Entry)
    End Class
End Class