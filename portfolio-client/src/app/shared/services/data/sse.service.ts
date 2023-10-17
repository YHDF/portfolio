export abstract class SseService {

  private static eventSource: EventSource;

  public static getInstance(url: string): EventSource {
    if (!this.eventSource) {
      this.eventSource = new EventSource(url);
    }
    return this.eventSource;
  }

  public unsubscribe(){
      SseService.eventSource.close();
  }

  protected subscribe(path: string): void {
    const eventSource = SseService.getInstance(path);

    eventSource.onmessage = (event: MessageEvent<any>) => {
      this.onMessage(event);
    };

    eventSource.onerror = (error: Event) => {
      this.onError(error);
    };
  }

  protected abstract onMessage(event: MessageEvent<any>): void;

  protected abstract onError(error: Event): void;

}
