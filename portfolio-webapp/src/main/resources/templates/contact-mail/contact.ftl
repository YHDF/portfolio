<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8"/>
    <title>[YH - POTFOLIO] : CONTACT FORM</title>
    <style>
        <#include "contact.css">
    </style>
</head>
<body>
<p>Nouveau message de ${contact.senderName} depuis l'adresse : <span><a href="mailto:${contact.senderMail}">${contact.senderMail}</a></span></p>
<h1>${contact.subject}</h1>
<p>${contact.message}</p>
</body>
</html>