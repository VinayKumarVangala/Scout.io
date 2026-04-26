import dns from 'dns';
import { promisify } from 'util';
import { DomainModel } from '../models/Domain.model';

const resolveTxt = promisify(dns.resolveTxt);

export class DomainService {
  private verificationPrefix = 'scout-io-verification=';

  public async verifyDomain(domain: string, clientId: string): Promise<boolean> {
    try {
      const records = await resolveTxt(domain);
      const flattenedRecords = records.flat();
      
      const verificationRecord = flattenedRecords.find(record => 
        record.startsWith(this.verificationPrefix)
      );

      if (!verificationRecord) return false;

      const expectedValue = `${this.verificationPrefix}${clientId}`;
      const isValid = verificationRecord === expectedValue;

      if (isValid) {
        await DomainModel.updateOne(
          { clientId, domain },
          { isActive: true },
          { upsert: true }
        );
      }

      return isValid;
    } catch (error) {
      console.error(`DNS Verification failed for ${domain}:`, error);
      return false;
    }
  }

  public async getVerificationToken(clientId: string): Promise<string> {
    return `${this.verificationPrefix}${clientId}`;
  }
}

export const domainService = new DomainService();
