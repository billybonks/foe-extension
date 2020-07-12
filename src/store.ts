import MemorySource from '@orbit/memory';
import { RecordNotFoundException } from '@orbit/data'

export default class Store {
  memory: MemorySource;

  constructor(memory: MemorySource){
    this.memory = memory;
  }

  async where(type: string, query:{attribute: any, value: string } ) {
    return this.memory.query(q => q.findRecords(type).filter(query));
  }
  //{id: any, type: string, attributes:any, relationships:any} how to do any or null
  async findOrCreate(payload: any) {
    performance.mark(`start findOrCreate ${payload.id} ${payload.type}`);
    let record;
    try {
      record = await this.memory.query(q => q.findRecord({ type: payload.type, id: payload.id }));
    } catch(error) {
      debugger
      if(error instanceof RecordNotFoundException){
        return record = await this.memory.update(t => [
          t.addRecord(payload),
        ]);
      }
      throw error;
    }
    performance.mark(`stop findOrCreate ${payload.id} ${payload.type}`);
    performance.measure(`measure time findOrCreate ${payload.id} ${payload.type}`, `start findOrCreate ${payload.id} ${payload.type}`, `stop findOrCreate ${payload.id} ${payload.type}`);
    return record;
  }

  insert(payload: {id: any, type: string, attributes:any, relationships:any}){
    return this.memory.update(t => [
      t.addRecord(payload),
    ]);
  }

  update(payload: {id: any, type: string, attributes:any, relationships:any}){
    return this.memory.update(t =>
      t.updateRecord(payload)
    );
  }
  //{id: any, type: string, attributes:any, relationships:any} how to do any or null
  async upsert(payload: {id: any, type: string, attributes:any, relationships:any}) {
    performance.mark(`start upsert ${payload.id} ${payload.type}`);
    let record;
    try {
      record = await this.memory.query(q => q.findRecord({ type: payload.type, id: payload.id }));
      await this.memory.update(t =>
        t.updateRecord(payload)
      );
    } catch(error) {
      if(error instanceof RecordNotFoundException){
        return record = await this.memory.update(t => [
          t.addRecord(payload),
        ]);
      }
      throw error;
    }
    performance.mark(`stop upsert ${payload.id} ${payload.type}`);
    performance.measure(`measure time upsert ${payload.id} ${payload.type}`, `start upsert ${payload.id} ${payload.type}`, `stop upsert ${payload.id} ${payload.type}`);
    return record;
  }
}
