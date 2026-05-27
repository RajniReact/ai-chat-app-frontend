"use client";

import { useEffect, useRef, useState } from "react";
import { socket } from "@/lib/socket";
import api from "@/lib/axios";
import { useApp } from "./AppContext";

type Message = {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  senderPicture: string;
  time: string;
};

export default function ChatRoom() {
  const { user, isPremium } = useApp();
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [aiReply, setAiReply] = useState("");
  const [loadingSuggestion, setLoadingSuggestion] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onMessage = (message: Message) => {
      setMessages((prev) => [...prev, message]);
    };

    socket.on("receive_message", onMessage);

    return () => {
      socket.off("receive_message", onMessage);
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (e:any) => {
    e.preventDefault();
    if (!text.trim()) return;

    socket.emit("send_message", {
      id: crypto.randomUUID(),
      text: text.trim(),
      senderId: user.id,
      senderName: user.name,
      senderPicture: user.picture,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    });

    setText("");
  };

  const getSuggestion = async () => {
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage) return;

    setLoadingSuggestion(true);
    try {
      const { data } = await api.post("/suggest-reply", {
        message: lastMessage.text,
      });
      setAiReply(data.reply);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingSuggestion(false);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
        {messages.length === 0 && (
          <p className="mt-10 text-center text-sm text-zinc-400">
            No messages yet. Say hello.
          </p>
        )}

        {messages.map((message) => {
          const mine = message.senderId === user.id;
          return (
            <div
              key={message.id}
              className={`flex items-end gap-2 ${
                mine ? "flex-row-reverse" : ""
              }`}
            >
              <img
                src={message.senderPicture}
                alt={message.senderName}
                className="h-7 w-7 rounded-full"
              />
              <div
                className={`flex max-w-[75%] flex-col ${
                  mine ? "items-end" : "items-start"
                }`}
              >
                {!mine && (
                  <span className="mb-1 text-xs text-zinc-500">
                    {message.senderName}
                  </span>
                )}
                <div
                  className={`px-4 py-2 text-sm ${
                    mine
                      ? "rounded-2xl rounded-br-md bg-blue-600 text-white"
                      : "rounded-2xl rounded-bl-md border border-zinc-200 bg-white text-zinc-800"
                  }`}
                >
                  {message.text}
                </div>
                <span className="mt-1 text-[10px] text-zinc-400">
                  {message.time}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {aiReply && (
        <div className="flex items-center gap-2 border-t border-zinc-200 bg-blue-50 px-4 py-2 text-sm">
          <span className="text-zinc-500">Suggested:</span>
          <span className="flex-1 text-zinc-800">{aiReply}</span>
          <button
            onClick={() => {
              setText(aiReply);
              setAiReply("");
            }}
            className="rounded-md bg-blue-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-blue-700"
          >
            Use
          </button>
          <button
            onClick={() => setAiReply("")}
            className="px-1 text-zinc-400 hover:text-zinc-600"
          >
            ✕
          </button>
        </div>
      )}

      <form
        onSubmit={sendMessage}
        className="flex items-center gap-2 border-t border-zinc-200 bg-white px-4 py-3"
      >
        <button
          type="button"
          onClick={getSuggestion}
          disabled={!isPremium || loadingSuggestion || messages.length === 0}
          title={!isPremium ? "Unlock AI suggestions from the Dashboard" : ""}
          className="rounded-full border border-zinc-300 px-3 py-2.5 text-sm text-zinc-600 hover:bg-zinc-100 disabled:opacity-50"
        >
          {loadingSuggestion ? "..." : "Suggest"}
        </button>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message"
          className="flex-1 rounded-full bg-zinc-100 px-4 py-2.5 text-sm text-zinc-800 outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={!text.trim()}
          className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
}
