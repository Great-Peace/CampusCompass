import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { SpotsService } from './spots.service';
import { CreateSpotDto } from './dto/create-spot.dto';
import { CommentSpotDto } from './dto/comment-spot.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { SpotCategory } from '../../database/entities/spot.entity';

@ApiTags('Spots')
@Controller('spots')
export class SpotsController {
  constructor(private readonly spotsService: SpotsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all spots' })
  @ApiResponse({ status: 200, description: 'Spots retrieved' })
  async findAll(@Query('category') category?: SpotCategory) {
    const spots = await this.spotsService.findAll(category);
    return { data: spots };
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get spot by ID' })
  @ApiResponse({ status: 200, description: 'Spot found' })
  @ApiResponse({ status: 404, description: 'Spot not found' })
  async findOne(@Param('id') id: string) {
    const spot = await this.spotsService.findById(id);
    return { data: spot };
  }

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new spot' })
  @ApiResponse({ status: 201, description: 'Spot created' })
  async create(
    @CurrentUser('id') userId: string,
    @Body() createSpotDto: CreateSpotDto,
  ) {
    const spot = await this.spotsService.create(userId, createSpotDto);
    return { data: spot };
  }

  @Put(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update spot' })
  @ApiResponse({ status: 200, description: 'Spot updated' })
  async update(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body() updateData: Partial<CreateSpotDto>,
  ) {
    const spot = await this.spotsService.update(id, userId, updateData);
    return { data: spot };
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete spot' })
  @ApiResponse({ status: 200, description: 'Spot deleted' })
  async delete(@Param('id') id: string, @CurrentUser('id') userId: string) {
    await this.spotsService.delete(id, userId);
    return { message: 'Spot deleted successfully' };
  }

  @Post(':id/react')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Like/unlike a spot' })
  @ApiResponse({ status: 200, description: 'Reaction toggled' })
  async toggleReaction(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ) {
    const result = await this.spotsService.toggleReaction(id, userId);
    return { data: result };
  }

  @Get(':id/comments')
  @Public()
  @ApiOperation({ summary: 'Get spot comments' })
  @ApiResponse({ status: 200, description: 'Comments retrieved' })
  async getComments(@Param('id') id: string) {
    const comments = await this.spotsService.getComments(id);
    return { data: comments };
  }

  @Post(':id/comments')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add comment to spot' })
  @ApiResponse({ status: 201, description: 'Comment added' })
  async addComment(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body() commentDto: CommentSpotDto,
  ) {
    const comment = await this.spotsService.addComment(id, userId, commentDto);
    return { data: comment };
  }
}