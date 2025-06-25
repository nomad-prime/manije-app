const DATA_PREFIX = "data: ";
const DATA_PREFIX_LENGTH = DATA_PREFIX.length;

export async function readStream<T>(
  response: Response,
  options: {
    onEvent: (event: T) => void;
    onDone?: () => void;
    createEventName: string;
  }
): Promise<T>;

export async function readStream<T>(
  response: Response,
  options: {
    onEvent: (event: T) => void;
    onDone?: () => void;
    createEventName?: undefined;
  }
): Promise<undefined>;

export async function readStream<T>(
  response: Response,
  options: {
    onEvent: (event: T) => void,
    onDone?: () => void,
    createEventName?: string,
  }
): Promise<T | undefined> {
  const body = response.body;
  if (!body) {
    throw new Error("No response body");
  }
  const textStream = body.pipeThrough(new TextDecoderStream()).pipeThrough(
    new TransformStream({
      transform(chunk, controller) {
        const lines = chunk.split("\n");
        for (const line of lines) {
          if (line.startsWith(DATA_PREFIX)) {
            try {
              const eventData = JSON.parse(line.slice(DATA_PREFIX_LENGTH));
              controller.enqueue(eventData);
            } catch (error) {
              console.error("Error parsing SSE event:", error);
            }
          }
        }
      },
    }),
  );

  const reader = textStream.getReader();

  let data: T | undefined;

  if (options.createEventName) {
    const firstEvent = await reader.read();
    if (firstEvent.done) {
      throw new Error("No events received");
    }

    const firstEventData = firstEvent.value;
    if (firstEventData.type !== options.createEventName) {
      throw new Error("First event was not the expected create event: " + options.createEventName);
    }

    data = firstEventData;
    options.onEvent(firstEventData);
  }

  // NOTE: We dont await the rest of the stream processing, because we dont want to block the main UI flow.
  continueStream(reader, options);

  return data;
}

async function continueStream<T>(
  reader: ReadableStreamDefaultReader<T>,
  options: {
    onEvent: (event: T) => void;
    onDone?: () => void;
    createEventName?: string;
  },
) {
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        options.onDone?.();
        break;
      }
      options.onEvent(value);
    }
  } catch (error) {
    console.error("Error reading stream:", error);
    options.onDone?.();
  }
}
