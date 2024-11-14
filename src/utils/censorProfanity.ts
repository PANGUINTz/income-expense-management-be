export function censorProfanity(note: string): string {
  const badWords = [
    "สัส",
    "เหี้ย",
    "สวะ",
    "ควย",
    "หี",
    "เย็ด",
    "เยส",
    "แม่ง",
    "พ่อง",
    "fuck",
    "bitch",
    "กระหรี่",
    "กระโปก",
  ]; // Extend this list
  const regex = new RegExp(`\\b(${badWords.join("|")})\\b`, "gi");
  return note.replace(regex, "***");
}
