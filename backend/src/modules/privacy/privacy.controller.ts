import { Controller, Get, Post, Delete, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PrivacyService } from './privacy.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('privacy')
@Controller('api/privacy')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PrivacyController {
    constructor(private readonly privacyService: PrivacyService) { }

    @Get('export')
    @ApiOperation({ summary: 'Export all your personal data (GDPR Art. 20)' })
    @ApiResponse({ status: 200, description: 'Data export successful' })
    async exportData(@Request() req: any) {
        return this.privacyService.exportUserData(req.user.id);
    }

    @Delete('delete')
    @ApiOperation({ summary: 'Delete all your personal data (GDPR Art. 17)' })
    @ApiResponse({ status: 200, description: 'Data deletion successful' })
    async deleteData(@Request() req: any) {
        return this.privacyService.deleteUserData(req.user.id);
    }

    @Get('consent')
    @ApiOperation({ summary: 'Get your current consent preferences' })
    async getConsent(@Request() req: any) {
        return this.privacyService.getConsentStatus(req.user.id);
    }

    @Post('consent')
    @ApiOperation({ summary: 'Update your consent preferences' })
    async updateConsent(
        @Request() req: any,
        @Body() consents: { marketing?: boolean; analytics?: boolean },
    ) {
        return this.privacyService.updateConsent(req.user.id, consents);
    }

    @Get('policy')
    @ApiOperation({ summary: 'Get privacy policy summary' })
    async getPolicy() {
        return this.privacyService.getPrivacyPolicySummary();
    }
}
