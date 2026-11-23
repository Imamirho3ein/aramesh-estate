"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpLeft, Bot, Maximize2, Send, Sparkles, X } from "lucide-react";
import { assistantReply, initialAssistantMessage } from "@/lib/assistant";
import { getProperty } from "@/lib/data";
import { fa, propertyPrice } from "@/lib/utils";
import type { ChatMessage } from "@/lib/types";
import { cn } from "@/lib/utils";

function MiniProperty({ id }: { id: string }) {
  const p = getProperty(id);
  if (!p) return null;
  const price = propertyPrice(p);
  return (
    <Link
      href={`/smart/properties/${p.id}`}
      className="group flex items-center gap-2.5 rounded-xl border border-line bg-surface/70 p-2 transition hover:border-accent/35"
    >
      <img src={p.images[0]} alt={p.title} className="size-12 rounded-lg object-cover" />
      <div className="min-w-0 flex-1">
        <div className="truncate text-[11px] font-bold text-ink">{p.title}</div>
        <div className="mt-0.5 flex items-center gap-1.5 text-[9px] text-muted">
          <span>{p.district}</span>
          <span>·</span>
          <span>{fa(p.area)} متر</span>
        </div>
        <div className="mt-0.5 text-[10px] font-semibold text-accent">{price.main}</div>
      </div>
      <ArrowUpLeft size={13} className="shrink-0 text-muted transition group-hover:text-accent" />
    </Link>
  );
}

function ChatBody({
  embedded = false,
  onExpand,
}: {
  embedded?: boolean;
  onExpand?: () => void;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([initialAssistantMessage()]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, typing]);

  const send = (raw?: string) => {
    const text = (raw ?? input).trim();
    if (!text || typing) return;
    setInput("");
    const userMessage: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      text,
    };
    setMessages((prev) => [...prev, userMessage]);
    setTyping(true);
    window.setTimeout(() => {
      const reply = assistantReply(text);
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: "assistant",
          text: reply.text,
          propertyIds: reply.propertyIds,
          quickReplies: reply.quickReplies,
        },
      ]);
      setTyping(false);
    }, 750);
  };

  return (
    <div className={cn("flex min-h-0 flex-1 flex-col", embedded && "h-full")}>
      <div
        ref={scroller}
        className={cn(
          "flex-1 space-y-4 overflow-y-auto p-4",
          embedded ? "min-h-[300px]" : "max-h-[420px] min-h-[300px]",
        )}
      >
        {messages.map((message) => (
          <div key={message.id} className="space-y-2.5">
            <div
              className={cn(
                "flex items-end gap-2",
                message.role === "user" ? "justify-end" : "justify-start",
              )}
            >
              {message.role === "assistant" ? (
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-accent text-[#0a0f0c]">
                  <Bot size={14} />
                </span>
              ) : null}
              <div
                className={cn(
                  "max-w-[84%] whitespace-pre-line rounded-2xl px-3.5 py-2.5 text-[11.5px] leading-6",
                  message.role === "user"
                    ? "rounded-bl-md bg-accent font-medium text-[#0a0f0c]"
                    : "rounded-br-md border border-line bg-surface/80 text-ink/85",
                )}
              >
                {message.text}
              </div>
            </div>

            {message.propertyIds?.length ? (
              <div className="ms-9 space-y-1.5">
                {message.propertyIds.map((id) => (
                  <MiniProperty key={id} id={id} />
                ))}
                <Link
                  href="/smart/compare"
                  className="flex items-center justify-center gap-1 rounded-lg border border-accent/25 bg-accent/5 py-2 text-[10px] font-semibold text-accent transition hover:bg-accent/10"
                >
                  مقایسه‌ی هوشمند این فایل‌ها <ArrowUpLeft size={11} />
                </Link>
              </div>
            ) : null}

            {message.quickReplies?.length && message.id === messages[messages.length - 1]?.id ? (
              <div className="ms-9 flex flex-wrap gap-1.5">
                {message.quickReplies.map((reply) => (
                  <button
                    key={reply}
                    type="button"
                    onClick={() => send(reply)}
                    className="rounded-full border border-line bg-surface/60 px-2.5 py-1.5 text-[10px] text-muted transition hover:border-accent/30 hover:text-accent"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        ))}

        {typing ? (
          <div className="flex items-end gap-2">
            <span className="grid size-7 place-items-center rounded-full bg-accent text-[#0a0f0c]">
              <Bot size={14} />
            </span>
            <div className="flex items-center gap-1 rounded-2xl rounded-br-md border border-line bg-surface/80 px-3.5 py-3">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="size-1.5 animate-bounce rounded-full bg-accent/70"
                  style={{ animationDelay: `${i * 120}ms` }}
                />
              ))}
            </div>
          </div>
        ) : null}
      </div>

      <div className="border-t border-line bg-surface/40 p-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
          className="flex items-center gap-2 rounded-2xl border border-line bg-[#080d10] p-1.5 focus-within:border-accent/40"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="مثلاً: آپارتمان ۱۵۰ متری زعفرانیه تا ۳۰ میلیارد"
            className="h-9 min-w-0 flex-1 bg-transparent px-2 text-[11px] text-ink outline-none placeholder:text-muted/70"
          />
          <button
            type="submit"
            aria-label="ارسال"
            className="grid size-9 shrink-0 place-items-center rounded-xl bg-accent text-[#0a0f0c] transition hover:bg-[#d4fa7a] disabled:opacity-50"
            disabled={!input.trim() || typing}
          >
            <Send size={15} />
          </button>
        </form>
        <div className="mt-2 flex items-center justify-between px-1">
          <span className="text-[8.5px] text-muted/70">
            پاسخ‌ها بر اساس داده‌های ثبت‌شده در سامانه است
          </span>
          {embedded ? null : onExpand ? (
            <button
              type="button"
              onClick={onExpand}
              className="flex items-center gap-1 text-[8.5px] text-muted transition hover:text-accent"
            >
              <Maximize2 size={10} /> صفحه کامل
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function SmartAssistant() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-6 right-5 z-[95] flex flex-col items-end gap-3">
        {open ? (
          <div className="animate-fade-up w-[min(92vw,390px)] overflow-hidden rounded-[1.4rem] border border-line bg-[#0a0f13]/95 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)] backdrop-blur-xl">
            <div className="flex items-center justify-between border-b border-line bg-gradient-to-l from-accent/[0.07] to-transparent px-4 py-3">
              <div className="flex items-center gap-2.5">
                <span className="relative grid size-9 place-items-center rounded-xl bg-accent text-[#0a0f0c]">
                  <Bot size={18} />
                  <span className="absolute -bottom-0.5 -left-0.5 size-2.5 rounded-full border-2 border-[#0a0f13] bg-emerald-400" />
                </span>
                <div>
                  <div className="text-xs font-bold">دستیار آرامش</div>
                  <div className="flex items-center gap-1 text-[9px] text-accent">
                    <Sparkles size={9} /> آنلاین · پاسخ فوری
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="بستن دستیار"
                className="grid size-8 place-items-center rounded-full border border-line text-muted transition hover:text-ink"
              >
                <X size={15} />
              </button>
            </div>
            <ChatBody onExpand={() => (window.location.href = "/smart/explore#assistant")} />
          </div>
        ) : null}

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="group flex items-center gap-2.5 rounded-full border border-accent/30 bg-[#0a0f13]/90 py-2 pe-3 ps-2 shadow-[0_18px_50px_-12px_rgba(0,0,0,0.7)] backdrop-blur transition hover:border-accent/60"
        >
          <span className="relative grid size-10 place-items-center rounded-full bg-accent text-[#0a0f0c]">
            <Bot size={19} />
            <span className="absolute inset-0 animate-ping rounded-full bg-accent/30" />
          </span>
          <span className="hidden flex-col items-start sm:flex">
            <span className="text-[11px] font-bold">دستیار هوشمند</span>
            <span className="text-[9px] text-muted">بپرس، پیدا می‌کنم</span>
          </span>
        </button>
      </div>
    </>
  );
}

export function AssistantEmbedded() {
  return (
    <div className="flex h-[520px] flex-col overflow-hidden rounded-[1.5rem] border border-line bg-[#090e12]/80 backdrop-blur">
      <div className="flex items-center justify-between border-b border-line bg-gradient-to-l from-accent/[0.06] to-transparent px-5 py-3.5">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-accent text-[#0a0f0c]">
            <Bot size={20} />
          </span>
          <div>
            <div className="text-sm font-bold">دستیار هوشمند آرامش</div>
            <div className="mt-0.5 flex items-center gap-1.5 text-[10px] text-muted">
              <span className="size-1.5 rounded-full bg-emerald-400" />
              متصل به ۵ سامانه · جست‌وجوی زبان طبیعی
            </div>
          </div>
        </div>
        <span className="hidden items-center gap-1 rounded-full border border-accent/20 bg-accent/5 px-2.5 py-1 text-[9px] text-accent sm:flex">
          <Sparkles size={10} /> نسخه دمو
        </span>
      </div>
      <ChatBody embedded />
    </div>
  );
}
