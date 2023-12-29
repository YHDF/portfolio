<!DOCTYPE html>
<html lang="fr">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>[YH - PORTFOLIO] : MERCI POUR VOTRE MESSAGE</title>
  <style>
    <#include "contact-auto-reply.css">
  </style>
</head>

<body>
<div class="container">
  <p>Cher <span>${contact.senderName}</span>,</p>
  <p>Merci de m'avoir contact&eacute; ! J'ai bien re&ccedil;u votre message et je vous r&eacute;pondrai dans les plus brefs d&eacute;lais.</p>
  <p>En attendant, si vous avez des questions urgentes, n'h&eacute;sitez pas &agrave; me contacter &agrave; l'adresse <a href="mailto:${contact.senderMail}">${contact.senderMail}</a>.</p>
  <p>Ceci est un e-mail automatique de r&eacute;ponse et il n'est pas n&eacute;cessaire d'y r&eacute;pondre.</p>
  <p>Cordialement,<br>Youness H.</p>
</div>
</body>

</html>
