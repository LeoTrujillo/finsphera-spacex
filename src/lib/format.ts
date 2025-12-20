const dateFormatter = new Intl.DateTimeFormat("en", {
  dateStyle: "medium",
  timeStyle: "short",
});

export function formatDate(date: string | number | Date) {
  return dateFormatter.format(new Date(date));
}

export function getName(value: unknown) {
  if (typeof value === "string") return value;
  if (
    value &&
    typeof value === "object" &&
    "name" in value &&
    typeof (value as { name?: unknown }).name === "string"
  ) {
    const name = (value as { name?: string }).name;
    return name && name.trim() ? name : "Unknown";
  }
  return "Unknown";
}
