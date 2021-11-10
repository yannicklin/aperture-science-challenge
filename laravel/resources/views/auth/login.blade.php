<!DOCTYPE html>

<html>

<head>
    <meta charset=utf-8 />
    <meta name="viewport" content="user-scalable=no, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, minimal-ui">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Login</title>
</head>

<body>

<form method="POST" action="/login">
    @csrf
    <input id="username" name="username" type="text" />
    <input id="password" name="password" type="password" />
    <input type="submit"/>
</form>

</body>
</html>
