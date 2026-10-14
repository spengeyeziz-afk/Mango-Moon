import type { AvatarId } from "@/game/types"

export type HairStyle = "crop" | "fade" | "locks" | "afro" | "bun" | "waves" | "long" | "bob"

export type Look = {
  id: string
  name: string
  role: string
  line: string
  skin: string
  hair: string
  hairStyle: HairStyle
  shirt: string
  beard?: boolean
  feminine?: boolean
  band?: boolean
}

export const PLAYERS: (Look & { id: AvatarId })[] = [
  { id: "kian", name: "Kian", role: "Keeper", line: "Short crop, linen, and a steady walk between the beds.", skin: "#6a4032", hair: "#1a120e", hairStyle: "crop", shirt: "#0f6e6a" },
  { id: "malik", name: "Malik", role: "Keeper", line: "A full beard and a faded cut. He knows the morning round.", skin: "#4a2c22", hair: "#140e0c", hairStyle: "fade", shirt: "#1c3a34", beard: true },
  { id: "zion", name: "Zion", role: "Keeper", line: "Locks, a quiet band, and time for the long jobs.", skin: "#5c382c", hair: "#24160f", hairStyle: "locks", shirt: "#8a5a12", beard: true, band: true },
  { id: "andre", name: "André", role: "Keeper", line: "Mixed-race, sun on his shoulders, easy in the orchard.", skin: "#c48a62", hair: "#3a2418", hairStyle: "waves", shirt: "#a33b32" },
  { id: "owen", name: "Owen", role: "Keeper", line: "Fair and sun-browned. He came for a season and stayed.", skin: "#f0c8a4", hair: "#6b3e28", hairStyle: "crop", shirt: "#3d6b8a" },
  { id: "nia", name: "Nia", role: "Keeper", line: "A full natural crown and a sharp eye for ripe mango.", skin: "#5a3428", hair: "#1a120e", hairStyle: "afro", shirt: "#c45c3a", feminine: true },
  { id: "irie", name: "Irie", role: "Keeper", line: "Locks past her shoulders and no patience for a rushed bottle.", skin: "#6b4032", hair: "#2a1a12", hairStyle: "locks", shirt: "#c47a3a", feminine: true, band: true },
  { id: "sasha", name: "Sasha", role: "Keeper", line: "Mixed-race, hair in a bun, flour or soil either day.", skin: "#e0b08a", hair: "#4a2c22", hairStyle: "bun", shirt: "#0f6e6a", feminine: true },
  { id: "claire", name: "Claire", role: "Keeper", line: "Fair, long hair, and a notebook for the cellar marks.", skin: "#f6d2b4", hair: "#8a5030", hairStyle: "long", shirt: "#8a5a6a", feminine: true },
  { id: "priya", name: "Priya", role: "Keeper", line: "Indo-Jamaican, a bob, and a gift for the sweet end of the menu.", skin: "#d09a6a", hair: "#2a1c14", hairStyle: "bob", shirt: "#a33b32", feminine: true },
  { id: "rohan", name: "Rohan", role: "Keeper", line: "Indo-Jamaican, neat waves, happiest when the grill is lit.", skin: "#c4845c", hair: "#1c140e", hairStyle: "waves", shirt: "#1c3a34" },
]

export const GUESTS: Look[] = [
  { id: "imani", name: "Imani Holt", role: "Mail boat", line: "She runs the morning boat and still looks like the poster.", skin: "#4e2e24", hair: "#140e0c", hairStyle: "long", shirt: "#c47a3a", feminine: true },
  { id: "ellis", name: "Ellis Reid", role: "Off-island baker", line: "Mixed-race, a short beard, always bargaining for fruit.", skin: "#b87a52", hair: "#2c1a12", hairStyle: "waves", shirt: "#f3e2c4", beard: true },
  { id: "june", name: "June Palmer", role: "Regular", line: "A tapered natural, gold in the light, and a cold drink order.", skin: "#5c3428", hair: "#1a120e", hairStyle: "bob", shirt: "#0f6e6a", feminine: true },
  { id: "aya", name: "Aya Bennett", role: "Harbour guest", line: "Mixed-race, hair up, and a plate if the grill is awake.", skin: "#e0b090", hair: "#3a2418", hairStyle: "bun", shirt: "#a33b32", feminine: true },
  { id: "liang", name: "Mr. Liang", role: "Wine buyer", line: "Neat, patient, and only interested once a bottle has rested.", skin: "#f0d0b4", hair: "#1a120e", hairStyle: "fade", shirt: "#243044" },
  { id: "lenny", name: "Lenny Parks", role: "Beach jerk", line: "Locks tied back, a mustard shirt, and a pan that never quite cools.", skin: "#5a3428", hair: "#24160f", hairStyle: "locks", shirt: "#e2a04a", beard: true, band: true },
  { id: "keisha", name: "Keisha Grant", role: "Beach order", line: "She waits under the umbrella and pays well for a proper plate.", skin: "#6a4032", hair: "#1c120e", hairStyle: "waves", shirt: "#c4473a", feminine: true },
]

export function playerLook(id: AvatarId): Look {
  return PLAYERS.find((p) => p.id === id) ?? PLAYERS[0]
}

export function guestLook(name: string): Look | undefined {
  return GUESTS.find((g) => g.name === name)
}
