import { Controller, Get, NotFoundException, Param, Query } from '@nestjs/common';
import { TransactionsQueryDto } from './dto/transactions-query.dto';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  getTransactions(@Query() query: TransactionsQueryDto) {
    return this.transactionsService.getTransactions(query);
  }

  @Get('school/:schoolId')
  getTransactionsBySchool(
    @Param('schoolId') schoolId: string,
    @Query() query: TransactionsQueryDto,
  ) {
    return this.transactionsService.getTransactions({
      ...query,
      school_id: schoolId,
    });
  }

  @Get('status/:customOrderId')
  async getTransactionStatus(@Param('customOrderId') customOrderId: string) {
    const result = await this.transactionsService.getTransactionStatus(customOrderId);

    if (!result) {
      throw new NotFoundException('Transaction not found');
    }

    return result;
  }
}
