"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { openWhatsApp } from "@/lib/openWhatsApp";

const DEFAULT_MESSAGE =
  "Hi, I found your number on BulkCTC and I would like to enquire about bulk CTC tea.";

// ─── swap this path to change the avatar image ────────────────────────────────
const AVATAR_SRC = "/arjun.png";
// ──────────────────────────────────────────────────────────────────────────────

export function WhatsappWidget() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState(DEFAULT_MESSAGE);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // ── Focus textarea when panel opens ──────────────────────────────────────
  useEffect(() => {
    if (open && textareaRef.current) {
      const el = textareaRef.current;
      el.focus();
      el.selectionStart = el.selectionEnd = el.value.length;
    }
  }, [open]);

  function handleSend() {
    openWhatsApp(message);
    setOpen(false);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Chat panel — full screen on mobile, floating panel on md+ */}
      {open && (
        <>
          {/* Mobile backdrop */}
          <div
            className="fixed inset-0 bg-black/40 md:hidden"
            onClick={() => setOpen(false)}
          />

          <div className="
            fixed inset-0 flex flex-col bg-white
            md:static md:inset-auto md:w-96 md:rounded-2xl md:shadow-2xl md:overflow-hidden md:border md:border-neutral-200
            animate-in fade-in slide-in-from-bottom-4 duration-200 z-10
          ">
            {/* Header */}
            <div className="bg-green-600 px-4 py-3 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                {/* Avatar — swap AVATAR_SRC above to change the image */}
                <div className="w-11 h-11 rounded-full overflow-hidden shrink-0 ring-2 ring-white/30">
                  <Image
                    src={AVATAR_SRC}
                    alt="Arjun Aditya"
                    width={44}
                    height={44}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div>
                  <p className="text-white text-sm font-semibold leading-tight">
                    Arjun Aditya
                  </p>
                  <p className="text-green-100 text-[11px] leading-tight">
                    Founder of Gray Cup
                  </p>
                  <p className="text-green-200 text-[11px] mt-0.5 leading-tight">
                    +91 85279 14317
                  </p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-white/70 hover:text-white transition-colors p-1 shrink-0"
                aria-label="Close"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Input — grows to fill remaining space on mobile */}
            <div className="flex-1 md:flex-none p-3 bg-[#f0f0f0] flex items-end gap-2">
              <textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 h-full md:h-72 resize-none rounded-xl bg-white px-3 py-2 text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none border-none shadow-sm"
                placeholder="Type a message…"
              />
              <button
                onClick={handleSend}
                disabled={!message.trim()}
                className="w-10 h-10 rounded-full bg-green-600 hover:bg-green-700 disabled:opacity-40 flex items-center justify-center shrink-0 transition-colors self-end"
                aria-label="Send on WhatsApp"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              </button>
            </div>
          </div>
        </>
      )}

      {/* FAB */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-14 h-14 rounded-full flex items-center justify-center bg-transparent p-0"
        aria-label="Chat on WhatsApp"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="56"
          height="56"
          fill="none"
          viewBox="0 0 500 500"
          className="cursor-pointer transition-[filter] hover:drop-shadow-xl"
        >
          <rect width="500" height="500" fill="#05aa6c" rx="250" />
          <path
            fill="#fff"
            d="m182.852 352.548 4.537 2.688c19.057 11.31 40.908 17.293 63.191 17.303h.046c68.43 0 124.121-55.679 124.149-124.113.013-33.162-12.889-64.347-36.329-87.805a123.33 123.33 0 0 0-87.771-36.397c-68.483 0-124.176 55.673-124.2 124.103a123.8 123.8 0 0 0 18.98 66.051l2.954 4.693-12.545 45.796zM100 400.346l21.193-77.377c-13.07-22.644-19.946-48.333-19.938-74.652C101.289 165.982 168.292 99 250.628 99c39.956.02 77.458 15.569 105.663 43.794S400.014 208.536 400 248.437c-.037 82.328-67.049 149.323-149.374 149.323h-.065c-24.997-.011-49.559-6.282-71.377-18.178z"
          />
          <path
            fill="#fff"
            fillRule="evenodd"
            d="M211.762 184.357c-2.798-6.214-5.741-6.34-8.399-6.447l-7.154-.088c-2.489 0-6.533.934-9.952 4.67s-13.064 12.763-13.064 31.126c0 18.362 13.375 36.106 15.239 38.599 1.863 2.493 25.819 41.376 63.756 56.336 31.526 12.433 37.941 9.96 44.787 9.339s22.082-9.028 25.19-17.744 3.11-16.182 2.178-17.743-3.42-2.489-7.156-4.357c-3.735-1.867-22.082-10.895-25.502-12.142-3.421-1.246-5.908-1.866-8.399 1.87-2.491 3.735-9.635 12.138-11.814 14.629-2.178 2.491-4.352 2.804-8.088.938s-15.753-5.808-30.013-18.523c-11.095-9.893-18.584-22.11-20.764-25.844-2.181-3.733-.232-5.755 1.64-7.615 1.675-1.673 3.731-4.359 5.601-6.537s2.485-3.735 3.727-6.222c1.243-2.487.624-4.672-.31-6.537s-8.186-20.326-11.503-27.708"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
}
