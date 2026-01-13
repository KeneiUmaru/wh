local function gs(s)
  return cloneref and cloneref(game:GetService(s)) or game:GetService(s)
end

local plrs = gs("Players")
local rs = gs("RunService")
local ts = gs("TweenService")

local screenGui = Instance.new("ScreenGui")
screenGui.Name = "ScreenGui"
screenGui.DisplayOrder = 2147483647
screenGui.IgnoreGuiInset = true
screenGui.ResetOnSpawn = false
screenGui.ScreenInsets = Enum.ScreenInsets.DeviceSafeInsets
screenGui.ZIndexBehavior = Enum.ZIndexBehavior.Sibling
screenGui.Parent = rs:IsStudio() and plrs.LocalPlayer:FindFirstChild("PlayerGui") or gethui and gethui() or gs("CoreGui")

Notify = function(name, desc) 
  local notification = Instance.new("ImageButton")
  notification.Name = "Notification"
  notification.AnchorPoint = Vector2.new(0, 1)
  notification.AutoButtonColor = false
  notification.AutomaticSize = Enum.AutomaticSize.Y
  notification.BackgroundColor3 = Color3.fromRGB(50, 50, 50)
  notification.BorderColor3 = Color3.fromRGB(0, 0, 0)
  notification.BorderSizePixel = 0
  notification.ImageTransparency = 1
  notification.Position = UDim2.new(1, 1, 1, -15)
  notification.ScaleType = Enum.ScaleType.Tile
  notification.Size = UDim2.fromOffset(280, 0)
  notification.TileSize = UDim2.fromOffset(500, 325)
  notification.ZIndex = 2147483647
  notification.Parent = screenGui

  local content = Instance.new("Frame")
  content.Name = "Content"
  content.AutomaticSize = Enum.AutomaticSize.Y
  content.BackgroundColor3 = Color3.fromRGB(255, 255, 255)
  content.BackgroundTransparency = 1
  content.BorderColor3 = Color3.fromRGB(0, 0, 0)
  content.BorderSizePixel = 0
  content.Size = UDim2.fromScale(1, 0)

  local uIPadding = Instance.new("UIPadding")
  uIPadding.Name = "UIPadding"
  uIPadding.PaddingBottom = UDim.new(0, 13)
  uIPadding.PaddingLeft = UDim.new(0, 13)
  uIPadding.PaddingRight = UDim.new(0, 29)
  uIPadding.PaddingTop = UDim.new(0, 13)
  uIPadding.Parent = content

  local uIListLayout = Instance.new("UIListLayout")
  uIListLayout.Name = "UIListLayout"
  uIListLayout.Padding = UDim.new(0, 5)
  uIListLayout.SortOrder = Enum.SortOrder.LayoutOrder
  uIListLayout.VerticalAlignment = Enum.VerticalAlignment.Center
  uIListLayout.Parent = content

  local titleContent = Instance.new("Frame")
  titleContent.Name = "TitleContent"
  titleContent.AutomaticSize = Enum.AutomaticSize.Y
  titleContent.BackgroundColor3 = Color3.fromRGB(255, 255, 255)
  titleContent.BackgroundTransparency = 1
  titleContent.BorderColor3 = Color3.fromRGB(0, 0, 0)
  titleContent.BorderSizePixel = 0
  titleContent.Size = UDim2.fromScale(1, 0)

  local uIListLayout1 = Instance.new("UIListLayout")
  uIListLayout1.Name = "UIListLayout"
  uIListLayout1.FillDirection = Enum.FillDirection.Horizontal
  uIListLayout1.Padding = UDim.new(0, 13)
  uIListLayout1.SortOrder = Enum.SortOrder.LayoutOrder
  uIListLayout1.Parent = titleContent

  local icon = Instance.new("ImageLabel")
  icon.Name = "Icon"
  icon.BackgroundColor3 = Color3.fromRGB(255, 255, 255)
  icon.BackgroundTransparency = 1
  icon.BorderColor3 = Color3.fromRGB(0, 0, 0)
  icon.BorderSizePixel = 0
  icon.Image = "rbxassetid://105730446830409"
  icon.ScaleType = Enum.ScaleType.Fit
  icon.Size = UDim2.fromOffset(16, 16)
  icon.Parent = titleContent

  local content1 = Instance.new("Frame")
  content1.Name = "Content"
  content1.AutomaticSize = Enum.AutomaticSize.Y
  content1.BackgroundColor3 = Color3.fromRGB(255, 255, 255)
  content1.BackgroundTransparency = 1
  content1.BorderColor3 = Color3.fromRGB(0, 0, 0)
  content1.BorderSizePixel = 0
  content1.LayoutOrder = 1
  content1.Size = UDim2.fromScale(1, 0)

  local uIListLayout2 = Instance.new("UIListLayout")
  uIListLayout2.Name = "UIListLayout"
  uIListLayout2.Padding = UDim.new(0, 5)
  uIListLayout2.SortOrder = Enum.SortOrder.LayoutOrder
  uIListLayout2.VerticalAlignment = Enum.VerticalAlignment.Center
  uIListLayout2.Parent = content1

  local title = Instance.new("TextLabel")
  title.Name = "Title"
  title.AutomaticSize = Enum.AutomaticSize.Y
  title.BackgroundColor3 = Color3.fromRGB(255, 255, 255)
  title.BackgroundTransparency = 1
  title.BorderColor3 = Color3.fromRGB(0, 0, 0)
  title.BorderSizePixel = 0
  title.FontFace = Font.new(
    "rbxassetid://12187365364",
    Enum.FontWeight.SemiBold,
    Enum.FontStyle.Normal
  )
  title.LayoutOrder = 1
  title.RichText = true
  title.Size = UDim2.fromScale(1, 0)
  title.Text = name
  title.TextColor3 = Color3.fromRGB(255, 255, 255)
  title.TextSize = 16
  title.TextWrapped = true
  title.TextXAlignment = Enum.TextXAlignment.Left
  title.TextYAlignment = Enum.TextYAlignment.Top
  title.Parent = content1

  local description = Instance.new("TextLabel")
  description.Name = "Description"
  description.AutomaticSize = Enum.AutomaticSize.Y
  description.BackgroundColor3 = Color3.fromRGB(255, 255, 255)
  description.BackgroundTransparency = 1
  description.BorderColor3 = Color3.fromRGB(0, 0, 0)
  description.BorderSizePixel = 0
  description.FontFace = Font.new(
    "rbxassetid://12187365364",
    Enum.FontWeight.Medium,
    Enum.FontStyle.Normal
  )
  description.LayoutOrder = 1
  description.RichText = true
  description.Size = UDim2.fromScale(1, 0)
  description.Text = desc
  description.TextColor3 = Color3.fromRGB(150, 150, 150)
  description.TextSize = 14
  description.TextWrapped = true
  description.TextXAlignment = Enum.TextXAlignment.Left
  description.TextYAlignment = Enum.TextYAlignment.Top
  description.Parent = content1

  local uIPadding1 = Instance.new("UIPadding")
  uIPadding1.Name = "UIPadding"
  uIPadding1.PaddingTop = UDim.new(0, -1)
  uIPadding1.Parent = content1

  content1.Parent = titleContent

  local uIPadding2 = Instance.new("UIPadding")
  uIPadding2.Name = "UIPadding"
  uIPadding2.PaddingTop = UDim.new(0, 1)
  uIPadding2.Parent = titleContent

  titleContent.Parent = content

  content.Parent = notification

  local uICorner = Instance.new("UICorner")
  uICorner.Name = "UICorner"
  uICorner.CornerRadius = UDim.new(0, 20)
  uICorner.Parent = notification

  local uIGradient = Instance.new("UIGradient")
  uIGradient.Name = "UIGradient"
  uIGradient.Color = ColorSequence.new({
    ColorSequenceKeypoint.new(0, Color3.fromRGB(234, 136, 66)),
    ColorSequenceKeypoint.new(1, Color3.fromRGB(98, 47, 137)),
  })
  uIGradient.Rotation = -90
  uIGradient.Parent = notification

  local uIStroke = Instance.new("UIStroke")
  uIStroke.Name = "UIStroke"
  uIStroke.ApplyStrokeMode = Enum.ApplyStrokeMode.Border
  uIStroke.Color = Color3.fromRGB(255, 255, 255)

  local uIGradient1 = Instance.new("UIGradient")
  uIGradient1.Name = "UIGradient"
  uIGradient1.Color = ColorSequence.new({
    ColorSequenceKeypoint.new(0, Color3.fromRGB(234, 136, 66)),
    ColorSequenceKeypoint.new(1, Color3.fromRGB(98, 47, 137)),
  })
  uIGradient1.Rotation = 270
  uIGradient1.Parent = uIStroke

  uIStroke.Parent = notification
  
  ts:Create(notification,TweenInfo.new(0.2, Enum.EasingStyle.Exponential),{Position = UDim2.new(1,-(notification.AbsoluteSize.X+15),1,-15)}):Play()
  
  coroutine.wrap(function() 
    task.wait(5)

    ts:Create(notification,TweenInfo.new(0.2, Enum.EasingStyle.Exponential),{Position = UDim2.new(1,1,1,-15)}):Play()
  end)();
end
-- eg:
-- notify("Success!", "Successfully copied the URL to your clipboard.")

local frame = Instance.new("Frame")
frame.Name = "Frame"
frame.AnchorPoint = Vector2.new(0.5, 0.5)
frame.AutomaticSize = Enum.AutomaticSize.Y
frame.BackgroundColor3 = Color3.fromRGB(50, 50, 50)
frame.BorderColor3 = Color3.fromRGB(0, 0, 0)
frame.BorderSizePixel = 0
frame.ClipsDescendants = true
frame.Position = UDim2.fromScale(0.5, 0.5)
frame.Size = UDim2.fromOffset(350, 0)
frame.ZIndex = 2147483646

local uICorner = Instance.new("UICorner")
uICorner.Name = "UICorner"
uICorner.CornerRadius = UDim.new(0, 20)
uICorner.Parent = frame

local uIPadding = Instance.new("UIPadding")
uIPadding.Name = "UIPadding"
uIPadding.PaddingBottom = UDim.new(0, 25)
uIPadding.PaddingTop = UDim.new(0, 35)
uIPadding.Parent = frame

local textLabel = Instance.new("TextLabel")
textLabel.Name = "TextLabel"
textLabel.AutomaticSize = Enum.AutomaticSize.XY
textLabel.BackgroundColor3 = Color3.fromRGB(255, 255, 255)
textLabel.BackgroundTransparency = 1
textLabel.BorderColor3 = Color3.fromRGB(0, 0, 0)
textLabel.BorderSizePixel = 0
textLabel.FontFace = Font.new("rbxassetid://12187365364")
textLabel.LayoutOrder = 1
textLabel.Position = UDim2.fromScale(0, 1)
textLabel.RichText = true
textLabel.Size = UDim2.fromScale(1, 0)
textLabel.Text = "Authentication services provided by <b>securelua.com</b>"
textLabel.TextColor3 = Color3.fromRGB(150, 150, 150)
textLabel.TextSize = 12
textLabel.TextWrapped = true
textLabel.TextYAlignment = Enum.TextYAlignment.Top
textLabel.Parent = frame

local uIGradient = Instance.new("UIGradient")
uIGradient.Name = "UIGradient"
uIGradient.Color = ColorSequence.new({
  ColorSequenceKeypoint.new(0, Color3.fromRGB(234, 136, 66)),
  ColorSequenceKeypoint.new(1, Color3.fromRGB(98, 47, 137)),
})
uIGradient.Rotation = -90
uIGradient.Parent = frame

local frame1 = Instance.new("Frame")
frame1.Name = "Frame"
frame1.AutomaticSize = Enum.AutomaticSize.Y
frame1.BackgroundColor3 = Color3.fromRGB(255, 255, 255)
frame1.BackgroundTransparency = 1
frame1.BorderColor3 = Color3.fromRGB(0, 0, 0)
frame1.BorderSizePixel = 0
frame1.Size = UDim2.fromScale(1, 0)

local uIListLayout = Instance.new("UIListLayout")
uIListLayout.Name = "UIListLayout"
uIListLayout.HorizontalAlignment = Enum.HorizontalAlignment.Center
uIListLayout.Padding = UDim.new(0, 30)
uIListLayout.SortOrder = Enum.SortOrder.LayoutOrder
uIListLayout.Parent = frame1

local frame2 = Instance.new("Frame")
frame2.Name = "Frame"
frame2.AutomaticSize = Enum.AutomaticSize.Y
frame2.BackgroundColor3 = Color3.fromRGB(255, 255, 255)
frame2.BackgroundTransparency = 1
frame2.BorderColor3 = Color3.fromRGB(0, 0, 0)
frame2.BorderSizePixel = 0
frame2.LayoutOrder = 1
frame2.Size = UDim2.fromScale(1, 0)

local uIListLayout1 = Instance.new("UIListLayout")
uIListLayout1.Name = "UIListLayout"
uIListLayout1.HorizontalAlignment = Enum.HorizontalAlignment.Center
uIListLayout1.Padding = UDim.new(0, 20)
uIListLayout1.SortOrder = Enum.SortOrder.LayoutOrder
uIListLayout1.Parent = frame2

local textButton = Instance.new("TextButton")
textButton.AutoButtonColor = false
textButton.Name = "TextButton"
textButton.AutomaticSize = Enum.AutomaticSize.Y
textButton.BackgroundColor3 = Color3.fromRGB(255, 255, 255)
textButton.BorderColor3 = Color3.fromRGB(0, 0, 0)
textButton.BorderSizePixel = 0
textButton.FontFace = Font.new(
  "rbxassetid://12187365364",
  Enum.FontWeight.Medium,
  Enum.FontStyle.Normal
)
textButton.LayoutOrder = 1
textButton.Size = UDim2.fromScale(1, 0)
textButton.Text = "Authenticate"
textButton.TextColor3 = Color3.fromRGB(0, 0, 0)
textButton.TextSize = 15
textButton.TextWrapped = true

local uIPadding1 = Instance.new("UIPadding")
uIPadding1.Name = "UIPadding"
uIPadding1.PaddingBottom = UDim.new(0, 13)
uIPadding1.PaddingLeft = UDim.new(0, 15)
uIPadding1.PaddingRight = UDim.new(0, 15)
uIPadding1.PaddingTop = UDim.new(0, 13)
uIPadding1.Parent = textButton

local uICorner1 = Instance.new("UICorner")
uICorner1.Name = "UICorner"
uICorner1.CornerRadius = UDim.new(1, 0)
uICorner1.Parent = textButton

textButton.Parent = frame2

local textBox = Instance.new("TextBox")
textBox.Name = "TextBox"
textBox.AutomaticSize = Enum.AutomaticSize.Y
textBox.BackgroundColor3 = Color3.fromRGB(25, 25, 25)
textBox.BackgroundTransparency = 1
textBox.BorderColor3 = Color3.fromRGB(0, 0, 0)
textBox.BorderSizePixel = 0
textBox.ClipsDescendants = true
textBox.FontFace = Font.new(
  "rbxassetid://12187365364",
  Enum.FontWeight.Medium,
  Enum.FontStyle.Normal
)
textBox.PlaceholderColor3 = Color3.fromRGB(150, 150, 150)
textBox.PlaceholderText = "Registration key"
textBox.Size = UDim2.fromScale(1, 0)
textBox.Text = ""
textBox.TextColor3 = Color3.fromRGB(215, 215, 215)
textBox.TextSize = 15
textBox.TextXAlignment = Enum.TextXAlignment.Left
textBox.ZIndex = 2

local uIPadding2 = Instance.new("UIPadding")
uIPadding2.Name = "UIPadding"
uIPadding2.PaddingBottom = UDim.new(0, 13)
uIPadding2.PaddingLeft = UDim.new(0, 15)
uIPadding2.PaddingRight = UDim.new(0, 15)
uIPadding2.PaddingTop = UDim.new(0, 13)
uIPadding2.Parent = textBox

local uIStroke = Instance.new("UIStroke")
uIStroke.Name = "UIStroke"
uIStroke.ApplyStrokeMode = Enum.ApplyStrokeMode.Border
uIStroke.Color = Color3.fromRGB(255, 255, 255)
uIStroke.Transparency = 0.85
uIStroke.Parent = textBox

local uICorner2 = Instance.new("UICorner")
uICorner2.Name = "UICorner"
uICorner2.Parent = textBox

local function change(state)
  ts:Create(textBox, TweenInfo.new(0.15, Enum.EasingStyle.Quad), {BackgroundTransparency = state and 0 or 1}):Play()
  ts:Create(uIStroke, TweenInfo.new(0.15, Enum.EasingStyle.Quad),  
    state and {Color = Color3.fromRGB(255, 255, 255), Transparency = 0.3} 
      or {Color = Color3.fromRGB(255, 255, 255), Transparency = 0.85}
  ):Play()
end

textBox.Focused:Connect(function()
  change(true)
end)

textBox.FocusLost:Connect(function()
  change(false)
end)

textBox.Parent = frame2

local textButton1 = Instance.new("TextButton")
textButton1.AutoButtonColor = false
textButton1.Name = "TextButton"
textButton1.AutomaticSize = Enum.AutomaticSize.Y
textButton1.BackgroundColor3 = Color3.fromRGB(75, 75, 75)
textButton1.BorderColor3 = Color3.fromRGB(0, 0, 0)
textButton1.BorderSizePixel = 0
textButton1.FontFace = Font.new(
  "rbxassetid://12187365364",
  Enum.FontWeight.Medium,
  Enum.FontStyle.Normal
)
textButton1.LayoutOrder = 2
textButton1.Size = UDim2.fromScale(1, 0)
textButton1.Text = ""
textButton1.TextColor3 = Color3.fromRGB(0, 0, 0)
textButton1.TextSize = 15
textButton1.TextWrapped = true
textButton1.Visible = INTERNAL_REWARD_CONNECTED

local uIPadding3 = Instance.new("UIPadding")
uIPadding3.Name = "UIPadding"
uIPadding3.PaddingBottom = UDim.new(0, 13)
uIPadding3.PaddingLeft = UDim.new(0, 15)
uIPadding3.PaddingRight = UDim.new(0, 15)
uIPadding3.PaddingTop = UDim.new(0, 13)
uIPadding3.Parent = textButton1

local uICorner3 = Instance.new("UICorner")
uICorner3.Name = "UICorner"
uICorner3.CornerRadius = UDim.new(1, 0)
uICorner3.Parent = textButton1

local textLabel1 = Instance.new("TextLabel")
textLabel1.Name = "TextLabel"
textLabel1.AnchorPoint = Vector2.new(0.5, 0.5)
textLabel1.AutomaticSize = Enum.AutomaticSize.XY
textLabel1.BackgroundColor3 = Color3.fromRGB(255, 255, 255)
textLabel1.BackgroundTransparency = 1
textLabel1.BorderColor3 = Color3.fromRGB(0, 0, 0)
textLabel1.BorderSizePixel = 0
textLabel1.FontFace = Font.new(
  "rbxassetid://12187365364",
  Enum.FontWeight.Medium,
  Enum.FontStyle.Normal
)
textLabel1.Position = UDim2.fromScale(0.5, 0.5)
textLabel1.Text = "Get Key"
textLabel1.TextColor3 = Color3.fromRGB(255, 255, 255)
textLabel1.TextSize = 15
textLabel1.Parent = textButton1

local uIStroke1 = Instance.new("UIStroke")
uIStroke1.Name = "UIStroke"
uIStroke1.ApplyStrokeMode = Enum.ApplyStrokeMode.Border
uIStroke1.Color = Color3.fromRGB(200, 200, 200)

local uIGradient1 = Instance.new("UIGradient")
uIGradient1.Name = "UIGradient"
uIGradient1.Color = ColorSequence.new({
  ColorSequenceKeypoint.new(0, Color3.fromRGB(234, 136, 66)),
  ColorSequenceKeypoint.new(1, Color3.fromRGB(98, 47, 137)),
})

ts:Create(uIGradient1, TweenInfo.new(6,Enum.EasingStyle.Linear,Enum.EasingDirection.Out,-1,false), {Rotation = 360}):Play()

uIGradient1.Parent = uIStroke1

uIStroke1.Parent = textButton1

local uIGradient2 = Instance.new("UIGradient")
uIGradient2.Name = "UIGradient"
uIGradient2.Color = ColorSequence.new({
  ColorSequenceKeypoint.new(0, Color3.fromRGB(234, 136, 66)),
  ColorSequenceKeypoint.new(1, Color3.fromRGB(98, 47, 137)),
})
uIGradient2.Parent = textButton1

textButton1.Parent = frame2

frame2.Parent = frame1

local frame3 = Instance.new("Frame")
frame3.Name = "Frame"
frame3.AutomaticSize = Enum.AutomaticSize.Y
frame3.BackgroundColor3 = Color3.fromRGB(255, 255, 255)
frame3.BackgroundTransparency = 1
frame3.BorderColor3 = Color3.fromRGB(0, 0, 0)
frame3.BorderSizePixel = 0
frame3.Size = UDim2.fromScale(1, 0)

local uIListLayout2 = Instance.new("UIListLayout")
uIListLayout2.Name = "UIListLayout"
uIListLayout2.HorizontalAlignment = Enum.HorizontalAlignment.Center
uIListLayout2.Padding = UDim.new(0, 10)
uIListLayout2.SortOrder = Enum.SortOrder.LayoutOrder
uIListLayout2.Parent = frame3

local imageLabel = Instance.new("ImageLabel")
imageLabel.Name = "ImageLabel"
imageLabel.BackgroundColor3 = Color3.fromRGB(255, 255, 255)
imageLabel.BackgroundTransparency = 1
imageLabel.BorderColor3 = Color3.fromRGB(0, 0, 0)
imageLabel.BorderSizePixel = 0
imageLabel.Image = "rbxassetid://87955941483178"
imageLabel.Size = UDim2.fromOffset(40, 40)
imageLabel.Parent = frame3

local textLabel2 = Instance.new("TextLabel")
textLabel2.Name = "TextLabel"
textLabel2.AutomaticSize = Enum.AutomaticSize.Y
textLabel2.BackgroundColor3 = Color3.fromRGB(255, 255, 255)
textLabel2.BackgroundTransparency = 1
textLabel2.BorderColor3 = Color3.fromRGB(0, 0, 0)
textLabel2.BorderSizePixel = 0
textLabel2.FontFace = Font.new(
  "rbxassetid://12187365364",
  Enum.FontWeight.Medium,
  Enum.FontStyle.Normal
)
textLabel2.LayoutOrder = 2
textLabel2.Size = UDim2.fromScale(1, 0)
textLabel2.Text = "Enter your registration key below to access \"" .. PROJECT_NAME .. "\"."
textLabel2.TextColor3 = Color3.fromRGB(150, 150, 150)
textLabel2.TextSize = 13
textLabel2.TextWrapped = true
textLabel2.Parent = frame3

local textLabel3 = Instance.new("TextLabel")
textLabel3.Name = "TextLabel"
textLabel3.AutomaticSize = Enum.AutomaticSize.XY
textLabel3.BackgroundColor3 = Color3.fromRGB(255, 255, 255)
textLabel3.BackgroundTransparency = 1
textLabel3.BorderColor3 = Color3.fromRGB(0, 0, 0)
textLabel3.BorderSizePixel = 0
textLabel3.FontFace = Font.new(
  "rbxassetid://12187365364",
  Enum.FontWeight.Bold,
  Enum.FontStyle.Normal
)
textLabel3.Text = "Welcome"
textLabel3.TextColor3 = Color3.fromRGB(255, 255, 255)
textLabel3.TextSize = 25
textLabel3.TextWrapped = true
textLabel3.Parent = frame3

frame3.Parent = frame1

local uIPadding4 = Instance.new("UIPadding")
uIPadding4.Name = "UIPadding"
uIPadding4.PaddingLeft = UDim.new(0, 50)
uIPadding4.PaddingRight = UDim.new(0, 50)
uIPadding4.Parent = frame1

frame1.Parent = frame

local uIListLayout3 = Instance.new("UIListLayout")
uIListLayout3.Name = "UIListLayout"
uIListLayout3.Padding = UDim.new(0, 40)
uIListLayout3.SortOrder = Enum.SortOrder.LayoutOrder
uIListLayout3.Parent = frame

local uIStroke2 = Instance.new("UIStroke")
uIStroke2.Name = "UIStroke"
uIStroke2.ApplyStrokeMode = Enum.ApplyStrokeMode.Border
uIStroke2.Color = Color3.fromRGB(255, 255, 255)

local uIGradient3 = Instance.new("UIGradient")
uIGradient3.Name = "UIGradient"
uIGradient3.Color = ColorSequence.new({
  ColorSequenceKeypoint.new(0, Color3.fromRGB(234, 136, 66)),
  ColorSequenceKeypoint.new(1, Color3.fromRGB(98, 47, 137)),
})
uIGradient3.Rotation = 270
uIGradient3.Parent = uIStroke2
uIStroke2.Parent = frame
frame.Parent = screenGui

local Clicked;
textButton.MouseButton1Down:Connect(function() 
  if #textBox.Text <= 0 then
    return;
  end;
  Clicked = true;
end);

textButton1.MouseButton1Down:Connect(function() 
  setclipboard(INTERNAL_REWARD_URL);
  Notify("Success!", "Successfully copied the URL to your clipboard.");
end);

while true do 
  wait();
  if Clicked then
    break;
  end;
end;

frame.Visible = false;
LicenseKey = textBox.Text;