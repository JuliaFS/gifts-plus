"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoChatbubbleEllipses, IoClose, IoSend } from "react-icons/io5";
import { GiPresent } from "react-icons/gi";
import ProductCard from "@/components/ProductCard";
import { useGetProducts } from "@/app/products/hooks/useGetProducts";

type Message = {
  id: string;
  sender: "user" | "ai";
  text?: string;
  productIds?: string[];
};

export default function AiChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi there! 🎁 Need help finding the perfect gift?",
      sender: "ai",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  // 👇 Only fetch products if the chat is actually open to save initialization time
  const { data } = useGetProducts(isOpen ? 1 : 0); 
  const products = data?.data || [];

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsTyping(true);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:9090/api";
      const response = await fetch(`${baseUrl}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg.text,
          products,
        }),
      });

      const data = await response.json();

      const aiMsg: Message = {
        id: Date.now().toString(),
        sender: "ai",
        text: data.text,
        productIds: data.productIds,
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: "ai",
          text: "Something went wrong 😢",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none w-max h-max select-none">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="mb-4 w-[350px] max-w-[90vw] h-[500px] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden pointer-events-auto select-auto"
          >
            {/* Header */}
            <div className="bg-brand-green p-4 flex justify-between text-white">
              <div className="flex items-center gap-2">
                <GiPresent />
                <span>Gift Assistant</span>
              </div>
              <button onClick={() => setIsOpen(false)}>
                <IoClose size={22} />
              </button>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50"
            >
              {messages.map((msg) => (
                <div key={msg.id} className="space-y-2">
                  {/* TEXT */}
                  {msg.text && (
                    <div
                      className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${
                        msg.sender === "user"
                          ? "bg-purple-600 text-white ml-auto"
                          : "bg-white border"
                      }`}
                    >
                      {msg.text}
                    </div>
                  )}

                  {/* 🎁 PRODUCT CARDS */}
                  {msg.productIds && msg.productIds.length > 0 && (
                    <div className="flex gap-3 overflow-x-auto">
                      {msg.productIds.map((id) => {
                        const product = products.find(
                          (p) => String(p.id) === String(id)
                        );
                        if (!product) return null;

                        return (
                          <div key={id} className="min-w-[160px]">
                            <ProductCard product={product} />
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}

              {isTyping && <p className="text-sm text-gray-400">Typing...</p>}
            </div>

            {/* Input */}
            <div className="p-4 border-t flex gap-2">
              <input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="flex-1 border rounded px-2 py-1 text-black"
                placeholder="Ask for a gift..."
              />
              <button onClick={handleSend}>
                <IoSend />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-brand-green text-white p-4 rounded-full shadow-lg pointer-events-auto cursor-pointer select-auto"
      >
        {isOpen ? <IoClose /> : <IoChatbubbleEllipses />}
      </button>
    </div>
  );
}

// "use client";

// import { useState, useRef, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { IoChatbubbleEllipses, IoClose, IoSend } from "react-icons/io5";
// import { GiPresent } from "react-icons/gi";

// type Message = {
//   id: string;
//   text: string;
//   sender: "user" | "ai";
// };

// export default function AiChat() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [messages, setMessages] = useState<Message[]>([
//     { id: "1", text: "Hi there! 🎁 Need help finding the perfect gift?", sender: "ai" },
//   ]);
//   const [inputValue, setInputValue] = useState("");
//   const [isTyping, setIsTyping] = useState(false);
//   const scrollRef = useRef<HTMLDivElement>(null);

//   // Auto-scroll to latest message
//   useEffect(() => {
//     if (scrollRef.current) {
//       scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
//     }
//   }, [messages, isOpen]);

//   const handleSend = async () => {
//     if (!inputValue.trim()) return;

//     const userMsg: Message = { id: Date.now().toString(), text: inputValue, sender: "user" };
//     setMessages((prev) => [...prev, userMsg]);
//     setInputValue("");
//     setIsTyping(true);

//     try {
//       const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/chat`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ message: userMsg.text }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.details || data.error || "Failed to connect to AI");
//       }

//       const aiMsg: Message = {
//         id: Date.now().toString(),
//         text: data.reply,
//         sender: "ai",
//       };
//       setMessages((prev) => [...prev, aiMsg]);
//     } catch (error) {
//       console.error("Chat error:", error);
//       const errorMsg: Message = {
//         id: Date.now().toString(),
//         text: "I'm sorry, I'm having trouble connecting to the gift assistant right now. Please check your connection or try again later.",
//         sender: "ai",
//       };
//       setMessages((prev) => [...prev, errorMsg]);
//     } finally {
//       setIsTyping(false);
//     }
//   };

//   return (
//     <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
//       <AnimatePresence>
//         {isOpen && (
//           <motion.div
//             initial={{ opacity: 0, scale: 0.8, y: 20, transformOrigin: "bottom right" }}
//             animate={{ opacity: 1, scale: 1, y: 0 }}
//             exit={{ opacity: 0, scale: 0.8, y: 20 }}
//             className="mb-4 w-[350px] max-w-[90vw] h-[500px] bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden"
//           >
//             {/* Header */}
//             <div className="bg-brand-green p-4 flex items-center justify-between text-white">
//               <div className="flex items-center gap-2">
//                 <div className="bg-white/20 p-2 rounded-full">
//                   <GiPresent className="text-xl" />
//                 </div>
//                 <div>
//                   <h3 className="font-bold leading-none">Gift Assistant</h3>
//                   <span className="text-[10px] opacity-80 flex items-center gap-1">
//                     <span className="w-1.5 h-1.5 bg-green-300 rounded-full animate-pulse" /> Online
//                   </span>
//                 </div>
//               </div>
//               <button 
//                 onClick={() => setIsOpen(false)}
//                 className="hover:bg-white/20 p-1 rounded-full transition-colors"
//               >
//                 <IoClose size={24} />
//               </button>
//             </div>

//             {/* Messages Area */}
//             <div 
//               ref={scrollRef}
//               className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50/50 scrollbar-thin"
//             >
//               {messages.map((msg) => (
//                 <div
//                   key={msg.id}
//                   className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
//                 >
//                   <div
//                     className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm shadow-sm ${
//                       msg.sender === "user"
//                         ? "bg-purple-600 text-white rounded-tr-none"
//                         : "bg-white text-gray-800 border border-gray-100 rounded-tl-none"
//                     }`}
//                   >
//                     {msg.text}
//                   </div>
//                 </div>
//               ))}
//               {isTyping && (
//                 <div className="flex justify-start">
//                   <div className="bg-white border border-gray-100 px-4 py-2 rounded-2xl rounded-tl-none shadow-sm">
//                     <span className="flex gap-1">
//                       <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
//                       <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]" />
//                       <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]" />
//                     </span>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Input Area */}
//             <div className="p-4 bg-white border-t border-gray-100">
//               <div className="relative flex items-center">
//                 <input
//                   type="text"
//                   value={inputValue}
//                   onChange={(e) => setInputValue(e.target.value)}
//                   onKeyDown={(e) => e.key === "Enter" && handleSend()}
//                   placeholder="Ask a question..."
//                   className="w-full pl-4 pr-12 py-3 bg-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-green/50 transition-all text-black"
//                 />
//                 <button
//                   onClick={handleSend}
//                   className="absolute right-2 p-2 text-brand-green hover:scale-110 transition-transform cursor-pointer"
//                 >
//                   <IoSend size={20} />
//                 </button>
//               </div>
//               <p className="text-[10px] text-gray-400 text-center mt-2">
//                 Powered by Gifts Plus AI
//               </p>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Trigger Button */}
//       <motion.button
//         whileHover={{ scale: 1.05 }}
//         whileTap={{ scale: 0.95 }}
//         onClick={() => setIsOpen(!isOpen)}
//         className={`p-4 rounded-full shadow-2xl cursor-pointer transition-colors ${
//           isOpen ? "bg-gray-800 text-white" : "bg-brand-green text-white"
//         }`}
//       >
//         {isOpen ? <IoClose size={28} /> : <IoChatbubbleEllipses size={28} />}
        
//         {!isOpen && (
//           <span className="absolute -top-1 -right-1 flex h-4 w-4">
//             <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
//             <span className="relative inline-flex rounded-full h-4 w-4 bg-purple-500 border-2 border-white"></span>
//           </span>
//         )}
//       </motion.button>
//     </div>
//   );
// }