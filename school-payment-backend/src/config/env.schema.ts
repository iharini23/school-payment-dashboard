import { plainToInstance } from 'class-transformer';
import { IsBooleanString, IsNotEmpty, IsOptional, IsString, validateSync } from 'class-validator';

type EnvConfig = Record<string, unknown>;

class EnvironmentVariables {
  @IsString()
  @IsNotEmpty()
  MONGO_URI!: string;

  @IsString()
  @IsNotEmpty()
  JWT_SECRET!: string;

  @IsString()
  @IsNotEmpty()
  JWT_EXPIRY!: string;

  @IsString()
  @IsNotEmpty()
  PG_KEY!: string;

  @IsString()
  @IsNotEmpty()
  PG_API_KEY!: string;

  @IsString()
  @IsNotEmpty()
  PG_API_URL!: string;

  @IsString()
  @IsNotEmpty()
  SCHOOL_ID!: string;

  @IsOptional()
  @IsBooleanString()
  USE_IN_MEMORY_DB?: string;

  @IsOptional()
  @IsBooleanString()
  USE_DEMO_DATA?: string;
}

export function validateEnv(config: EnvConfig) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: false,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
}
