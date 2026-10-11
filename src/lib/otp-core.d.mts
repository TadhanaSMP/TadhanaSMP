export function validDiscordId(value: unknown): value is string;
export function validOTP(value: unknown): value is string;
export function generateCode(): string;
export function hashValue(value: string, secret: string): string;
export function opaqueToken(): string;
export function safeEqual(a: unknown, b: unknown): boolean;
type UpdateArgs = {
  where: {
    codeHash: string;
    discordId: string;
    used: false;
    expiresAt: { gt: Date };
  };
  data: { used: true; usedAt: Date };
};
export function redeemWith(
  repository: { updateMany(args: UpdateArgs): Promise<{ count: number }> },
  input: { otp: unknown; discordUserId: unknown; secret: string; now?: Date },
): Promise<boolean>;
