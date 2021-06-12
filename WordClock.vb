Public Class frmClock

    Private Sub frmClock_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles MyBase.Click
        End
    End Sub

    Private Sub frmClock_Load(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles MyBase.Load
        setTime()
        TimerMinute.Enabled = True
        TimerGlow.Enabled = True
    End Sub

    Private Sub TimerMinute_Tick(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles TimerMinute.Tick
        setTime()
    End Sub

    Private Sub setTime()
        TimerGlow.Enabled = False
        blackout()
        Dim M As Integer = Now.Minute
        Dim H As Integer = Now.Hour Mod 12
        If H = 0 Then H = 12
        Lit("IT")
        Lit("IS")
        If M > 34 Then
            If M <> 0 Then Lit("TO")
            Lit("", H + 1)
        Else
            If M <> 0 Then Lit("PAST")
            Lit("", H)
        End If
        If M >= 0 And M < 5 Then
            Lit("OCLOCK")
        ElseIf (M >= 5 And M < 10) Or M >= 55 Then
            Lit("MFIVE")
        ElseIf (M >= 10 And M < 15) Or (M >= 50 And M < 55) Then
            Lit("MTEN")
        ElseIf (M >= 15 And M < 20) Or (M >= 45 And M < 50) Then
            Lit("A")
            Lit("QUARTER")
        ElseIf (M >= 20 And M < 25) Or (M >= 40 And M < 45) Then
            Lit("TWENTY")
        ElseIf (M >= 25 And M < 30) Or (M >= 35 And M < 40) Then
            Lit("TWENTY")
            Lit("MFIVE")
        ElseIf M >= 30 And M < 35 Then
            Lit("HALF")
        End If
        TimerGlow.Enabled = True
    End Sub

    Private Sub Lit(ByVal s As String, Optional ByVal i As Integer = 0)
        If i > 0 Then
            For Each l As Label In Me.PanelClock.Controls
                If IsNumeric(l.Tag) Then
                    If l.Tag = i Then
                        l.ForeColor = Color.FromArgb(255, 75, 75, 75)
                    End If
                End If
            Next
        Else
            For Each l As Label In Me.PanelClock.Controls
                If l.Name.Length >= s.Length Then
                    If l.Name.Substring(0, s.Length) = s Then
                        l.ForeColor = Color.FromArgb(255, 75, 75, 75)
                    End If
                End If
            Next
        End If
    End Sub

    Private Sub blackout()
        For Each l As Label In Me.PanelClock.Controls
            l.ForeColor = Color.FromArgb(255, 40, 40, 40)
        Next
    End Sub

    Dim c As Integer = 75, p As Integer = 1
    
    Private Sub TimerGlow_Tick(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles TimerGlow.Tick
        TimerGlow.Enabled = False
        c += p * 3
        If c >= 255 Then p = -1
        If c < 56 Then p = 1
        For Each l As Label In Me.PanelClock.Controls
            If l.ForeColor <> Color.FromArgb(255, 40, 40, 40) Then
                l.ForeColor = Color.FromArgb(255, c, c, c)
            End If
        Next
        TimerGlow.Enabled = True
    End Sub
End Class