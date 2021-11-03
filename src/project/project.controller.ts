import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { Auth } from 'src/common/decorators/auth.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { Response, Role } from 'src/utils/types';
import { CreateProjectDto } from './dto/create-project.dto';
import { User as UserEntity } from '../user/entities/user.entity';
import { FilterDto } from './dto/filter.dto';
import { Project } from './entities/project.entity';
import { ProjectService } from './project.service';

@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getProjects(
    @Query() filterDto: FilterDto,
    @User() user: UserEntity,
  ): Promise<Response<Project[]>> {
    filterDto.page = Number(filterDto.page || 1);
    filterDto.limit = Number(filterDto.limit || 10);

    const result = await this.projectService.getProjects(user, filterDto);
    return {
      message: 'Get list projects successfully',
      error: false,
      data: result.projects,
      pagination: result.pagination,
    };
  }
  @Auth(Role.Admin)
  @Post()
  async createProject(
    @Body() project: CreateProjectDto,
  ): Promise<Response<Project>> {
    const data = await this.projectService.createProject(project);
    return {
      message: 'Create project successfully',
      error: false,
      data,
    };
  }
}