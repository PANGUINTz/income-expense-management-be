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
    "hee",
    "kuay",
  ];
  const regex = new RegExp(badWords.join("|"), "gi");

  return note.replace(regex, () => "*".repeat(3));
}
