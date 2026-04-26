import mongoose from 'mongoose';

export interface Migration {
  version: number;
  description: string;
  up: () => Promise<void>;
  down: () => Promise<void>;
}

const MigrationSchema = new mongoose.Schema({
  version: { type: Number, required: true, unique: true },
  description: { type: String, required: true },
  appliedAt: { type: Date, default: Date.now },
});

const MigrationModel = mongoose.model('Migration', MigrationSchema);

export class MigrationService {
  private migrations: Migration[] = [];

  public register(migration: Migration) {
    this.migrations.push(migration);
  }

  public async run() {
    console.log('🔄 Checking for pending migrations...');
    const appliedMigrations = await MigrationModel.find().sort({ version: 1 });
    const lastVersion = appliedMigrations.length > 0 ? appliedMigrations[appliedMigrations.length - 1].version : 0;

    const pending = this.migrations
      .filter((m) => m.version > lastVersion)
      .sort((a, b) => a.version - b.version);

    if (pending.length === 0) {
      console.log('✅ Database is up to date.');
      return;
    }

    for (const migration of pending) {
      console.log(`🚀 Applying migration v${migration.version}: ${migration.description}`);
      try {
        await migration.up();
        await MigrationModel.create({
          version: migration.version,
          description: migration.description,
        });
        console.log(`✅ Applied v${migration.version}`);
      } catch (error) {
        console.error(`❌ Migration v${migration.version} failed:`, error);
        throw error;
      }
    }
  }
}

export const migrationService = new MigrationService();
