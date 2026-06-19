export interface ChatMessage {
    role: "user" | "model";
    parts: [{
        text: string;
    }];
}
export declare class GeminiService {
    static chat(message: string, history?: ChatMessage[]): Promise<string>;
}
//# sourceMappingURL=gemini.service.d.ts.map