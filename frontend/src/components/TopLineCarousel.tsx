"use client";

const text = "Безплатна доставка над 120 € / 234.69 лв.";

export default function TopLineCarousel() {
  return (
    <div className="w-full overflow-hidden p-2 bg-black text-white">
      <div className="relative">
        <div className="flex w-max animate-marquee">
          {/* First copy */}
          <div className="flex whitespace-nowrap">
            {Array.from({ length: 10 }).map((_, i) => (
              <span
                key={`a-${i}`}
                className="mx-10 text-sm font-medium"
              >
                {text}
              </span>
            ))}
          </div>

          {/* Second copy (IDENTICAL) */}
          <div className="flex whitespace-nowrap">
            {Array.from({ length: 10 }).map((_, i) => (
              <span
                key={`b-${i}`}
                className="mx-10 text-sm font-medium"
              >
                {text}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// "use client";

// export default function TopLineCarousel() {
//   return (
//     <div className="w-full bg-black text-white overflow-hidden">
//       <div className="relative flex">
//         {/* Animated line */}
//         <div className="flex whitespace-nowrap animate-marquee py-2">
//           <span className="mx-8 text-sm font-medium">
//             Безплатна доставка над 120 € / 234.69 лв.
//           </span>
//           <span className="mx-8 text-sm font-medium">
//             Безплатна доставка над 120 € / 234.69 лв.
//           </span>
//           <span className="mx-8 text-sm font-medium">
//             Безплатна доставка над 120 € / 234.69 лв.
//           </span>
//           <span className="mx-8 text-sm font-medium">
//             Безплатна доставка над 120 € / 234.69 лв.
//           </span>
//           <span className="mx-8 text-sm font-medium">
//             Безплатна доставка над 120 € / 234.69 лв.
//           </span>
//                     <span className="mx-8 text-sm font-medium">
//             Безплатна доставка над 120 € / 234.69 лв.
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// }
