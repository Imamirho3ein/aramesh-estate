import { faqs, properties } from "./data";
import type { ChatMessage, DealType, Property } from "./types";
import { categoryLabels, fa, normalizeText, toEnglishDigits } from "./utils";

interface AssistantReply {
  text: string;
  propertyIds?: string[];
  quickReplies?: string[];
}

const numberWords: Record<string, number> = {
  یک: 1,
  دو: 2,
  سه: 3,
  چهار: 4,
  پنج: 5,
  شش: 6,
};

const districtAliases: Record<string, string> = {
  زعفرانیه: "زعفرانیه",
  الهیه: "الهیه",
  نیاوران: "نیاوران",
  فرمانیه: "فرمانیه",
  سعادت: "سعادت‌آباد",
  "سعادت آباد": "سعادت‌آباد",
  "شهرک غرب": "شهرک غرب",
  پاسداران: "پاسداران",
  ونک: "ونک",
  جردن: "جردن",
  تجریش: "تجریش",
  ولنجک: "ولنجک",
  اکباتان: "اکباتان",
  لواسان: "لواسان",
};

function detectDeal(q: string): DealType | null {
  if (q.includes("رهن کامل")) return "mortgage";
  if (q.includes("اجاره") || q.includes("رهن") || q.includes("ودیعه") || q.includes("ماهانه"))
    return "rent";
  if (q.includes("خرید") || q.includes("فروش") || q.includes("بخرم")) return "sale";
  return null;
}

function detectDistrict(q: string): string | null {
  for (const [alias, name] of Object.entries(districtAliases)) {
    if (q.includes(alias)) return name;
  }
  return null;
}

function detectRooms(q: string): number | null {
  const digitMatch = q.match(/(\d+)\s*(?:خواب|اتاق|خوابه)/);
  if (digitMatch) return Number(digitMatch[1]);
  for (const [word, n] of Object.entries(numberWords)) {
    if (q.includes(`${word} خواب`) || q.includes(`${word} اتاق`)) return n;
  }
  return null;
}

function detectArea(q: string): number | null {
  const m = q.match(/(\d+)\s*(?:متر|متری|مترمربع)/);
  if (m) return Number(m[1]);
  return null;
}

function detectBudget(q: string): { amount: number; unit: string } | null {
  const billion = q.match(/(\d+(?:[.,]\d+)?)\s*(?:میلیارد|ملیارد)/);
  if (billion) {
    return { amount: Number(billion[1].replace(",", ".")) * 1_000_000_000, unit: "میلیارد" };
  }
  const million = q.match(/(\d+(?:[.,]\d+)?)\s*(?:میلیون)/);
  if (million) {
    return { amount: Number(million[1].replace(",", ".")) * 1_000_000, unit: "میلیون" };
  }
  return null;
}

function detectCategory(q: string): Property["category"] | null {
  if (q.includes("پنت") || q.includes("پنتهاوس")) return "penthouse";
  if (q.includes("ویلا") || q.includes("ویلایی")) return "villa";
  if (q.includes("دفتر") || q.includes("اداری")) return "office";
  if (q.includes("دوبلکس")) return "duplex";
  if (q.includes("استودیو")) return "studio";
  if (q.includes("آپارتمان") || q.includes("اپارتمان")) return "apartment";
  return null;
}

function detectAmenity(q: string): string | null {
  if (q.includes("استخر")) return "استخر";
  if (q.includes("پارکینگ")) return "پارکینگ";
  if (q.includes("سونا")) return "سونا";
  if (q.includes("ویو") || q.includes("منظره")) return "ویو";
  if (q.includes("هوشمند")) return "سیستم هوشمند";
  return null;
}

function amountOf(p: Property): number {
  return p.dealType === "sale" ? p.price : p.deposit ?? 0;
}

function matchProperties(query: string): {
  matches: Property[];
  usedFilters: string[];
  budget: number | null;
  deal: DealType | null;
  relaxed: boolean;
} {
  const q = normalizeText(query);
  let deal = detectDeal(q);
  const district = detectDistrict(q);
  const rooms = detectRooms(q);
  const area = detectArea(q);
  const budget = detectBudget(q);
  const category = detectCategory(q);
  const amenity = detectAmenity(q);

  if (!deal && budget) deal = "sale";

  const usedFilters: string[] = [];
  if (deal) usedFilters.push(deal === "sale" ? "فروش" : deal === "rent" ? "رهن و اجاره" : "رهن کامل");
  if (district) usedFilters.push(district);
  if (rooms) usedFilters.push(`${fa(rooms)} خواب`);
  if (area) usedFilters.push(`حدود ${fa(area)} متر`);
  if (budget)
    usedFilters.push(
      `بودجه تا ${
        budget.amount >= 1e9
          ? `${fa(budget.amount / 1e9)} میلیارد`
          : `${fa(budget.amount / 1e6)} میلیون`
      }`,
    );
  if (category) usedFilters.push(categoryLabels[category]);
  if (amenity) usedFilters.push(amenity);

  const base = properties.filter((p) => p.status === "active" || p.status === "pending");
  const monthlyBudget =
    (deal === "rent" || q.includes("اجاره") || q.includes("ماهانه")) &&
    budget !== null &&
    budget.amount < 1_000_000_000;

  let list = base.filter((p) => !deal || p.dealType === deal);
  if (district) list = list.filter((p) => p.district === district);
  if (category) list = list.filter((p) => p.category === category);
  if (rooms) list = list.filter((p) => p.rooms >= rooms);
  if (area) list = list.filter((p) => p.area >= area * 0.75 && p.area <= area * 1.3);
  if (amenity) list = list.filter((p) => p.amenities.some((a) => a.includes(amenity)));
  if (budget) {
    list = list.filter((p) => {
      if (monthlyBudget) return (p.monthly ?? 0) <= budget.amount * 1.1;
      return amountOf(p) <= budget.amount * 1.05;
    });
  }

  if (list.length) {
    return {
      matches: list.slice(0, 4),
      usedFilters,
      budget: budget?.amount ?? null,
      deal,
      relaxed: false,
    };
  }

  // No exact match: score the closest options and be transparent about the relaxation.
  const candidates = base.filter((p) => !deal || p.dealType === deal);
  const scored = candidates
    .map((p) => {
      let score = 0;
      if (district && p.district === district) score += 45;
      if (category && p.category === category) score += 35;
      if (area) score += Math.max(0, 20 - Math.abs(p.area - area) / 8);
      if (rooms) score += Math.max(0, 10 - Math.abs(p.rooms - rooms) * 4);
      if (amenity && p.amenities.some((a) => a.includes(amenity))) score += 10;
      if (budget) {
        if (monthlyBudget) {
          const ratio = (p.monthly ?? 0) / budget.amount;
          score += ratio <= 1.1 ? 30 : Math.max(0, 30 - (ratio - 1.1) * 20);
        } else {
          const ratio = amountOf(p) / budget.amount;
          score += ratio <= 1.05 ? 35 : Math.max(0, 35 - (ratio - 1.05) * 25);
        }
      }
      return { p, score };
    })
    .sort((a, b) => b.score - a.score);

  return {
    matches: scored.slice(0, 3).map((x) => x.p),
    usedFilters,
    budget: budget?.amount ?? null,
    deal,
    relaxed: true,
  };
}

function faPrice(p: Property): string {
  if (p.dealType === "sale") {
    const b = p.price / 1_000_000_000;
    return `${b.toLocaleString("fa-IR", { maximumFractionDigits: 1 })} میلیارد تومان`;
  }
  const d = (p.deposit ?? 0) / 1_000_000_000;
  if (p.dealType === "mortgage") return `رهن کامل ${d.toLocaleString("fa-IR", { maximumFractionDigits: 1 })} میلیارد`;
  return `ودیعه ${d.toLocaleString("fa-IR", { maximumFractionDigits: 1 })} میلیارد و اجاره ${(p.monthly ?? 0).toLocaleString("fa-IR")} میلیون`;
}

export function assistantReply(query: string): AssistantReply {
  const q = normalizeText(query);

  if (!q) {
    return { text: "سوال یا درخواستت را بنویس؛ مثلاً «آپارتمان ۱۵۰ متری در زعفرانیه تا ۳۰ میلیارد»." };
  }

  if (/(سلام|درود|وقت بخیر|hi|hello)/.test(q)) {
    return {
      text: "سلام! من دستیار هوشمند آرامش هستم. 🏡\nمی‌تونم بر اساس بودجه، منطقه، متراژ و تعداد خواب برات ملک پیدا کنم، چند ملک رو مقایسه کنم یا درباره‌ی رهن و اجاره راهنماییت کنم.",
      quickReplies: [
        "پنت‌هاوس زیر ۴۰ میلیارد",
        "آپارتمان ۱۵۰ متری زعفرانیه",
        "اجاره در فرمانیه",
        "راهنمای خرید",
      ],
    };
  }

  if (/(ممنون|مرسی|تشکر|دمت گرم)/.test(q)) {
    return {
      text: "خواهش می‌کنم! اگر خواستی فایل‌های بیشتری ببینی یا بازدیدی هماهنگ کنی، همین‌جا بگو. 😊",
      quickReplies: ["تور ۳۶۰ دارد؟", "مقایسه املاک", "تماس با مشاور"],
    };
  }

  if (q.includes("راهنما") || q.includes("چطور") || q.includes("چگونه") || q.includes("سوال")) {
    return {
      text: "خیلی ساده! فقط خواسته‌ات را بنویس:\n• «آپارتمان ۱۲۰ متری در سعادت‌آباد زیر ۱۵ میلیارد»\n• «ویلا با استخر در لواسان»\n• «اجاره سه خواب در پاسداران تا ۶۰ میلیون»\nمن فایل‌های مناسب را پیدا می‌کنم و اگر بخواهی، مقایسه‌شان می‌کنم.",
      quickReplies: ["آپارتمان ۱۲۰ متری سعادت‌آباد", "ویلا با استخر", "اجاره سه خواب پاسداران"],
    };
  }

  if (q.includes("تماس") || q.includes("مشاور") || q.includes("شماره")) {
    return {
      text: "برای ارتباط مستقیم با مشاور، از صفحه‌ی هر ملک روی «درخواست بازدید» بزن یا با شماره‌ی ۰۲۱ ۲۲۴۴ ۸۸۹۰ تماس بگیر. اگر بخواهی، همین حالا یک درخواست برایت ثبت می‌کنم.",
      quickReplies: ["درخواست بازدید", "پنت‌هاوس زعفرانیه", "اجاره فرمانیه"],
    };
  }

  const asksQuestion = /(چطور|چگونه|چیست|چیه|آیا|شرایط|چقدر|\?|؟)/.test(q);
  const faq = asksQuestion
    ? faqs.find((item) => {
        const key = normalizeText(item.q);
        const words = key.split(/\s+/).filter((w) => w.length > 3);
        return words.some((w) => q.includes(w));
      })
    : undefined;
  if (faq) {
    return { text: `${faq.q}\n${faq.a}`, quickReplies: ["فایل رهن کامل", "راهنمای خرید", "تماس با مشاور"] };
  }

  const { matches, usedFilters, relaxed } = matchProperties(query);

  if (!matches.length) {
    return {
      text: "با این فیلترها فایلی پیدا نکردم. می‌تونی بودجه یا منطقه رو کمی بازتر کنی؛ چند فایل پیشنهادی دارم:",
      propertyIds: properties.slice(0, 3).map((p) => p.id),
      quickReplies: ["فقط آپارتمان", "تا ۲۰ میلیارد", "منطقه زعفرانیه"],
    };
  }

  const filterText = usedFilters.length ? `برای ${usedFilters.join("، ")}` : "بر اساس درخواستت";
  const top = matches[0];
  const intro = relaxed
    ? `با این فیلترها فایل دقیقاً مطابقی پیدا نکردم؛ ${fa(matches.length)} گزینه‌ی نزدیک را برایت آوردم.`
    : `${filterText} ${fa(matches.length)} فایل مناسب پیدا کردم.`;
  const outro = relaxed
    ? "اگر بخواهی، فیلترها را دقیق‌تر می‌کنم یا گزینه‌های منطقه‌ی دیگری را نشان می‌دهم."
    : "می‌خواهی همین‌ها را با هم مقایسه کنم یا جزئیات بیشتری ببینی؟";
  return {
    text: `${intro} پیشنهاد اولم «${top.title}» در ${top.district} با ${fa(top.area)} متر و ${faPrice(top)} است.\n${outro}`,
    propertyIds: matches.map((p) => p.id),
    quickReplies: ["مقایسه کن", "فقط با پارکینگ", "تور ۳۶۰ دارد؟", "درخواست بازدید"],
  };
}

export function initialAssistantMessage(): ChatMessage {
  return {
    id: "assistant-welcome",
    role: "assistant",
    text: "سلام! من دستیار هوشمند آرامش هستم. 🏡\nبگو دنبال چه خانه‌ای هستی؛ بودجه، منطقه و متراژ را می‌فهمم و بهترین فایل‌ها را پیدا می‌کنم.",
    quickReplies: [
      "پنت‌هاوس زیر ۴۰ میلیارد",
      "آپارتمان ۱۵۰ متری زعفرانیه",
      "ویلا با استخر",
      "اجاره در فرمانیه",
    ],
  };
}

export { toEnglishDigits };
