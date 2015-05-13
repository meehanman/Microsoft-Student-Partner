Imports System.ComponentModel

Public Class ItemViewModel
    Implements INotifyPropertyChanged

    Private _id As String
    ''' <summary>
    ''' Sample ViewModel property; this property is used in the view to display its value using a Binding.
    ''' </summary>
    ''' <returns></returns>
    Public Property ID() As String
        Get
            Return _id
        End Get
        Set(ByVal value As String)
            If Not value.Equals(_id) Then
                _id = value
                NotifyPropertyChanged("ID")
            End If
        End Set
    End Property

    Private _lineOne As String
    ''' <summary>
    ''' Sample ViewModel property; this property is used in the view to display its value using a Binding.
    ''' </summary>
    ''' <returns></returns>
    Public Property LineOne() As String
        Get
            Return _lineOne
        End Get
        Set(ByVal value As String)
            If Not value.Equals(_lineOne) Then
                _lineOne = value
                NotifyPropertyChanged("LineOne")
            End If
        End Set
    End Property

    Private _lineTwo As String
    ''' <summary>
    ''' Sample ViewModel property; this property is used in the view to display its value using a Binding.
    ''' </summary>
    ''' <returns></returns>
    Public Property LineTwo() As String
        Get
            Return _lineTwo
        End Get
        Set(ByVal value As String)
            If Not value.Equals(_lineTwo) Then
                _lineTwo = value
                NotifyPropertyChanged("LineTwo")
            End If
        End Set
    End Property

    Private _lineThree As String
    ''' <summary>
    ''' Sample ViewModel property; this property is used in the view to display its value using a Binding.
    ''' </summary>
    ''' <returns></returns>
    Public Property LineThree() As String
        Get
            Return _lineThree
        End Get
        Set(ByVal value As String)
            If Not value.Equals(_lineThree) Then
                _lineThree = value
                NotifyPropertyChanged("LineThree")
            End If
        End Set
    End Property

    Public Event PropertyChanged As PropertyChangedEventHandler Implements INotifyPropertyChanged.PropertyChanged

    Property LineOnePoint5 As Integer

    Property YoutubeLink As String

    Property YoutubeLogo As String

    Property singleimgurl As String

    Private Sub NotifyPropertyChanged(ByVal propertyName As String)
        Dim handler As PropertyChangedEventHandler = PropertyChangedEvent
        If Nothing IsNot handler Then
            handler(Me, New PropertyChangedEventArgs(propertyName))
        End If
    End Sub
End Class