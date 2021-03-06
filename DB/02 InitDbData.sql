USE [TestDB]
GO
SET IDENTITY_INSERT [dbo].[Customer] ON 

INSERT [dbo].[Customer] ([Id], [Name]) VALUES (35, N'Pavel')
INSERT [dbo].[Customer] ([Id], [Name]) VALUES (36, N'Alexey')
INSERT [dbo].[Customer] ([Id], [Name]) VALUES (37, N'Dmitry')
SET IDENTITY_INSERT [dbo].[Customer] OFF
SET IDENTITY_INSERT [dbo].[Order] ON 

INSERT [dbo].[Order] ([Id], [CustomerId], [Date], [Number], [State]) VALUES (46, 35, CAST(N'2018-10-21T14:55:47.6530000+00:00' AS DateTimeOffset), 100, 0)
INSERT [dbo].[Order] ([Id], [CustomerId], [Date], [Number], [State]) VALUES (47, 36, CAST(N'2018-10-21T14:58:28.1090000+00:00' AS DateTimeOffset), 102, 1)
INSERT [dbo].[Order] ([Id], [CustomerId], [Date], [Number], [State]) VALUES (48, 37, CAST(N'2018-10-21T15:04:33.2760000+00:00' AS DateTimeOffset), 103, 2)
INSERT [dbo].[Order] ([Id], [CustomerId], [Date], [Number], [State]) VALUES (49, 36, CAST(N'2018-10-21T15:07:30.6040000+00:00' AS DateTimeOffset), 104, 3)
SET IDENTITY_INSERT [dbo].[Order] OFF
SET IDENTITY_INSERT [dbo].[OrderItem] ON 

INSERT [dbo].[OrderItem] ([Id], [Count], [OrderId], [Price], [Product]) VALUES (30, 43, 46, CAST(5.00 AS Decimal(18, 2)), N'Kinder surprise')
INSERT [dbo].[OrderItem] ([Id], [Count], [OrderId], [Price], [Product]) VALUES (31, 1, 46, CAST(5230000.00 AS Decimal(18, 2)), N'Audi q7')
INSERT [dbo].[OrderItem] ([Id], [Count], [OrderId], [Price], [Product]) VALUES (32, 100, 47, CAST(2.00 AS Decimal(18, 2)), N'Nescafe gold')
INSERT [dbo].[OrderItem] ([Id], [Count], [OrderId], [Price], [Product]) VALUES (33, 1, 47, CAST(5100000.00 AS Decimal(18, 2)), N'Mercedes-Benz CLS')
INSERT [dbo].[OrderItem] ([Id], [Count], [OrderId], [Price], [Product]) VALUES (34, 20, 48, CAST(4.00 AS Decimal(18, 2)), N'Pampers')
SET IDENTITY_INSERT [dbo].[OrderItem] OFF
