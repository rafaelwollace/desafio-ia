import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({ example: 'Sistema de Gestão Interna' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(120)
  name: string;

  @ApiProperty({ example: '2026-01-15' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: '2026-06-30' })
  @IsDateString()
  endDate: string;

  @ApiProperty({ example: 250000 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  budget: number;

  @ApiProperty({ example: 'Projeto para modernização dos processos internos.' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  description: string;
}
