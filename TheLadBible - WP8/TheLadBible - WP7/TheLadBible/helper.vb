Public Class helper
    Public Class Entry
        Public Property entry() As String
            Get
                Return m_entry
            End Get
            Set(value As String)
                m_entry = Value
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
                m_NoOfEntries = Value
            End Set
        End Property
        Private m_NoOfEntries As Integer
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
