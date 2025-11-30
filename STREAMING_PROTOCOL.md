# AI SDK Stream Protocol for Backend

Your Go backend should output SSE events in this format for assistant-ui compatibility.

## Required Headers

```
Content-Type: text/event-stream
Cache-Control: no-cache
Connection: keep-alive
Transfer-Encoding: chunked
x-vercel-ai-ui-message-stream: v1
```

## Message Format

Each event is sent as:
```
data: {"type":"[message-type]","[property]":"[value]"}

```

Note: Double newline after each data line.

## Message Types

### 1. Message Start
```
data: {"type":"start","messageId":"msg_123"}

```

### 2. Text Streaming
```
data: {"type":"text-start","id":"text_1"}

data: {"type":"text-delta","id":"text_1","delta":"Let me "}

data: {"type":"text-delta","id":"text_1","delta":"help you"}

data: {"type":"text-end","id":"text_1"}

```

### 3. Tool Calling
```
data: {"type":"tool-input-start","toolCallId":"call_abc","toolName":"create_project"}

data: {"type":"tool-input-delta","toolCallId":"call_abc","inputTextDelta":"{\"name\":\""}

data: {"type":"tool-input-delta","toolCallId":"call_abc","inputTextDelta":"New Project\""}

data: {"type":"tool-input-available","toolCallId":"call_abc","input":{"name":"New Project"}}

```

### 4. Tool Results
```
data: {"type":"tool-output-available","toolCallId":"call_abc","output":{"id":"proj_123","status":"created"}}

```

### 5. Message Finish
```
data: {"type":"finish","finishReason":"stop"}

```

### 6. Stream End
```
data: [DONE]

```

## Error Handling
```
data: {"type":"error","error":"Error message here"}

```

## Example Full Flow

```
data: {"type":"start","messageId":"msg_001"}

data: {"type":"text-start","id":"text_1"}

data: {"type":"text-delta","id":"text_1","delta":"I'll create that project for you."}

data: {"type":"text-end","id":"text_1"}

data: {"type":"tool-input-start","toolCallId":"call_001","toolName":"create_project"}

data: {"type":"tool-input-available","toolCallId":"call_001","input":{"name":"My Project"}}

data: {"type":"tool-output-available","toolCallId":"call_001","output":{"id":"proj_123"}}

data: {"type":"text-start","id":"text_2"}

data: {"type":"text-delta","id":"text_2","delta":"Project created successfully!"}

data: {"type":"text-end","id":"text_2"}

data: {"type":"finish","finishReason":"stop"}

data: [DONE]

```

## Go Implementation Hint

```go
func writeSSE(w *bufio.Writer, eventType string, data interface{}) error {
    jsonData, err := json.Marshal(data)
    if err != nil {
        return err
    }

    if _, err := w.WriteString("data: " + string(jsonData) + "\n\n"); err != nil {
        return err
    }

    return w.Flush()
}

// Usage:
writeSSE(w, "text-delta", map[string]interface{}{
    "type": "text-delta",
    "id": "text_1",
    "delta": "Hello",
})
```

## References
- [AI SDK Stream Protocol](https://ai-sdk.dev/docs/ai-sdk-ui/stream-protocol)
- [Assistant UI Documentation](https://www.assistant-ui.com/docs/runtimes/pick-a-runtime)
