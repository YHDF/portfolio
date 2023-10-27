export class contactMailDto {
  public senderName : string;
  public senderMail: string;
  public subject : string;
  public message : string;
  public sentDate : Date;


  constructor(senderName?: string, senderMail?: string, subject?: string, message?: string, sentDate?: Date) {
    this.senderName = senderName || "";
    this.senderMail = senderMail || "";
    this.subject = subject || "";
    this.message = message || "";
    this.sentDate = sentDate || new Date();
  }

}
