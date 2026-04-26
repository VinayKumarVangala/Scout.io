export class IpFilterService {
  private blacklist: Set<string> = new Set();
  private whitelist: Set<string> = new Set();

  public isAllowed(ip: string): boolean {
    if (this.blacklist.has(ip)) return false;
    if (this.whitelist.size > 0 && !this.whitelist.has(ip)) return false;
    return true;
  }

  public addToBlacklist(ip: string) {
    this.blacklist.add(ip);
  }

  public removeFromBlacklist(ip: string) {
    this.blacklist.delete(ip);
  }
}

export const ipFilterService = new IpFilterService();
