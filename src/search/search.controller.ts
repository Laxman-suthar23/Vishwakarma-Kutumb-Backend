import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { SearchService } from './search.service';

@UseGuards(JwtAuthGuard)
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  search(
    @Query('q') q: string,
    @Query('gender') gender?: string,
    @Query('maritalStatus') maritalStatus?: string,
    @Query('caste') caste?: string,
    @Query('education') education?: string,
    @Query('occupation') occupation?: string,
    @Query('age') age?: string,
  ) {
    return this.searchService.search({ q, gender, maritalStatus, caste, education, occupation, age });
  }
}
