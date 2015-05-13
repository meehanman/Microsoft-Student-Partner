'
'   Copyright (c) 2011 Microsoft Corporation.  All rights reserved.
'   Use of this sample source code is subject to the terms of the Microsoft license 
'   agreement under which you licensed this sample source code and is provided AS-IS.
'   If you did not accept the terms of the license agreement, you are not authorized 
'   to use this sample source code.  For the terms of the license, please see the 
'   license agreement between you and Microsoft.
'  
'   To see all Code Samples for Windows Phone, visit http://go.microsoft.com/fwlink/?LinkID=219604 
'  
'
Imports System.Windows.Controls.Primitives


#If WINDOWS_PHONE Then
Imports Microsoft.Phone.Controls
#End If

''' <summary>
''' This code provides attached properties for adding a 'tilt' effect to all controls within a container.
''' </summary>
Public Class TiltEffect
    Inherits DependencyObject

#Region "Constructor and Static Constructor"
    ''' <summary>
    ''' This is not a constructable class, but it cannot be static because it derives from DependencyObject.
    ''' </summary>
    Private Sub New()
    End Sub

    ''' <summary>
    ''' Initialize the static properties
    ''' </summary>
    Shared Sub New()
        ' The tiltable items list.
        TiltableItems = New List(Of Type)() From {GetType(ButtonBase), GetType(ListBoxItem)}
        UseLogarithmicEase = False
    End Sub

#End Region


#Region "Fields and simple properties"

    ' These constants are the same as the built-in effects
    ''' <summary>
    ''' Maximum amount of tilt, in radians
    ''' </summary>
    Private Const MaxAngle As Double = 0.3

    ''' <summary>
    ''' Maximum amount of depression, in pixels
    ''' </summary>
    Private Const MaxDepression As Double = 25

    ''' <summary>
    ''' Delay between releasing an element and the tilt release animation playing
    ''' </summary>
    Private Shared ReadOnly TiltReturnAnimationDelay As TimeSpan = TimeSpan.FromMilliseconds(200)

    ''' <summary>
    ''' Duration of tilt release animation
    ''' </summary>
    Private Shared ReadOnly TiltReturnAnimationDuration As TimeSpan = TimeSpan.FromMilliseconds(100)

    ''' <summary>
    ''' The control that is currently being tilted
    ''' </summary>
    Private Shared currentTiltElement As FrameworkElement

    ''' <summary>
    ''' The single instance of a storyboard used for all tilts
    ''' </summary>
    Private Shared tiltReturnStoryboard As Storyboard

    ''' <summary>
    ''' The single instance of an X rotation used for all tilts
    ''' </summary>
    Private Shared tiltReturnXAnimation As DoubleAnimation

    ''' <summary>
    ''' The single instance of a Y rotation used for all tilts
    ''' </summary>
    Private Shared tiltReturnYAnimation As DoubleAnimation

    ''' <summary>
    ''' The single instance of a Z depression used for all tilts
    ''' </summary>
    Private Shared tiltReturnZAnimation As DoubleAnimation

    ''' <summary>
    ''' The center of the tilt element
    ''' </summary>
    Private Shared currentTiltElementCenter As Point

    ''' <summary>
    ''' Whether the animation just completed was for a 'pause' or not
    ''' </summary>
    Private Shared wasPauseAnimation As Boolean = False

    ''' <summary>
    ''' Whether to use a slightly more accurate (but slightly slower) tilt animation easing function
    ''' </summary>
    Public Shared Property UseLogarithmicEase() As Boolean

    ''' <summary>
    ''' Default list of items that are tiltable
    ''' </summary>
    Private Shared privateTiltableItems As List(Of Type)
    Public Shared Property TiltableItems() As List(Of Type)
        Get
            Return privateTiltableItems
        End Get
        Private Set(ByVal value As List(Of Type))
            privateTiltableItems = value
        End Set
    End Property

#End Region


#Region "Dependency properties"

    ''' <summary>
    ''' Whether the tilt effect is enabled on a container (and all its children)
    ''' </summary>
    Public Shared ReadOnly IsTiltEnabledProperty As DependencyProperty = DependencyProperty.RegisterAttached("IsTiltEnabled", GetType(Boolean), GetType(TiltEffect), New PropertyMetadata(AddressOf OnIsTiltEnabledChanged))

    ''' <summary>
    ''' Gets the IsTiltEnabled dependency property from an object
    ''' </summary>
    ''' <param name="source">The object to get the property from</param>
    ''' <returns>The property's value</returns>
    Public Shared Function GetIsTiltEnabled(ByVal source As DependencyObject) As Boolean
        Return CBool(source.GetValue(IsTiltEnabledProperty))
    End Function

    ''' <summary>
    ''' Sets the IsTiltEnabled dependency property on an object
    ''' </summary>
    ''' <param name="source">The object to set the property on</param>
    ''' <param name="value">The value to set</param>
    Public Shared Sub SetIsTiltEnabled(ByVal source As DependencyObject, ByVal value As Boolean)
        source.SetValue(IsTiltEnabledProperty, value)
    End Sub

    ''' <summary>
    ''' Suppresses the tilt effect on a single control that would otherwise be tilted
    ''' </summary>
    Public Shared ReadOnly SuppressTiltProperty As DependencyProperty = DependencyProperty.RegisterAttached("SuppressTilt", GetType(Boolean), GetType(TiltEffect), Nothing)

    ''' <summary>
    ''' Gets the SuppressTilt dependency property from an object
    ''' </summary>
    ''' <param name="source">The object to get the property from</param>
    ''' <returns>The property's value</returns>
    Public Shared Function GetSuppressTilt(ByVal source As DependencyObject) As Boolean
        Return CBool(source.GetValue(SuppressTiltProperty))
    End Function

    ''' <summary>
    ''' Sets the SuppressTilt dependency property from an object
    ''' </summary>
    ''' <param name="source">The object to get the property from</param>
    ''' <remarks >The property's value</remarks >
    Public Shared Sub SetSuppressTilt(ByVal source As DependencyObject, ByVal value As Boolean)
        source.SetValue(SuppressTiltProperty, value)
    End Sub


    ''' <summary>
    ''' Property change handler for the IsTiltEnabled dependency property
    ''' </summary>
    ''' <param name="target">The element that the property is atteched to</param>
    ''' <param name="args">Event args</param>
    ''' <remarks>
    ''' Adds or removes event handlers from the element that has been (un)registered for tilting
    ''' </remarks>
    Private Shared Sub OnIsTiltEnabledChanged(ByVal target As DependencyObject, ByVal args As DependencyPropertyChangedEventArgs)
        If TypeOf target Is FrameworkElement Then
            ' Add / remove the event handler if necessary
            If CBool(args.NewValue) = True Then
                AddHandler TryCast(target, FrameworkElement).ManipulationStarted, AddressOf TiltEffect_ManipulationStarted
            Else
                RemoveHandler TryCast(target, FrameworkElement).ManipulationStarted, AddressOf TiltEffect_ManipulationStarted
            End If
        End If
    End Sub

#End Region


#Region "Top-level manipulation event handlers"

    ''' <summary>
    ''' Event handler for ManipulationStarted
    ''' </summary>
    ''' <param name="sender">sender of the event - this will be the tilt container (eg, entire page)</param>
    ''' <param name="e">event args</param>
    Private Shared Sub TiltEffect_ManipulationStarted(ByVal sender As Object, ByVal e As ManipulationStartedEventArgs)

        TryStartTiltEffect(TryCast(sender, FrameworkElement), e)
    End Sub

    ''' <summary>
    ''' Event handler for ManipulationDelta
    ''' </summary>
    ''' <param name="sender">sender of the event - this will be the tilting object (eg a button)</param>
    ''' <param name="e">event args</param>
    Private Shared Sub TiltEffect_ManipulationDelta(ByVal sender As Object, ByVal e As ManipulationDeltaEventArgs)

        ContinueTiltEffect(TryCast(sender, FrameworkElement), e)
    End Sub

    ''' <summary>
    ''' Event handler for ManipulationCompleted
    ''' </summary>
    ''' <param name="sender">sender of the event - this will be the tilting object (eg a button)</param>
    ''' <param name="e">event args</param>
    Private Shared Sub TiltEffect_ManipulationCompleted(ByVal sender As Object, ByVal e As ManipulationCompletedEventArgs)

        EndTiltEffect(currentTiltElement)
    End Sub

#End Region


#Region "Core tilt logic"

    ''' <summary>
    ''' Checks if the manipulation should cause a tilt, and if so starts the tilt effect
    ''' </summary>
    ''' <param name="source">The source of the manipulation (the tilt container, eg entire page)</param>
    ''' <param name="e">The args from the ManipulationStarted event</param>
    Private Shared Sub TryStartTiltEffect(ByVal source As FrameworkElement, ByVal e As ManipulationStartedEventArgs)
        For Each ancestor As FrameworkElement In (TryCast(e.OriginalSource, FrameworkElement)).GetVisualAncestors()
            For Each t In TiltableItems
                If t.IsAssignableFrom(ancestor.GetType()) Then
                    If CBool(ancestor.GetValue(SuppressTiltProperty)) <> True Then
                        ' Use first child of the control, so that you can add transforms and not
                        ' impact any transforms on the control itself
                        Dim element As FrameworkElement = TryCast(VisualTreeHelper.GetChild(ancestor, 0), FrameworkElement)
                        Dim container As FrameworkElement = TryCast(e.ManipulationContainer, FrameworkElement)

                        If element Is Nothing OrElse container Is Nothing Then
                            Return
                        End If

                        ' Touch point relative to the element being tilted
                        Dim tiltTouchPoint As Point = container.TransformToVisual(element).Transform(e.ManipulationOrigin)

                        ' Center of the element being tilted
                        Dim elementCenter As New Point(element.ActualWidth / 2, element.ActualHeight / 2)

                        ' Camera adjustment
                        Dim centerToCenterDelta As Point = GetCenterToCenterDelta(element, source)

                        BeginTiltEffect(element, tiltTouchPoint, elementCenter, centerToCenterDelta)
                        Return
                    End If
                End If
            Next t
        Next ancestor
    End Sub

    ''' <summary>
    ''' Computes the delta between the centre of an element and its container
    ''' </summary>
    ''' <param name="element">The element to compare</param>
    ''' <param name="container">The element to compare against</param>
    ''' <returns>A point that represents the delta between the two centers</returns>
    Private Shared Function GetCenterToCenterDelta(ByVal element As FrameworkElement, ByVal container As FrameworkElement) As Point
        Dim elementCenter As New Point(element.ActualWidth / 2, element.ActualHeight / 2)
        Dim containerCenter As Point

#If WINDOWS_PHONE Then

			' Need to special-case the frame to handle different orientations
			If TypeOf container Is PhoneApplicationFrame Then
				Dim frame As PhoneApplicationFrame = TryCast(container, PhoneApplicationFrame)

				' Switch width and height in landscape mode
				If (frame.Orientation And PageOrientation.Landscape) = PageOrientation.Landscape Then

					containerCenter = New Point(container.ActualHeight / 2, container.ActualWidth / 2)
				Else
					containerCenter = New Point(container.ActualWidth / 2, container.ActualHeight / 2)
				End If
			Else
				containerCenter = New Point(container.ActualWidth / 2, container.ActualHeight / 2)
			End If
#Else

        containerCenter = New Point(container.ActualWidth / 2, container.ActualHeight / 2)

#End If

        Dim transformedElementCenter As Point = element.TransformToVisual(container).Transform(elementCenter)
        Dim result As New Point(containerCenter.X - transformedElementCenter.X, containerCenter.Y - transformedElementCenter.Y)

        Return result
    End Function

    ''' <summary>
    ''' Begins the tilt effect by preparing the control and doing the initial animation
    ''' </summary>
    ''' <param name="element">The element to tilt </param>
    ''' <param name="touchPoint">The touch point, in element coordinates</param>
    ''' <param name="centerPoint">The center point of the element in element coordinates</param>
    ''' <param name="centerDelta">The delta between the <paramref name="element"/>'s center and 
    ''' the container's center</param>
    Private Shared Sub BeginTiltEffect(ByVal element As FrameworkElement, ByVal touchPoint As Point, ByVal centerPoint As Point, ByVal centerDelta As Point)


        If tiltReturnStoryboard IsNot Nothing Then
            StopTiltReturnStoryboardAndCleanup()
        End If

        If PrepareControlForTilt(element, centerDelta) = False Then
            Return
        End If

        currentTiltElement = element
        currentTiltElementCenter = centerPoint
        PrepareTiltReturnStoryboard(element)

        ApplyTiltEffect(currentTiltElement, touchPoint, currentTiltElementCenter)
    End Sub

    ''' <summary>
    ''' Prepares a control to be tilted by setting up a plane projection and some event handlers
    ''' </summary>
    ''' <param name="element">The control that is to be tilted</param>
    ''' <param name="centerDelta">Delta between the element's center and the tilt container's</param>
    ''' <returns>true if successful; false otherwise</returns>
    ''' <remarks>
    ''' This method is conservative; it will fail any attempt to tilt a control that already
    ''' has a projection on it
    ''' </remarks>
    Private Shared Function PrepareControlForTilt(ByVal element As FrameworkElement, ByVal centerDelta As Point) As Boolean
        ' Prevents interference with any existing transforms
        If element.Projection IsNot Nothing OrElse (element.RenderTransform IsNot Nothing AndAlso element.RenderTransform.GetType() IsNot GetType(MatrixTransform)) Then
            Return False
        End If

        Dim transform As New TranslateTransform()
        transform.X = centerDelta.X
        transform.Y = centerDelta.Y
        element.RenderTransform = transform

        Dim projection As New PlaneProjection()
        projection.GlobalOffsetX = -1 * centerDelta.X
        projection.GlobalOffsetY = -1 * centerDelta.Y
        element.Projection = projection

        AddHandler element.ManipulationDelta, AddressOf TiltEffect_ManipulationDelta
        AddHandler element.ManipulationCompleted, AddressOf TiltEffect_ManipulationCompleted

        Return True
    End Function

    ''' <summary>
    ''' Removes modifications made by PrepareControlForTilt
    ''' </summary>
    ''' <param name="element">THe control to be un-prepared</param>
    ''' <remarks>
    ''' This method is basic; it does not do anything to detect if the control being un-prepared
    ''' was previously prepared
    ''' </remarks>
    Private Shared Sub RevertPrepareControlForTilt(ByVal element As FrameworkElement)
        RemoveHandler element.ManipulationDelta, AddressOf TiltEffect_ManipulationDelta
        RemoveHandler element.ManipulationCompleted, AddressOf TiltEffect_ManipulationCompleted
        element.Projection = Nothing
        element.RenderTransform = Nothing
    End Sub

    ''' <summary>
    ''' Creates the tilt return storyboard (if not already created) and targets it to the projection
    ''' </summary>
    ''' <param name="element">the projection that should be the target of the animation</param>
    Private Shared Sub PrepareTiltReturnStoryboard(ByVal element As FrameworkElement)

        If tiltReturnStoryboard Is Nothing Then
            tiltReturnStoryboard = New Storyboard()
            AddHandler tiltReturnStoryboard.Completed, AddressOf TiltReturnStoryboard_Completed

            tiltReturnXAnimation = New DoubleAnimation()
            Storyboard.SetTargetProperty(tiltReturnXAnimation, New PropertyPath(PlaneProjection.RotationXProperty))
            tiltReturnXAnimation.BeginTime = TiltReturnAnimationDelay
            tiltReturnXAnimation.To = 0
            tiltReturnXAnimation.Duration = TiltReturnAnimationDuration

            tiltReturnYAnimation = New DoubleAnimation()
            Storyboard.SetTargetProperty(tiltReturnYAnimation, New PropertyPath(PlaneProjection.RotationYProperty))
            tiltReturnYAnimation.BeginTime = TiltReturnAnimationDelay
            tiltReturnYAnimation.To = 0
            tiltReturnYAnimation.Duration = TiltReturnAnimationDuration

            tiltReturnZAnimation = New DoubleAnimation()
            Storyboard.SetTargetProperty(tiltReturnZAnimation, New PropertyPath(PlaneProjection.GlobalOffsetZProperty))
            tiltReturnZAnimation.BeginTime = TiltReturnAnimationDelay
            tiltReturnZAnimation.To = 0
            tiltReturnZAnimation.Duration = TiltReturnAnimationDuration

            If UseLogarithmicEase Then
                tiltReturnXAnimation.EasingFunction = New LogarithmicEase()
                tiltReturnYAnimation.EasingFunction = New LogarithmicEase()
                tiltReturnZAnimation.EasingFunction = New LogarithmicEase()
            End If

            tiltReturnStoryboard.Children.Add(tiltReturnXAnimation)
            tiltReturnStoryboard.Children.Add(tiltReturnYAnimation)
            tiltReturnStoryboard.Children.Add(tiltReturnZAnimation)
        End If

        Storyboard.SetTarget(tiltReturnXAnimation, element.Projection)
        Storyboard.SetTarget(tiltReturnYAnimation, element.Projection)
        Storyboard.SetTarget(tiltReturnZAnimation, element.Projection)
    End Sub


    ''' <summary>
    ''' Continues a tilt effect that is currently applied to an element, presumably because
    ''' the user moved their finger
    ''' </summary>
    ''' <param name="element">The element being tilted</param>
    ''' <param name="e">The manipulation event args</param>
    Private Shared Sub ContinueTiltEffect(ByVal element As FrameworkElement, ByVal e As ManipulationDeltaEventArgs)
        Dim container As FrameworkElement = TryCast(e.ManipulationContainer, FrameworkElement)
        If container Is Nothing OrElse element Is Nothing Then
            Return
        End If

        Dim tiltTouchPoint As Point = container.TransformToVisual(element).Transform(e.ManipulationOrigin)

        ' If touch moved outside bounds of element, then pause the tilt (but don't cancel it)
        If New Rect(0, 0, currentTiltElement.ActualWidth, currentTiltElement.ActualHeight).Contains(tiltTouchPoint) <> True Then

            PauseTiltEffect()
            Return
        End If

        ' Apply the updated tilt effect
        ApplyTiltEffect(currentTiltElement, e.ManipulationOrigin, currentTiltElementCenter)
    End Sub

    ''' <summary>
    ''' Ends the tilt effect by playing the animation  
    ''' </summary>
    ''' <param name="element">The element being tilted</param>
    Private Shared Sub EndTiltEffect(ByVal element As FrameworkElement)
        If element IsNot Nothing Then
            RemoveHandler element.ManipulationCompleted, AddressOf TiltEffect_ManipulationCompleted
            RemoveHandler element.ManipulationDelta, AddressOf TiltEffect_ManipulationDelta
        End If

        If tiltReturnStoryboard IsNot Nothing Then
            wasPauseAnimation = False
            If tiltReturnStoryboard.GetCurrentState() <> ClockState.Active Then
                tiltReturnStoryboard.Begin()
            End If
        Else
            StopTiltReturnStoryboardAndCleanup()
        End If
    End Sub

    ''' <summary>
    ''' Handler for the storyboard complete event
    ''' </summary>
    ''' <param name="sender">sender of the event</param>
    ''' <param name="e">event args</param>
    Private Shared Sub TiltReturnStoryboard_Completed(ByVal sender As Object, ByVal e As EventArgs)
        If wasPauseAnimation Then
            ResetTiltEffect(currentTiltElement)
        Else
            StopTiltReturnStoryboardAndCleanup()
        End If
    End Sub

    ''' <summary>
    ''' Resets the tilt effect on the control, making it appear 'normal' again 
    ''' </summary>
    ''' <param name="element">The element to reset the tilt on</param>
    ''' <remarks>
    ''' This method doesn't turn off the tilt effect or cancel any current
    ''' manipulation; it just temporarily cancels the effect
    ''' </remarks>
    Private Shared Sub ResetTiltEffect(ByVal element As FrameworkElement)
        Dim projection As PlaneProjection = TryCast(element.Projection, PlaneProjection)
        projection.RotationY = 0
        projection.RotationX = 0
        projection.GlobalOffsetZ = 0
    End Sub

    ''' <summary>
    ''' Stops the tilt effect and release resources applied to the currently-tilted control
    ''' </summary>
    Private Shared Sub StopTiltReturnStoryboardAndCleanup()
        If tiltReturnStoryboard IsNot Nothing Then
            tiltReturnStoryboard.Stop()
        End If

        RevertPrepareControlForTilt(currentTiltElement)
    End Sub

    ''' <summary>
    ''' Pauses the tilt effect so that the control returns to the 'at rest' position, but doesn't
    ''' stop the tilt effect (handlers are still attached, etc.)
    ''' </summary>
    Private Shared Sub PauseTiltEffect()
        If (tiltReturnStoryboard IsNot Nothing) AndAlso (Not wasPauseAnimation) Then
            tiltReturnStoryboard.Stop()
            wasPauseAnimation = True
            tiltReturnStoryboard.Begin()
        End If
    End Sub

    ''' <summary>
    ''' Resets the storyboard to not running
    ''' </summary>
    Private Shared Sub ResetTiltReturnStoryboard()
        tiltReturnStoryboard.Stop()
        wasPauseAnimation = False
    End Sub

    ''' <summary>
    ''' Applies the tilt effect to the control
    ''' </summary>
    ''' <param name="element">the control to tilt</param>
    ''' <param name="touchPoint">The touch point, in the container's coordinates</param>
    ''' <param name="centerPoint">The center point of the container</param>
    Private Shared Sub ApplyTiltEffect(ByVal element As FrameworkElement, ByVal touchPoint As Point, ByVal centerPoint As Point)
        ' Stop any active animation
        ResetTiltReturnStoryboard()

        ' Get relative point of the touch in percentage of container size
        Dim normalizedPoint As New Point(Math.Min(Math.Max(touchPoint.X / (centerPoint.X * 2), 0), 1), Math.Min(Math.Max(touchPoint.Y / (centerPoint.Y * 2), 0), 1))

        ' Shell values
        Dim xMagnitude As Double = Math.Abs(normalizedPoint.X - 0.5)
        Dim yMagnitude As Double = Math.Abs(normalizedPoint.Y - 0.5)
        Dim xDirection As Double = -Math.Sign(normalizedPoint.X - 0.5)
        Dim yDirection As Double = Math.Sign(normalizedPoint.Y - 0.5)
        Dim angleMagnitude As Double = xMagnitude + yMagnitude
        Dim xAngleContribution As Double = If(xMagnitude + yMagnitude > 0, xMagnitude / (xMagnitude + yMagnitude), 0)

        Dim angle As Double = angleMagnitude * MaxAngle * 180 / Math.PI
        Dim depression As Double = (1 - angleMagnitude) * MaxDepression

        ' RotationX and RotationY are the angles of rotations about the x- or y-*axis*;
        ' to achieve a rotation in the x- or y-*direction*, we need to swap the two.
        ' That is, a rotation to the left about the y-axis is a rotation to the left in the x-direction,
        ' and a rotation up about the x-axis is a rotation up in the y-direction.
        Dim projection As PlaneProjection = TryCast(element.Projection, PlaneProjection)
        projection.RotationY = angle * xAngleContribution * xDirection
        projection.RotationX = angle * (1 - xAngleContribution) * yDirection
        projection.GlobalOffsetZ = -depression
    End Sub

#End Region


#Region "Custom easing function"

    ''' <summary>
    ''' Provides an easing function for the tilt return
    ''' </summary>
    Private Class LogarithmicEase
        Inherits EasingFunctionBase
        ''' <summary>
        ''' Computes the easing function
        ''' </summary>
        ''' <param name="normalizedTime">The time</param>
        ''' <returns>The eased value</returns>
        Protected Overrides Function EaseInCore(ByVal normalizedTime As Double) As Double
            Return Math.Log(normalizedTime + 1) / 0.693147181 ' ln(t + 1) / ln(2)
        End Function
    End Class

#End Region
End Class

''' <summary>
''' Couple of simple helpers for walking the visual tree
''' </summary>
Friend Module TreeHelpers

    ''' <summary>
    ''' Gets the ancestors of the element, up to the root
    ''' </summary>
    ''' <param name="node">The element to start from</param>
    ''' <returns>An enumerator of the ancestors</returns>
    ''' 
    <System.Runtime.CompilerServices.Extension()> _
    Public Function GetVisualAncestors(ByVal node As FrameworkElement) As IEnumerable(Of FrameworkElement)
        Dim returnval As New List(Of FrameworkElement)
        Dim parent As FrameworkElement = node.GetVisualParent()
        Do While parent IsNot Nothing
            returnval.Add(parent)
            parent = parent.GetVisualParent()

        Loop
        Return returnval

    End Function

    ''' <summary>
    ''' Gets the visual parent of the element
    ''' </summary>
    ''' <param name="node">The element to check</param>
    ''' <returns>The visual parent</returns>
    <System.Runtime.CompilerServices.Extension()> _
    Public Function GetVisualParent(ByVal node As FrameworkElement) As FrameworkElement
        Return TryCast(VisualTreeHelper.GetParent(node), FrameworkElement)
    End Function
End Module
