export interface AdminNumber {
  id: string;
  number: string;
  label: string;
  isDefault: boolean;
}

export interface SmsBalance {
  credits: number;
  packageName: string;
}

const NUMBERS_KEY = "sms_admin_numbers";
const BALANCE_KEY = "sms_balance";

const defaultNumbers: AdminNumber[] = [
  { id: "1", number: "+1234567890", label: "Main Line", isDefault: true },
];

const defaultBalance: SmsBalance = {
  credits: 100,
  packageName: "Starter Pack",
};

export const smsStore = {
  getAdminNumbers(): AdminNumber[] {
    try {
      const stored = localStorage.getItem(NUMBERS_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
    return defaultNumbers;
  },

  saveAdminNumbers(numbers: AdminNumber[]): void {
    localStorage.setItem(NUMBERS_KEY, JSON.stringify(numbers));
  },

  getBalance(): SmsBalance {
    try {
      const stored = localStorage.getItem(BALANCE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
    return defaultBalance;
  },

  saveBalance(balance: SmsBalance): void {
    localStorage.setItem(BALANCE_KEY, JSON.stringify(balance));
  },

  deductCredits(count: number): SmsBalance {
    const balance = this.getBalance();
    balance.credits = Math.max(0, balance.credits - count);
    this.saveBalance(balance);
    return balance;
  },

  addCredits(count: number, packageName?: string): SmsBalance {
    const balance = this.getBalance();
    balance.credits += count;
    if (packageName) balance.packageName = packageName;
    this.saveBalance(balance);
    return balance;
  },
};
