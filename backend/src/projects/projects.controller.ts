import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AiAnalysisResponseDto } from '../ai/dto/ai-analysis-response.dto';
import { AiAnalysisService } from '../ai/ai-analysis.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectResponseDto } from './dto/project-response.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { ProjectsService } from './projects.service';

@ApiTags('projects')
@Controller('projects')
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly aiAnalysisService: AiAnalysisService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Criar novo projeto' })
  @ApiResponse({ status: 201, type: ProjectResponseDto })
  create(@Body() dto: CreateProjectDto): ProjectResponseDto {
    return this.projectsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os projetos' })
  @ApiResponse({ status: 200, type: [ProjectResponseDto] })
  findAll(): ProjectResponseDto[] {
    return this.projectsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar projeto por ID' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, type: ProjectResponseDto })
  findOne(@Param('id', ParseUUIDPipe) id: string): ProjectResponseDto {
    return this.projectsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar projeto' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, type: ProjectResponseDto })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateProjectDto,
  ): ProjectResponseDto {
    return this.projectsService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover projeto' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 204 })
  remove(@Param('id', ParseUUIDPipe) id: string): void {
    this.projectsService.remove(id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Alterar status do projeto' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, type: ProjectResponseDto })
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateStatusDto,
  ): ProjectResponseDto {
    return this.projectsService.updateStatus(id, dto.status);
  }

  @Get(':id/ai-analysis')
  @ApiOperation({ summary: 'Gerar análise inteligente do projeto' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, type: AiAnalysisResponseDto })
  getAiAnalysis(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<AiAnalysisResponseDto> {
    const project = this.projectsService.getProjectEntity(id);
    return this.aiAnalysisService.analyze(project);
  }
}
