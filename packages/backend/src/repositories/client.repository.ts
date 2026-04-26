import { ClientModel, ClientDocument } from '../models/Client.model';
import { ClientRegistration } from '@scout-io/shared'; // I should check if I added this type

export class ClientRepository {
  async create(data: any): Promise<ClientDocument> {
    const client = new ClientModel(data);
    return await client.save();
  }

  async findById(id: string): Promise<ClientDocument | null> {
    return await ClientModel.findById(id);
  }

  async findByDomain(domain: string): Promise<ClientDocument | null> {
    return await ClientModel.findOne({ domains: domain });
  }

  async update(id: string, data: any): Promise<ClientDocument | null> {
    return await ClientModel.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string): Promise<boolean> {
    const result = await ClientModel.findByIdAndDelete(id);
    return !!result;
  }
}

export const clientRepository = new ClientRepository();
